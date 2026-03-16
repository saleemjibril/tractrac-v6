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

const BLOG_API_BASE =
  process.env.NEXT_PUBLIC_BLOG_API_URL || "http://localhost:4000/api/v1";

export default async function relatedBlogs(slug: string): Promise<Post[]> {
  try {
    const res = await fetch(
      `${BLOG_API_BASE}/blog/${encodeURIComponent(slug)}/related?limit=3`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (error) {
    console.log("Error fetching related posts:", error);
    return [];
  }
}