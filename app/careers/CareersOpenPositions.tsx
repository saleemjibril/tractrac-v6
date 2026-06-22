import Link from "next/link";
import { jobCards } from "./jobsData";
import styles from "./careers.module.css";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

export default function CareersOpenPositions() {
  return (
    <section
      id="open-positions"
      className={styles.positions}
      aria-labelledby="careers-positions-heading"
    >
      <div className={styles.positionsInner}>
        <header className={styles.sectionHeaderCenter}>
          <span className={styles.sectionTag}>
            {/* <span className={styles.sectionTagDot} aria-hidden="true" /> */}
            <span>Open roles</span>
          </span>
          <h2 id="careers-positions-heading" className={styles.sectionTitle}>
            {bindTitleOrphans("Open Positions")}
          </h2>
        </header>

        <ul className={styles.positionsList}>
          {jobCards.map((job) => (
            <li key={job.id}>
              <article className={styles.jobCard}>
                <div className={styles.jobCardTop}>
                  <h3 className={styles.jobTitle}>{job.title}</h3>
                  <span className={styles.jobTypePill}>{job.type}</span>
                </div>
                <p className={styles.jobLocation}>{job.location}</p>
                <p className={styles.jobSummary}>{job.summary}</p>
                <Link href={job.link} className={styles.jobLink}>
                  View details
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
