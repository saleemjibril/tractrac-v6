import Link from "next/link";
import styles from "./aboutUs.module.css";

// TODO: replace with the real careers page once it exists.
const OPEN_POSITIONS_HREF = "/careers";

export default function AboutCta() {
  return (
    <section className={styles.cta} aria-labelledby="about-cta-heading">
      <div className={styles.ctaInner}>
        <h2 id="about-cta-heading" className={styles.ctaTitle}>
          Join the Humans of TracTrac
        </h2>
        <p className={styles.ctaCopy}>
          We are boldly advancing mechanization across Nigeria and Africa. If
          you are passionate about transforming agriculture, strengthening food
          systems, and building solutions that empower farmers, come work with
          us. Together, we can ensure that mechanization reaches the farmers
          who need it most.
        </p>
        <Link href={OPEN_POSITIONS_HREF} className={styles.ctaButton}>
          <span>See Open Positions</span>
          <span className={styles.ctaButtonArrow} aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
