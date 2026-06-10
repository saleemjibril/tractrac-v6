import Link from "next/link";
import TraxcelerateIcon from "../traxcelerate-product-page/TraxcelerateIcon";
import type { ProductPageConfig } from "./productMarketing.types";
import styles from "../traxcelerate-product-page/traxcelerateProduct.module.css";

export default function ProductMarketingCta({
  cta,
}: {
  cta: ProductPageConfig["cta"];
}) {
  return (
    <section id="cta" className={styles.cta} aria-labelledby="product-cta-heading">
      <div className={styles.ctaGlow} aria-hidden />
      <div className={styles.ctaGridBg} aria-hidden />
      <div className={styles.ctaInner}>
        <div className={styles.ctaBadge}>
          <TraxcelerateIcon name="spark" size={14} color="#FA9413" />
          <span className={styles.ctaBadgeText}>{cta.badge}</span>
        </div>
        <h2 id="product-cta-heading" className={styles.ctaTitle}>
          {cta.title}
          {cta.titleHighlight ? (
            <>
              <br />
              <span className={styles.highlight}>{cta.titleHighlight}</span>
            </>
          ) : null}
        </h2>
        <p className={styles.ctaLead}>{cta.lead}</p>
        <div className={styles.ctaActions}>
          <Link href={cta.primary.href} className={styles.btnCtaPrimary}>
            <TraxcelerateIcon name="cal" size={18} color="#060C15" strokeWidth={2} />
            {cta.primary.label}
          </Link>
          {cta.secondary && (
            <Link href={cta.secondary.href} className={styles.btnCtaSecondary}>
              {cta.secondary.label}
            </Link>
          )}
          {cta.link && (
            <Link href={cta.link.href} className={styles.btnCtaLink}>
              {cta.link.label} <TraxcelerateIcon name="arr" size={16} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
