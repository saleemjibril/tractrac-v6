import {
  PARTNERS,
  PartnerIconSvg,
} from "../tractrac-homepage/TractracPartnersInsightsSection";
import styles from "./aboutUs.module.css";

type AwardArt = "trophy" | "shield";

const AWARDS: {
  id: string;
  year: string;
  title: string;
  copy: string;
  art: AwardArt;
}[] = [
  {
    id: "ncam",
    year: "2022",
    title: "NCAM) Recognition",
    copy: "Empowering Africa\u2019s smallholder farmers with affordable mechanization that drives productivity, profitability, and sustainability.",
    art: "trophy",
  },
  {
    id: "agtech",
    year: "2024",
    title: "Africa Top 10 Agricultural Innovators",
    copy: "Featured among Africa\u2019s Top 10 Agricultural Innovators by AgTech World, recognizing our scalable mechanization ecosystem.",
    art: "shield",
  },
];

function AwardArtIcon({ art }: { art: AwardArt }) {
  if (art === "trophy") {
    return (
      <svg
        className={styles.awardCardArtIcon}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M14 8h28v8a14 14 0 0 1-28 0V8Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M14 12H7v3a7 7 0 0 0 7 7M42 12h7v3a7 7 0 0 1-7 7"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28 30v9"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M19 47h18l-2-8H21l-2 8Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg
      className={styles.awardCardArtIcon}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M28 6 9 13v13c0 11.6 7.5 21.6 19 24 11.5-2.4 19-12.4 19-24V13L28 6Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="m20 28 6 6 12-12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AboutAwards() {
  return (
    <section className={styles.awards} aria-labelledby="about-awards-heading">
      <div className={styles.awardsInner}>
        <header className={styles.awardsHeader}>
          <span className={styles.awardsTag}>
            <span className={styles.awardsTagDot} aria-hidden="true" />
            <span>Awards &amp; Recognition</span>
          </span>
          <h2 id="about-awards-heading" className={styles.awardsTitle}>
            Recognized for Impact
          </h2>
          <p className={styles.awardsSubtitle}>
            Our work advancing mechanization for smallholder farmers has earned
            national and international recognition.
          </p>
        </header>

        <div className={styles.awardsCards}>
          {AWARDS.map((award) => (
            <article
              key={award.id}
              className={styles.awardCard}
              aria-labelledby={`award-${award.id}-title`}
            >
              <span className={styles.awardYearPill}>{award.year}</span>
              <div className={styles.awardCardBody}>
                <h3
                  id={`award-${award.id}-title`}
                  className={styles.awardCardTitle}
                >
                  {award.title}
                </h3>
                <p className={styles.awardCardCopy}>{award.copy}</p>
              </div>
              <div className={styles.awardCardArt} aria-hidden="true">
                <AwardArtIcon art={award.art} />
              </div>
            </article>
          ))}
        </div>

        <div className={styles.awardsFeatured}>
          <span className={styles.awardsFeaturedTag}>
            <span className={styles.awardsTagDot} aria-hidden="true" />
            <span>As featured in</span>
          </span>
          <ul
            className={styles.awardsFeaturedLogos}
            aria-label="Organizations TracTrac is featured with"
          >
            {PARTNERS.map((partner) => (
                <PartnerIconSvg name={partner.name} stroke="#101A2A" />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
