import BlogPostDetail from "@/app/components/singleBlogPostInner";
import relatedBlogs from "../related";
import { JSDOM } from "jsdom";
import type { Metadata } from "next";
import Script from "next/script";

interface PostResponse {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  slug: string;
  date: string;
  modified: string;
  author: {
    node: {
      name: string;
      avatar: {
        url: string;
      };
      description: string;
      url: string;
    };
  };
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  toc?: { id: string; content: string }[]; // Add optional TOC field
}

const BLOG_API_BASE =
  process.env.NEXT_PUBLIC_BLOG_API_URL || "http://localhost:4000/api/v1";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://tractrac.co";

const FetchBlogSlug = async (slug: string) => {
  try {
    const res = await fetch(
      `${BLOG_API_BASE}/blog/${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const post: PostResponse | null = json?.data || null;
    if (!post) return null;

    const data_content = post.content;

    // Parse the HTML content
    const dom = new JSDOM(data_content);
    const document = dom.window.document;

    // Find all elements with data-content="true"
    const elements = document.querySelectorAll('[data-content="true"]');
    //console.log("Elements with data-content=true:", elements);

    // Extract the content or IDs of the elements
    const dataContentElements = Array.from(elements).map((el) => {
      const element = el as HTMLElement;
      return {
        id: element.id,
        content: element.textContent || '', // Provide a fallback for null content
      };
    });
    //console.log("Extracted elements:", dataContentElements);

    // Add the extracted elements to the post object
    return {
      ...post,
      toc: dataContentElements, // Add TOC to the post object
    };
  } catch (error) {
    //console.log('Error fetching post:', error);
    return null;
  }
};

function getTextFromHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Revalidate individual blog posts every 1 hour (3600 seconds)
export const revalidate = 60;

// Generate static paths for all existing blog posts at build time
export async function generateStaticParams() {
  try {
    // Fetch a few pages to cover more than 100 slugs if needed (cap to avoid huge builds)
    const slugs: string[] = [];
    const limit = 100;
    for (let page = 1; page <= 10; page += 1) {
      const res = await fetch(`${BLOG_API_BASE}/blog?limit=${limit}&page=${page}`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) break;
      const json = await res.json();
      const data = json?.data || [];
      for (const item of data) slugs.push(item.slug);
      if (!json?.pagination || page >= (json.pagination.totalPages || 1)) break;
    }
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.log("Error fetching posts for static paths:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await FetchBlogSlug(params.slug);
  if (!post) {
    return { title: "Post not found" };
  }

  const description =
    (post.excerpt && getTextFromHtml(post.excerpt)) ||
    getTextFromHtml(post.content).slice(0, 160);

  const url = `${siteUrl}/blog/${post.slug}`;
  const plainTitle = getTextFromHtml(post.title);
  const imageUrl = post.featuredImage?.node?.sourceUrl || undefined;

  return {
    title: plainTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: plainTitle,
      description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: post.featuredImage?.node?.altText || plainTitle,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: plainTitle,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, relatedPosts] = await Promise.all([
    FetchBlogSlug(params.slug),
    relatedBlogs(params.slug),
  ]);

  if (!post) {
    return <div>Post not found</div>;
  }

  const url = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.featuredImage?.node?.sourceUrl || "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: getTextFromHtml(post.title),
    description:
      (post.excerpt && getTextFromHtml(post.excerpt)) ||
      getTextFromHtml(post.content).slice(0, 160),
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: imageUrl || undefined,
    author: {
      "@type": "Person",
      name: post.author?.node?.name || undefined,
      url: post.author?.node?.url || undefined,
    },
    datePublished: post.date,
    dateModified: post.modified,
  };

  return (
    <>
      <Script
        id={`ld-json-blog-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostDetail post={post} relatedPosts={relatedPosts} />
    </>
  );
}