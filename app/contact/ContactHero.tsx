import styles from "./contact.module.css";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

export default function ContactHero() {
  return (
    <section className={styles.hero} aria-labelledby="contact-hero-heading">
      <div className={styles.heroInner}>
        <span className={styles.sectionTag}>
          {/* <span className={styles.sectionTagDot} aria-hidden="true" /> */}
          <span>Get in touch</span>
        </span>
        <h1 id="contact-hero-heading" className={styles.heroTitle}>
          {bindTitleOrphans("Let's Talk")}
        </h1>
        <p className={styles.heroLede}>
          We are open to partnerships with organizations that share our vision
          of a more mechanized and sustainable Nigeria, and we are here to help
          with your questions.
        </p>
      </div>
    </section>
  );
}
