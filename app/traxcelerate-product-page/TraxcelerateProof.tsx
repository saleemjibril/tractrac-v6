import TraxcelerateIcon from "./TraxcelerateIcon";
import type { IconName } from "./TraxcelerateIcon";
import styles from "./traxcelerateProduct.module.css";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

type ProofStat = {
  v: string;
  l: string;
  icon: IconName;
  color: string;
};

const STATS: ProofStat[] = [
  { v: "5,000+", l: "MSPs certified across 21 cohorts", icon: "award", color: "#FA9413" },
  { v: "40,698", l: "Applicants screened", icon: "users", color: "#16A34A" },
  { v: "10 LGAs", l: "Across Nasarawa & Kaduna", icon: "map", color: "#60A5FA" },
  { v: "5 years", l: "Mastercard Foundation ISSAM mandate", icon: "cal", color: "#FBBF24" },
];

export default function TraxcelerateProof() {
  return (
    <section id="proof" className={styles.proof} aria-labelledby="trax-proof-heading">
      <div className={styles.proofGlow} aria-hidden />
      <div className={styles.sectionInner}>
        <div className={styles.sectionCenter}>
          <p className={styles.eyebrow}>Our Proof</p>
          <h2 id="trax-proof-heading" className={styles.sectionTitleLight}>
            {bindTitleOrphans("Already proven at scale")}
          </h2>
          <p className={styles.sectionLeadLight}>
            TRAxCelerate is not a concept. Through the <strong>ISSAM Project</strong> in partnership
            with the <strong>Mastercard Foundation</strong>, TracTrac has been building
            Nigeria&apos;s mechanisation workforce since 2023.
          </p>
        </div>
        <div className={styles.proofGrid}>
          {STATS.map((s) => (
            <article
              key={s.l}
              className={styles.proofCard}
              style={{ "--proof-color": s.color } as React.CSSProperties}
            >
              <div className={styles.proofIconWrap} style={{ background: `${s.color}20` }}>
                <TraxcelerateIcon name={s.icon} size={24} color={s.color} />
              </div>
              <div className={styles.proofValue} style={{ color: s.color }}>
                {s.v}
              </div>
              <div className={styles.proofLabel}>{s.l}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
