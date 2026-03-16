import type { MetadataRoute } from "next";

const BLOG_API_BASE =
  process.env.NEXT_PUBLIC_BLOG_API_URL || "http://localhost:4000/api/v1";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://tractrac.co";

interface BlogPostSlug {
  slug: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
    },
  ];

  try {
    const slugs: string[] = [];
    const limit = 100;

    for (let page = 1; page <= 10; page += 1) {
      const res = await fetch(
        `${BLOG_API_BASE}/blog?limit=${limit}&page=${page}`,
        { next: { revalidate: 60 } }
      );
      if (!res.ok) break;
      const json = await res.json();
      const data: BlogPostSlug[] = json?.data || [];
      if (!data.length) break;
      for (const item of data) {
        slugs.push(item.slug);
      }
      if (!json?.pagination || page >= (json.pagination.totalPages || 1)) {
        break;
      }
    }

    slugs.forEach((slug) => {
      routes.push({
        url: `${siteUrl}/blog/${slug}`,
        lastModified: new Date(),
      });
    });
  } catch {
    // If the blog API is unavailable, fall back to the static routes above.
  }

  return routes;
}

