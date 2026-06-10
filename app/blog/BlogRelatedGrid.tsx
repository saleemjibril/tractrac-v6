import Image from "next/image";
import Link from "next/link";
import type { BlogCard, BlogTagTone } from "./blogApi";
import styles from "./blog.module.css";

const CATEGORY_CLASS: Record<BlogTagTone, string> = {
  orange: styles.categoryOrange,
  teal: styles.categoryTeal,
  indigo: styles.categoryIndigo,
};

export default function BlogRelatedGrid({ posts }: { posts: BlogCard[] }) {
  return (
    <div className={styles.grid}>
      {posts.map((post) => (
        <article key={post.id} className={styles.card}>
          <Link
            href={`/blog/${encodeURIComponent(post.slug)}`}
            className={styles.cardLink}
          >
            <div className={styles.imageWrap}>
              <Image
                src={post.imageUrl}
                alt={post.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={styles.image}
                unoptimized
              />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardMeta}>
                <span
                  className={`${styles.category} ${CATEGORY_CLASS[post.tagTone]}`}
                >
                  {post.category}
                </span>
                <time className={styles.date} dateTime={post.date}>
                  {post.dateLabel}
                </time>
              </div>
              <h3 className={styles.cardTitle}>{post.title}</h3>
              {post.excerpt && <p className={styles.cardExcerpt}>{post.excerpt}</p>}
              <span className={styles.readLink}>Read story →</span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
