import Image from "next/image";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";
import styles from "./aboutUs.module.css";

const STATES = [
  "Kaduna",
  "Nasarawa",
  "Abuja (FCT)",
  "Adamawa",
  "Kano",
  "Oyo",
  "Enugu",
];

const TRACTRAC_YOUTUBE_URL = "https://www.youtube.com/@TractracGlobal";

export default function AboutHero() {
  return (
    <section className={styles.hero} aria-labelledby="about-hero-heading">
      <div className={styles.heroInner}>
        <span className={styles.heroTag}>
          {/* <span className={styles.heroTagDot} aria-hidden="true" /> */}
          <span>About TracTrac MSL</span>
        </span>

        <h1 id="about-hero-heading" className={styles.heroTitle}>
          {bindTitleOrphans("Mechanization for the Last Mile.")}
        </h1>

        <p className={styles.heroLede}>
          <span>That&apos;s what drives us.</span> <br />
          TracTrac is bringing tractors, technology, and opportunity to the
          smallholder farmers who have long been excluded from mechanization
          access.
        </p>

        <a
          className={styles.heroVideoCard}
          href={TRACTRAC_YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch TracTrac impact highlights on YouTube (opens in new tab)"
        >
          <Image
            src="https://api.tractrac.co/media/images/7186f738-9967-41c5-aa7a-e227bbfc62da.jpg"
            alt=""
            fill
            sizes="(max-width: 800px) 100vw, 800px"
            className={styles.heroVideoImg}
            priority
          />

          <span className={styles.heroVideoOverlay}>
            <span className={styles.heroPlayBtn} aria-hidden="true">
              <svg
                className={styles.heroPlayIcon}
                viewBox="0 0 24 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="presentation"
              >
                <path
                  d="M22.5 11.27a2 2 0 0 1 0 3.46L4.5 25.27A2 2 0 0 1 1.5 23.54V2.46A2 2 0 0 1 4.5.73L22.5 11.27Z"
                  fill="#FA9510"
                />
              </svg>
            </span>
            <span className={styles.heroPlayLabel}>Watch Impact Highlights</span>
          </span>
        </a>

        <ul className={styles.heroStates} aria-label="States we operate in">
          {STATES.map((state) => (
            <li key={state} className={styles.heroStateChip}>
              {state}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
