import TraxcelerateIcon from "./TraxcelerateIcon";
import type { IconName } from "./TraxcelerateIcon";
import styles from "./traxcelerateProduct.module.css";

const STEPS: { n: string; t: string; i: IconName; d: string }[] = [
  {
    n: "01",
    t: "Recruit",
    i: "users",
    d: "We mobilise and screen youth and women across target states using community networks and government referrals. Minimum 30% women per cohort.",
  },
  {
    n: "02",
    t: "Train",
    i: "book",
    d: "3–4 weeks of intensive hands-on training covering equipment operation, maintenance, business skills, and digital tools. Field practicals included.",
  },
  {
    n: "03",
    t: "Certify",
    i: "award",
    d: "Graduates receive the TracTrac MSP Certificate — Nigeria's only industry-recognised mechanisation workforce credential.",
  },
  {
    n: "04",
    t: "Deploy",
    i: "laptop",
    d: "Every MSP is integrated into TractracPlus — Nigeria's leading farm mechanisation platform — for real-time job matching, bookings, and income tracking.",
  },
  {
    n: "05",
    t: "Sustain",
    i: "refresh",
    d: "Cooperatives, mentorship, business support, and digital income streams keep MSPs active, productive, and economically resilient.",
  },
];

export default function TraxcelerateHow() {
  return (
    <section id="how" className={styles.how} aria-labelledby="trax-how-heading">
      <div className={styles.sectionInner}>
        <div className={styles.sectionCenterHow}>
          <p className={styles.eyebrow}>How It Works</p>
          <h2 id="trax-how-heading" className={`${styles.sectionTitle} ${styles.howTitle}`}>
            The turnkey workforce solution
          </h2>
          <p className={styles.howLead}>
            This is beyond a one-time training. We build mechanisation ecosystems.
          </p>
        </div>
        <div className={styles.stepsGrid}>
          {STEPS.map((s) => (
            <article key={s.n} className={styles.stepCard}>
              <div className={styles.stepTop}>
                <div className={styles.stepIconWrap}>
                  <TraxcelerateIcon name={s.i} size={22} color="#FA9413" />
                </div>
                <span className={styles.stepNum}>{s.n}</span>
              </div>
              <h3 className={styles.stepTitle}>{s.t}</h3>
              <p className={styles.stepDesc}>{s.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
