import type { Metadata } from "next";
import { Chivo } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import TractracHomepageNav from "../../tractrac-homepage/TractracHomepageNav";
import TractracFooter from "../../tractrac-homepage/TractracFooter";
import BlogPostView from "../BlogPostView";
import {
  BLOG_API_BASE,
  getBlogPost,
  getBlogPosts,
  getRelatedBlogPosts,
  mapToBlogCards,
  stripHtml,
} from "../blogApi";
import { prepareBlogPost } from "../blogPostUtils";
import styles from "../blogPost.module.css";

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tractrac.co";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
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
  const post = await getBlogPost(params.slug);
  if (!post) {
    return { title: "Post not found" };
  }

  const description =
    (post.excerpt && stripHtml(post.excerpt)) ||
    stripHtml(post.content).slice(0, 160);

  const url = `${siteUrl}/blog/${post.slug}`;
  const plainTitle = stripHtml(post.title);
  const imageUrl = post.featuredImage?.node?.sourceUrl || undefined;

  return {
    title: plainTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: plainTitle,
      description,
      images: imageUrl
        ? [{ url: imageUrl, alt: post.featuredImage?.node?.altText || plainTitle }]
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
  const rawPost = await getBlogPost(params.slug);
  if (!rawPost) {
    notFound();
  }

  const [post, relatedRaw] = await Promise.all([
    Promise.resolve(prepareBlogPost(rawPost)),
    getRelatedBlogPosts(params.slug, 3),
  ]);

  const relatedPosts = mapToBlogCards(relatedRaw);
  const url = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.featuredImage?.node?.sourceUrl || "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description:
      (post.excerpt && stripHtml(post.excerpt)) || stripHtml(post.content).slice(0, 160),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
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
    <div className={`${styles.articlePage} ${chivo.className}`}>
      <Script
        id={`ld-json-blog-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TractracHomepageNav />
      <main>
        <BlogPostView post={post} relatedPosts={relatedPosts} />
      </main>
      <TractracFooter />
    </div>
  );
}
