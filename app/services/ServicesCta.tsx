import Link from "next/link";
import styles from "./services.module.css";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

export default function ServicesCta() {
  return (
    <section className={styles.cta} aria-labelledby="services-cta-heading">
      <div className={styles.ctaInner}>
        <h2 id="services-cta-heading" className={styles.ctaTitle}>
          {bindTitleOrphans("Ready to get started?")}
        </h2>
        <p className={styles.ctaCopy}>
          Whether you need a tractor, want to list your equipment, or partner
          with us, TracTrac has a path for you.
        </p>
        <div className={styles.ctaActions}>
          <Link href="/products/tractrac-plus" className={styles.ctaPrimary}>
            Get TracTrac Plus
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/contact" className={styles.ctaSecondary}>
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
