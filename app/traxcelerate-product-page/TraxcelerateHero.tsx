import Image from "next/image";
import Link from "next/link";
import TraxcelerateIcon from "./TraxcelerateIcon";
import { TRAX_IMAGES } from "./images";
import styles from "./traxcelerateProduct.module.css";

const STATS = [
  { v: "5,000+", l: "Certified MSPs", sub: "across 21 cohorts" },
  { v: "40,698", l: "Applicants screened", sub: "since 2023" },
  { v: "10", l: "LGAs reached", sub: "Nasarawa & Kaduna" },
  { v: "40%", l: "Women trainees", sub: "minimum per cohort" },
];

export default function TraxcelerateHero() {
  return (
    <section className={styles.hero} aria-labelledby="trax-hero-heading">
      <div className={styles.heroBackdrop} aria-hidden>
        <Image
          src={TRAX_IMAGES.trainingInspection}
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
        <div className={styles.heroBadgeRow}>
          <div className={styles.heroBadge}>
            {/* <span className={styles.pulseDot} aria-hidden /> */}
            <span className={styles.heroBadgeText}>TRAxCelerate</span>
          </div>
        </div>

        <div className={styles.heroMain}>
          <p className={styles.heroKicker}>No more idle farmlands.</p>
          <h1 id="trax-hero-heading" className={styles.heroTitle}>
            The hands that power
            <br />
            <span className={styles.highlight}>mechanisation</span>
          </h1>
          <p className={styles.heroLede}>
            <strong>TRAxCelerate</strong> is TracTrac&apos;s proven, scalable mechanisation
            workforce programme. We recruit, train, certify, and deploy mechanisation service
            providers at scale — turning idle equipment into rural productivity.
          </p>
          <div className={styles.heroCtas}>
            <Link href="#cta" className={styles.btnPrimary}>
              Partner with us
              <span className={styles.btnPrimaryIcon}>
                <TraxcelerateIcon name="arr" size={11} color="#FA9413" strokeWidth={2.5} />
              </span>
            </Link>
            <Link href="#cta" className={styles.btnSecondary}>
              Apply as an MSP
            </Link>
            <Link href="/contact" className={styles.btnGhost}>
              <TraxcelerateIcon name="down" size={15} />
              Download prospectus (PDF, 2.4MB)
            </Link>
          </div>
        </div>

        <div className={styles.heroStatsWrap}>
          <div className={styles.heroStats}>
            {STATS.map((s) => (
              <div key={s.l} className={styles.heroStat}>
                <span className={styles.heroStatValue}>{s.v}</span>
                <span className={styles.heroStatLabel}>{s.l}</span>
                <span className={styles.heroStatSub}>{s.sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.heroBottomPad} />
      </div>
    </section>
  );
}
