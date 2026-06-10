import styles from "./blog.module.css";

export default function BlogHero() {
  return (
    <section className={styles.hero} aria-labelledby="blog-hero-heading">
      <div className={styles.heroInner}>
        <span className={styles.sectionTag}>
          {/* <span className={styles.sectionTagDot} aria-hidden="true" /> */}
          <span>Insights &amp; News</span>
        </span>
        <h1 id="blog-hero-heading" className={styles.heroTitle}>
          Insights on Agricultural Mechanization
        </h1>
        <p className={styles.heroLede}>
          Stories, updates, and perspectives from TracTrac on mechanization,
          smallholder farmers, and building sustainable food systems across
          Nigeria and Africa.
        </p>
      </div>
    </section>
  );
}
