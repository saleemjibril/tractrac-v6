
import type { Metadata } from "next";
import BlogInner from "../components/blogInner";

const BLOG_API_BASE =
  process.env.NEXT_PUBLIC_BLOG_API_URL || "http://localhost:4000/api/v1";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://tractrac.co";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${BLOG_API_BASE}/blog?limit=100&page=1`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (error) {
    console.log("Error fetching posts:", error);
    return [];
  }
}

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on agricultural mechanization, tractors, and mechanization services across Africa.",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/blog`,
    title: "Blog | TracTrac MSL",
    description:
      "Latest insights on agricultural mechanization and TracTrac programs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | TracTrac MSL",
    description:
      "Latest insights on agricultural mechanization and TracTrac programs.",
  },
};

// Revalidate the page every 1 hour (3600 seconds)
// This enables Incremental Static Regeneration (ISR)
export const revalidate = 60;

export default async function BlogPosts() {
  const postsWithMedia = await getPosts();

  return (
    <>
      <BlogInner posts={postsWithMedia} />
    </>
  );
}
