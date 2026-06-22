import Link from "next/link";
import styles from "./services.module.css";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

export default function ServicesHero() {
  return (
    <section className={styles.hero} aria-labelledby="services-hero-heading">
      <div className={styles.heroInner}>
        <span className={styles.sectionTag}>
          {/* <span className={styles.sectionTagDot} aria-hidden="true" /> */}
          <span>What we do</span>
        </span>
        <h1 id="services-hero-heading" className={styles.heroTitle}>
          {bindTitleOrphans("Bridging the Gap to Mechanisation")}
        </h1>
        <p className={styles.heroLede}>
          We connect farmers, tractor owners, agents, investors, and vendors
          through digital tools and trusted networks, making mechanization
          accessible across Nigeria and Africa.
        </p>
        <Link href="#services-list" className={styles.heroCta}>
          Explore our services
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
