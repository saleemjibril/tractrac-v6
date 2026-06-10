export const BLOG_API_BASE =
  process.env.NEXT_PUBLIC_BLOG_API_URL || "http://localhost:4000/api/v1";

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  };
};

export type BlogPostDetail = BlogPost & {
  content: string;
  modified: string;
  author?: {
    node?: {
      name?: string;
      avatar?: { url?: string };
      description?: string;
      url?: string;
    };
  };
  toc?: { id: string; content: string }[];
};

export type BlogTagTone = "orange" | "teal" | "indigo";

export type BlogCard = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  dateLabel: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  tagTone: BlogTagTone;
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80";

const TAG_TONES: BlogTagTone[] = ["orange", "teal", "indigo"];

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();
}

export function excerptPlain(html: string, max: number): string {
  const text = stripHtml(html);
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function getBlogPosts(
  limit = 100,
  page = 1
): Promise<BlogPost[]> {
  try {
    const res = await fetch(
      `${BLOG_API_BASE}/blog?limit=${limit}&page=${page}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch (error) {
    console.log("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPostDetail | null> {
  try {
    const res = await fetch(
      `${BLOG_API_BASE}/blog/${encodeURIComponent(slug)}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch (error) {
    console.log("Error fetching blog post:", error);
    return null;
  }
}

export async function getRelatedBlogPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  try {
    const res = await fetch(
      `${BLOG_API_BASE}/blog/${encodeURIComponent(slug)}/related?limit=${limit}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch (error) {
    console.log("Error fetching related posts:", error);
    return [];
  }
}

export function mapToBlogCards(posts: BlogPost[]): BlogCard[] {
  return posts.map((post, index) => ({
    id: post.id,
    title: post.title,
    excerpt: excerptPlain(post.excerpt || "", 160),
    slug: post.slug,
    date: post.date,
    dateLabel: formatPostDate(post.date),
    imageUrl: post.featuredImage?.node?.sourceUrl || DEFAULT_IMAGE,
    imageAlt: post.featuredImage?.node?.altText || post.title,
    category: "Insights",
    tagTone: TAG_TONES[index % TAG_TONES.length],
  }));
}
