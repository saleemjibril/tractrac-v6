import Link from "next/link";
import { jobCards } from "./jobsData";
import styles from "./careers.module.css";

const TALENT_POOL_HREF = "/careers/talent-pool";

export default function CareersPaths() {
  return (
    <section
      id="careers-paths"
      className={styles.paths}
      aria-labelledby="careers-paths-heading"
    >
      <h2 id="careers-paths-heading" className={styles.srOnly}>
        How to join TracTrac
      </h2>
      <div className={styles.pathsInner}>
        <article
          className={`${styles.pathsPanel} ${styles.pathsPanelListings}`}
          aria-labelledby="careers-job-listings-heading"
        >
          <div className={styles.pathsPanelHeader}>
            <span className={styles.pathsPanelIcon} aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M24 0C22.6252 0 21.3756 0.33972 20.0394 0.89222C18.7594 1.42158 17.2818 2.1989 15.469 3.15252L9.2814 6.4076C7.3146 7.4422 5.7136 8.2844 4.4732 9.102C3.17906 9.9552 2.14726 10.8622 1.39258 12.0882C0.638101 13.314 0.306882 14.621 0.150182 16.124C0 17.5652 0 19.3234 0 21.4846V26.5154C0 28.6766 0 30.4348 0.150182 31.876C0.306882 33.379 0.638101 34.686 1.39258 35.9118C2.14726 37.1378 3.17906 38.0448 4.4732 38.898C5.7136 39.7156 7.3144 40.5578 9.2812 41.5924L15.469 44.8474C17.2818 45.801 18.7594 46.5784 20.0394 47.1078C21.3756 47.6602 22.6252 48 24 48C25.3748 48 26.6244 47.6602 27.9606 47.1078C29.2406 46.5784 30.7182 45.801 32.531 44.8474L38.7188 41.5922C40.6856 40.5576 42.2864 39.7156 43.5268 38.898C44.821 38.0448 45.8528 37.1378 46.6074 35.9118C47.3618 34.686 47.6932 33.379 47.8498 31.876C48 30.4348 48 28.6766 48 26.5154V21.4846C48 19.3234 48 17.5652 47.8498 16.124C47.6932 14.621 47.3618 13.314 46.6074 12.0882C45.8528 10.8622 44.821 9.9552 43.5268 9.102C42.3638 8.3356 40.8842 7.5474 39.0832 6.5994L38.7186 6.4076L32.531 3.15252C30.7182 2.19888 29.2406 1.42158 27.9606 0.89222C26.6244 0.33972 25.3748 0 24 0Z"
                  fill="#FFF4E1"
                />
                <path
                  d="M17 18h14v2H17v-2zm0 5h14v2H17v-2zm0 5h10v2H17v-2z"
                  fill="#101A2A"
                />
              </svg>
            </span>
            <h3 id="careers-job-listings-heading" className={styles.pathsPanelTitle}>
              Job Listings
            </h3>
            <p className={styles.pathsPanelCopy}>
              Explore current openings and find a role where your skills advance
              mechanization for smallholder farmers.
            </p>
          </div>

          <ul className={styles.pathsJobList}>
            {jobCards.map((job) => (
              <li key={job.id}>
                <Link href={job.link} className={styles.pathsJobItem}>
                  <span className={styles.pathsJobItemMain}>
                    <span className={styles.pathsJobItemTitle}>{job.title}</span>
                    <span className={styles.pathsJobItemMeta}>
                      {job.location} · {job.type}
                    </span>
                  </span>
                  <span className={styles.pathsJobItemArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link href="#open-positions" className={styles.pathsPanelLink}>
            View all open positions
            <span aria-hidden="true">→</span>
          </Link>
        </article>

        <article
          className={`${styles.pathsPanel} ${styles.pathsPanelTalent}`}
          aria-labelledby="careers-talent-pool-heading"
        >
          <div className={styles.pathsPanelHeader}>
            <span className={styles.pathsPanelIcon} aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M24 0C22.6252 0 21.3756 0.33972 20.0394 0.89222C18.7594 1.42158 17.2818 2.1989 15.469 3.15252L9.2814 6.4076C7.3146 7.4422 5.7136 8.2844 4.4732 9.102C3.17906 9.9552 2.14726 10.8622 1.39258 12.0882C0.638101 13.314 0.306882 14.621 0.150182 16.124C0 17.5652 0 19.3234 0 21.4846V26.5154C0 28.6766 0 30.4348 0.150182 31.876C0.306882 33.379 0.638101 34.686 1.39258 35.9118C2.14726 37.1378 3.17906 38.0448 4.4732 38.898C5.7136 39.7156 7.3144 40.5578 9.2812 41.5924L15.469 44.8474C17.2818 45.801 18.7594 46.5784 20.0394 47.1078C21.3756 47.6602 22.6252 48 24 48C25.3748 48 26.6244 47.6602 27.9606 47.1078C29.2406 46.5784 30.7182 45.801 32.531 44.8474L38.7188 41.5922C40.6856 40.5576 42.2864 39.7156 43.5268 38.898C44.821 38.0448 45.8528 37.1378 46.6074 35.9118C47.3618 34.686 47.6932 33.379 47.8498 31.876C48 30.4348 48 28.6766 48 26.5154V21.4846C48 19.3234 48 17.5652 47.8498 16.124C47.6932 14.621 47.3618 13.314 46.6074 12.0882C45.8528 10.8622 44.821 9.9552 43.5268 9.102C42.3638 8.3356 40.8842 7.5474 39.0832 6.5994L38.7186 6.4076L32.531 3.15252C30.7182 2.19888 29.2406 1.42158 27.9606 0.89222C26.6244 0.33972 25.3748 0 24 0Z"
                  fill="#D7D8FF"
                />
                <path
                  d="M24 26c3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6 2.7 6 6 6zm-8 4c0-2.2 3.6-4 8-4s8 1.8 8 4v2H16v-2z"
                  fill="#101A2A"
                />
              </svg>
            </span>
            <h3 id="careers-talent-pool-heading" className={styles.pathsPanelTitle}>
              Join our talent pool
            </h3>
            <p className={styles.pathsPanelCopy}>
              Don&apos;t see the right role today? Share your CV and areas of
              interest—we&apos;ll reach out when a matching opportunity opens.
            </p>
          </div>

          <ul className={styles.pathsTalentPoints}>
            <li>Stay connected for future roles across programs and locations</li>
            <li>Ideal for specialists in agri-tech, operations, M&amp;E, and comms</li>
            <li>Send your CV with a short note on what you&apos;d like to contribute</li>
          </ul>

          <Link href={TALENT_POOL_HREF} className={styles.pathsPanelCta}>
            Join the talent pool
            <span aria-hidden="true">→</span>
          </Link>
        </article>
      </div>
    </section>
  );
}
