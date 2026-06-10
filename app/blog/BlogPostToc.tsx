"use client";

import styles from "./blogPost.module.css";

type TocItem = { id: string; content: string };

function scrollToHeading(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function TocList({ items }: { items: TocItem[] }) {
  return (
    <ul className={styles.tocList}>
      {items.map((item) => (
        <li key={item.id} className={styles.tocItem}>
          {/* <span className={styles.tocDot} aria-hidden="true" /> */}
          <button
            type="button"
            className={styles.tocLink}
            onClick={() => scrollToHeading(item.id)}
          >
            {item.content}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function BlogPostTocSidebar({ items }: { items: TocItem[] }) {
  if (!items.length) return null;

  return (
    <aside className={styles.toc} aria-labelledby="blog-toc-heading">
      <h2 id="blog-toc-heading" className={styles.tocTitle}>
        In this article
      </h2>
      <TocList items={items} />
    </aside>
  );
}

export function BlogPostTocMobile({ items }: { items: TocItem[] }) {
  if (!items.length) return null;

  return (
    <nav className={styles.tocMobile} aria-labelledby="blog-toc-mobile-heading">
      <h2 id="blog-toc-mobile-heading" className={styles.tocTitle}>
        In this article
      </h2>
      <TocList items={items} />
    </nav>
  );
}
