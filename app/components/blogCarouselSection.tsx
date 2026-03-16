import BlogCarousel from "./blogCarousel";
import { ChakraWrapper } from "../chakraUIWrapper";

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

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${BLOG_API_BASE}/blog?limit=12&page=1`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (error) {
    console.log("Error fetching posts for carousel:", error);
    return [];
  }
}

// Revalidate the carousel content every 1 hour (3600 seconds)
export const revalidate = 60;

export default async function BlogCarouselSection() {
  const posts = await getPosts();
  if (!posts || posts.length === 0) return null;
  return (
    <ChakraWrapper>
      <BlogCarousel posts={posts} heading="Insights on Agricultural Mechanization" />
    </ChakraWrapper>
  );
}


