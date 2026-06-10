import Image from "next/image";
import Link from "next/link";
import type { BlogCard, BlogTagTone } from "./blogApi";
import styles from "./blog.module.css";

const CATEGORY_CLASS: Record<BlogTagTone, string> = {
  orange: styles.categoryOrange,
  teal: styles.categoryTeal,
  indigo: styles.categoryIndigo,
};

type BlogGridProps = {
  posts: BlogCard[];
};

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <section className={styles.listing} aria-label="Blog articles">
      <div className={styles.listingInner}>
        {posts.length === 0 ? (
          <div className={styles.empty}>
            <h2 className={styles.emptyTitle}>No articles yet</h2>
            <p className={styles.emptyCopy}>
              Check back soon for insights on agricultural mechanization and
              TracTrac programs.
            </p>
          </div>
        ) : (
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
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
                    <h2 className={styles.cardTitle}>{post.title}</h2>
                    {post.excerpt && (
                      <p className={styles.cardExcerpt}>{post.excerpt}</p>
                    )}
                    <span className={styles.readLink}>
                      Read story →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
