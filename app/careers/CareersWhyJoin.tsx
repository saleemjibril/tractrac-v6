import styles from "./careers.module.css";

type BenefitIcon = "globe" | "growth" | "heart" | "rocket";

const BENEFITS: {
  id: string;
  title: string;
  icon: BenefitIcon;
  items: string[];
}[] = [
  {
    id: "mission",
    title: "Mission & Impact",
    icon: "globe",
    items: [
      "Be part of food security solutions: contribute to transforming smallholder farming across Africa through technology and mechanization.",
      "Inclusive innovation: work on projects that empower women, youths, persons with disabilities, and internally displaced persons in agriculture.",
    ],
  },
  {
    id: "growth",
    title: "Growth & Learning",
    icon: "growth",
    items: [
      "Continuous training: access workshops, certifications, and learning resources in agri-tech, digital tools, and leadership.",
      "Career advancement: clear growth paths and mentorship from industry experts.",
      "Exposure to global development partners.",
    ],
  },
  {
    id: "wellbeing",
    title: "Wellbeing & Perks",
    icon: "heart",
    items: [
      "Health coverage: comprehensive medical benefits for you and your family.",
      "Paid time off: generous leave to recharge or spend time with loved ones.",
      "Competitive salary, pension contributions, and group life insurance.",
    ],
  },
  {
    id: "beyond",
    title: "Beyond Work",
    icon: "rocket",
    items: [
      "Purpose-driven brand: your daily work directly contributes to transforming livelihoods.",
      "Networking opportunities with leaders in agriculture, technology, and development.",
      "Employee recognition celebrating innovation, commitment, and excellence.",
    ],
  },
];

function BenefitIconSvg({ name }: { name: BenefitIcon }) {
  const common = {
    width: 48,
    height: 48,
    viewBox: "0 0 48 48",
    fill: "none" as const,
    "aria-hidden": true as const,
  };

  const hex =
    "M24 0C22.6252 0 21.3756 0.33972 20.0394 0.89222C18.7594 1.42158 17.2818 2.1989 15.469 3.15252L9.2814 6.4076C7.3146 7.4422 5.7136 8.2844 4.4732 9.102C3.17906 9.9552 2.14726 10.8622 1.39258 12.0882C0.638101 13.314 0.306882 14.621 0.150182 16.124C0 17.5652 0 19.3234 0 21.4846V26.5154C0 28.6766 0 30.4348 0.150182 31.876C0.306882 33.379 0.638101 34.686 1.39258 35.9118C2.14726 37.1378 3.17906 38.0448 4.4732 38.898C5.7136 39.7156 7.3144 40.5578 9.2812 41.5924L15.469 44.8474C17.2818 45.801 18.7594 46.5784 20.0394 47.1078C21.3756 47.6602 22.6252 48 24 48C25.3748 48 26.6244 47.6602 27.9606 47.1078C29.2406 46.5784 30.7182 45.801 32.531 44.8474L38.7188 41.5922C40.6856 40.5576 42.2864 39.7156 43.5268 38.898C44.821 38.0448 45.8528 37.1378 46.6074 35.9118C47.3618 34.686 47.6932 33.379 47.8498 31.876C48 30.4348 48 28.6766 48 26.5154V21.4846C48 19.3234 48 17.5652 47.8498 16.124C47.6932 14.621 47.3618 13.314 46.6074 12.0882C45.8528 10.8622 44.821 9.9552 43.5268 9.102C42.3638 8.3356 40.8842 7.5474 39.0832 6.5994L38.7186 6.4076L32.531 3.15252C30.7182 2.19888 29.2406 1.42158 27.9606 0.89222C26.6244 0.33972 25.3748 0 24 0Z";

  return (
    <svg {...common}>
      <path fillRule="evenodd" clipRule="evenodd" d={hex} fill="#FFF4E1" />
      {name === "globe" && (
        <path
          d="M24 14c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 0v20M14 24h20"
          stroke="#FA9510"
          strokeWidth="0.85"
          strokeLinecap="round"
        />
      )}
      {name === "growth" && (
        <path
          d="M16 32V22l8 6 8-10v14"
          stroke="#FA9510"
          strokeWidth="0.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {name === "heart" && (
        <path
          d="M24 34s-10-6.5-10-12.5c0-3 2.5-5.5 5.5-5.5 2 0 3.8 1 4.5 2.5.7-1.5 2.5-2.5 4.5-2.5 3 0 5.5 2.5 5.5 5.5C34 27.5 24 34 24 34z"
          stroke="#FA9510"
          strokeWidth="0.85"
          strokeLinejoin="round"
        />
      )}
      {name === "rocket" && (
        <path
          d="M28 14l4 4-10 10-4-1 1-4 10-10-4 4-4 6 2 2 6"
          stroke="#FA9510"
          strokeWidth="0.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export default function CareersWhyJoin() {
  return (
    <section className={styles.why} aria-labelledby="careers-why-heading">
      <div className={styles.whyInner}>
        <header className={styles.sectionHeaderCenter}>
          <span className={styles.sectionTag}>
            {/* <span className={styles.sectionTagDot} aria-hidden="true" /> */}
            <span>Why join us</span>
          </span>
          <h2 id="careers-why-heading" className={styles.sectionTitle}>
            Why Join the Humans of TracTrac?
          </h2>
        </header>

        <div className={styles.whyGrid}>
          {BENEFITS.map((benefit) => (
            <article key={benefit.id} className={styles.whyCard}>
              <BenefitIconSvg name={benefit.icon} />
              <h3 className={styles.whyCardTitle}>{benefit.title}</h3>
              <ul className={styles.whyList}>
                {benefit.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
