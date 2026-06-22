import Link from "next/link";
import { BoundTitleWithHighlight } from "@/app/components/marketing/BoundTitle";
import TraxcelerateIcon from "./TraxcelerateIcon";
import styles from "./traxcelerateProduct.module.css";

export default function TraxcelerateCta() {
  return (
    <section id="cta" className={styles.cta} aria-labelledby="trax-cta-heading">
      <div className={styles.ctaGlow} aria-hidden />
      <div className={styles.ctaGridBg} aria-hidden />
      <div className={styles.ctaInner}>
        <div className={styles.ctaBadge}>
          <TraxcelerateIcon name="spark" size={14} color="#FA9413" />
          <span className={styles.ctaBadgeText}>Now open for co-funding partners</span>
        </div>
        <BoundTitleWithHighlight
          as="h2"
          id="trax-cta-heading"
          className={styles.ctaTitle}
          title="Ready to build Nigeria's mechanisation workforce?"
          highlight="mechanisation workforce?"
          highlightClassName={styles.highlight}
        />
        <p className={styles.ctaLead}>
          Schedule a briefing, download the full prospectus, or apply directly as an MSP.
          TRAxCelerate is now open for co-funding partners across all states.
        </p>
        <div className={styles.ctaActions}>
          <Link href="/contact" className={styles.btnCtaPrimary}>
            <TraxcelerateIcon name="cal" size={18} color="#060C15" strokeWidth={2} />
            Schedule a briefing
          </Link>
          <Link href="/contact" className={styles.btnCtaSecondary}>
            <TraxcelerateIcon name="down" size={18} />
            Download prospectus
          </Link>
          <Link href="/contact" className={styles.btnCtaLink}>
            Apply as MSP <TraxcelerateIcon name="arr" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
