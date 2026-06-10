"use client";

import Image from "next/image";
import Link from "next/link";
import type { BlogCard, BlogPostDetail } from "./blogApi";
import { formatPostDate } from "./blogApi";
import { BlogPostTocMobile, BlogPostTocSidebar } from "./BlogPostToc";
import BlogRelatedGrid from "./BlogRelatedGrid";
import styles from "./blogPost.module.css";

type BlogPostViewProps = {
  post: BlogPostDetail;
  relatedPosts: BlogCard[];
};

export default function BlogPostView({ post, relatedPosts }: BlogPostViewProps) {
  const toc = post.toc ?? [];
  const hasToc = toc.length > 0;
  const updatedLabel = formatPostDate(post.modified || post.date);
  const featuredSrc = post.featuredImage?.node?.sourceUrl;
  const author = post.author?.node;

  return (
    <>
      <div className={styles.articleMain}>
        <Link href="/blog" className={styles.backLink}>
          ← Back to blog
        </Link>

        <div
          className={`${styles.articleLayout} ${hasToc ? styles.hasToc : ""}`}
        >
          <article className={styles.articleColumn}>
            <h1 className={styles.articleTitle}>{post.title}</h1>
            <p className={styles.articleMeta}>Updated on {updatedLabel}</p>

            {hasToc && <BlogPostTocMobile items={toc} />}

            {featuredSrc && (
              <div className={styles.featuredWrap}>
                <Image
                  src={featuredSrc}
                  alt={post.featuredImage?.node?.altText || post.title}
                  fill
                  priority
                  sizes="(max-width: 800px) 100vw, 800px"
                  className={styles.featuredImage}
                  unoptimized
                />
              </div>
            )}

            <div
              className={styles.prose}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {author?.name && (
              <div className={styles.author}>
                <div className={styles.authorInner}>
                  {author.avatar?.url && (
                    <Image
                      src={author.avatar.url}
                      alt={`${author.name}'s avatar`}
                      width={80}
                      height={80}
                      className={styles.authorAvatar}
                      unoptimized
                    />
                  )}
                  <div>
                    <p className={styles.authorName}>{author.name}</p>
                    {author.description && (
                      <div
                        className={styles.authorBio}
                        dangerouslySetInnerHTML={{
                          __html: author.description.replace(/\r\n/g, "<br />"),
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </article>

          {hasToc && <BlogPostTocSidebar items={toc} />}
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <section className={styles.related} aria-labelledby="related-heading">
          <div className={styles.relatedInner}>
            <h2 id="related-heading" className={styles.relatedTitle}>
              Related articles
            </h2>
            <BlogRelatedGrid posts={relatedPosts} />
          </div>
        </section>
      )}
    </>
  );
}
