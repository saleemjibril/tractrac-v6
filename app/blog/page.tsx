import type { Metadata } from "next";
import { Chivo } from "next/font/google";
import TractracHomepageNav from "../tractrac-homepage/TractracHomepageNav";
import TractracFooter from "../tractrac-homepage/TractracFooter";
import BlogHero from "./BlogHero";
import BlogGrid from "./BlogGrid";
import { getBlogPosts, mapToBlogCards } from "./blogApi";
import styles from "./blog.module.css";

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tractrac.co";

export const metadata: Metadata = {
  title: "Blog — Insights & News",
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

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getBlogPosts(100, 1);
  const cards = mapToBlogCards(posts);

  return (
    <div className={`${styles.page} ${chivo.className}`}>
      <TractracHomepageNav />
      <main>
        <BlogHero />
        <BlogGrid posts={cards} />
      </main>
      <TractracFooter />
    </div>
  );
}
