import Image from "next/image";
import Link from "next/link";
import styles from "./careers.module.css";

const HERO_IMAGE =
  "https://res.cloudinary.com/tractrac-global/image/upload/v1758234338/WhatsApp_Image_2025-09-18_at_23.24.35_jn4rlf.jpg";

export default function CareersHero() {
  return (
    <section className={styles.hero} aria-labelledby="careers-hero-heading">
      <div className={styles.heroBackdrop} aria-hidden>
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroGradientH} />
        <div className={styles.heroGradientV} />
      </div>

      <div className={styles.heroInner}>
        <span className={styles.heroTag}>
          {/* <span className={styles.heroTagDot} aria-hidden="true" /> */}
          <span>Careers at TracTrac</span>
        </span>
        <h1 id="careers-hero-heading" className={styles.heroTitle}>
          Join the Humans of TracTrac
        </h1>
        <p className={styles.heroLede}>
          Build technology and partnerships that put mechanization in reach of
          smallholder farmers across Nigeria and Sub-Saharan Africa.
        </p>
        <Link href="#careers-paths" className={styles.heroCta}>
          See open roles
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
