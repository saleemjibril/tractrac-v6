"use client";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./careers.module.css";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
};

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "").trim();
}

export default function CareersBlog() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://msps.tractrac.co/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query AllPosts {
                posts(first: 8) {
                  nodes {
                    id
                    title
                    excerpt
                    slug
                    date
                    featuredImage {
                      node {
                        sourceUrl
                        altText
                      }
                    }
                  }
                }
              }
            `,
          }),
        });
        const data = await response.json();
        if (data.data?.posts?.nodes) {
          setPosts(data.data.posts.nodes);
        }
      } catch {
        /* optional section — fail silently */
      }
    };

    fetchPosts();
  }, []);

  if (!posts.length) return null;

  return (
    <section className={styles.blog} aria-labelledby="careers-blog-heading">
      <div className={styles.blogInner}>
        <header className={styles.blogHeader}>
          <div>
            <span className={styles.sectionTag}>
              {/* <span className={styles.sectionTagDot} aria-hidden="true" /> */}
              <span>Insights</span>
            </span>
            <h2 id="careers-blog-heading" className={styles.sectionTitle}>
              {bindTitleOrphans("Learn more about us")}
            </h2>
            <p className={styles.sectionSubtitle}>
              Stories and updates from our work in agricultural mechanization.
            </p>
          </div>
          <Link href="/blog" className={styles.blogViewAll}>
            View all posts →
          </Link>
        </header>

        <div className={styles.blogTrack} role="list">
          {posts.map((post) => {
            const image = post.featuredImage?.node;
            return (
              <article key={post.id} className={styles.blogCard} role="listitem">
                <Link href={`/blog/${post.slug}`} className={styles.blogCardLink}>
                  <div className={styles.blogCardImageWrap}>
                    {image?.sourceUrl ? (
                      <Image
                        src={image.sourceUrl}
                        alt={image.altText || post.title}
                        fill
                        sizes="280px"
                        className={styles.blogCardImage}
                        unoptimized
                      />
                    ) : (
                      <div className={styles.blogCardPlaceholder} aria-hidden />
                    )}
                  </div>
                  <h3 className={styles.blogCardTitle}>{post.title}</h3>
                  <p className={styles.blogCardExcerpt}>
                    {stripHtml(post.excerpt).slice(0, 120)}
                    {stripHtml(post.excerpt).length > 120 ? "…" : ""}
                  </p>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
