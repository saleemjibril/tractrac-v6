import Image from "next/image";
import { TRAX_IMAGES } from "./images";
import styles from "./traxcelerateProduct.module.css";

const STATS = [
  {
    big: "<40%",
    variant: "orange" as const,
    small: "Average tractor utilisation across Nigeria's farming communities",
  },
  {
    big: "₦1.2T+",
    variant: "dark" as const,
    small: "Estimated annual productivity loss from idle mechanisation assets",
  },
  {
    big: "Zero",
    variant: "orange" as const,
    small: "Certified MSP training programmes at national scale — before TRAxCelerate",
  },
];

export default function TraxcelerateProblem() {
  return (
    <section className={styles.problem} aria-labelledby="trax-problem-heading">
      <div className={styles.problemGlow} aria-hidden />
      <div className={styles.sectionInner}>
        <div className={styles.problemGrid}>
          <div>
            <p className={styles.eyebrow}>The Problem</p>
            <h2
              id="trax-problem-heading"
              className={`${styles.sectionTitle} ${styles.problemTitle}`}
            >
              The gap that&apos;s costing Nigeria <span className={styles.highlight}>billions</span>
            </h2>
            <div className={styles.problemCopy}>
              <p className={styles.sectionLead}>
                Nigeria has invested over <strong>₦500 billion</strong> in tractors, combines, and
                agricultural machinery.
              </p>
              <p className={styles.sectionLead}>
                Yet utilisation rates remain below 40%. Not because the machines are broken — because
                there aren&apos;t enough skilled hands to run them.
              </p>
            </div>
            <div className={styles.statCards}>
              {STATS.map((s) => (
                <div key={s.big} className={styles.statCard}>
                  <span
                    className={
                      s.variant === "orange" ? styles.statCardBigOrange : styles.statCardBigDark
                    }
                  >
                    {s.big}
                  </span>
                  <span className={styles.statCardSmall}>{s.small}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.problemImageWrap}>
            <Image
              src={TRAX_IMAGES.operatorTrainer}
              alt="Trainer guiding an operator in the field"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className={styles.problemImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
