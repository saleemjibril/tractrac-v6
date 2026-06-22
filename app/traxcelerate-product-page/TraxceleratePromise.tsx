import TraxcelerateIcon from "./TraxcelerateIcon";
import type { IconName } from "./TraxcelerateIcon";
import styles from "./traxcelerateProduct.module.css";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

const ITEMS: { t: string; d: string; i: IconName }[] = [
  {
    t: "Certification that counts",
    d: "TracTrac MSP certificates are recognised by OEM partners, state governments, NCAM, AMTA, and agribusinesses, enabling immediate employability.",
    i: "award",
  },
  {
    t: "Technology-first deployment",
    d: "All MSPs are onboarded to TractracPlus for real-time job matching, a digital livelihood, not just a certificate.",
    i: "laptop",
  },
  {
    t: "Measurable ROI",
    d: "Every partner receives a structured impact dashboard with KPIs, job creation data, uptime metrics, and narrative case studies.",
    i: "trend",
  },
  {
    t: "Inclusivity by design",
    d: "40% minimum women and youth per cohort, contributing to SDGs 2, 5, and 8, fully bankable for development finance reporting.",
    i: "users",
  },
];

const SDGS = ["SDG 2", "SDG 5", "SDG 8", "SDG 9", "SDG 17"];

export default function TraxceleratePromise() {
  return (
    <section className={styles.promise} aria-labelledby="trax-promise-heading">
      <div className={styles.sectionInner}>
        <div className={styles.sectionCenterPromise}>
          <p className={styles.eyebrow}>Our Promise</p>
          <h2
            id="trax-promise-heading"
            className={`${styles.sectionTitle}`}
          >
            {bindTitleOrphans("What every partner can count on")}
          </h2>
        </div>
        <div className={styles.promiseGrid}>
          {ITEMS.map((it) => (
            <article key={it.t} className={styles.promiseCard}>
              <div className={styles.promiseIconWrap}>
                <TraxcelerateIcon name={it.i} size={24} color="#FA9413" />
              </div>
              <div>
                <h3 className={styles.promiseCardTitle}>{it.t}</h3>
                <p className={styles.promiseCardDesc}>{it.d}</p>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.promiseStrip}>
          <div className={styles.promiseStripGlow} aria-hidden />
          <div className={styles.promiseStripInner}>
            <div className={styles.statePills}>
              <span className={styles.statePillActive}>
                {/* <span className={styles.statePillDot} aria-hidden /> */}
                Kaduna active
              </span>
              <span className={styles.statePillActive}>
                {/* <span className={styles.statePillDot} aria-hidden /> */}
                Nasarawa active
              </span>
              <span className={styles.statePillNext}>Your state, next?</span>
            </div>
            <div className={styles.sdgRow}>
              {SDGS.map((s) => (
                <span key={s} className={styles.sdgPill}>
                  {s}
                </span>
              ))}
              <span className={styles.sdgPillOrange}>
                {/* <span className={styles.sdgPillDot} aria-hidden /> */}
                TractracPlus
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
