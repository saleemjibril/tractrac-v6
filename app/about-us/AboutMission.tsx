import styles from "./aboutUs.module.css";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

type Variant = "dark" | "light";

const HEX_FILL: Record<Variant, string> = {
  dark: "#342D2C",
  light: "#FFE1BD",
};

function HexagonIcon({ variant }: { variant: Variant }) {
  return (
    <svg
      className={styles.missionCardIcon}
      width="70"
      height="70"
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.7145 0C32.7259 0 30.9185 0.491383 28.9857 1.29054C27.1343 2.05623 24.997 3.18057 22.3749 4.55992L13.425 9.2682C10.5801 10.7647 8.26437 11.9829 6.47021 13.1655C4.59831 14.3996 3.10588 15.7115 2.01428 17.4848C0.922974 19.2579 0.443886 21.1484 0.217229 23.3224C-8.37627e-05 25.407 -5.59932e-05 27.9501 1.86429e-06 31.0761V38.3529C-5.59932e-05 41.4789 -8.37627e-05 44.022 0.217229 46.1066C0.443886 48.2806 0.922974 50.1711 2.01428 51.9442C3.10588 53.7175 4.59831 55.0294 6.47021 56.2635C8.26437 57.4461 10.5798 58.6643 13.4247 60.1608L22.3749 64.869C24.997 66.2483 27.1343 67.3728 28.9857 68.1385C30.9185 68.9375 32.7259 69.429 34.7145 69.429C36.7031 69.429 38.5105 68.9375 40.4433 68.1385C42.2947 67.3728 44.432 66.2483 47.0541 64.869L56.0043 60.1605C58.8492 58.664 61.1646 57.4461 62.9588 56.2635C64.8308 55.0294 66.3232 53.7175 67.4147 51.9442C68.5059 50.1711 68.9853 48.2806 69.2118 46.1066C69.429 44.022 69.429 41.4789 69.429 38.3529V31.0761C69.429 27.9501 69.429 25.407 69.2118 23.3224C68.9853 21.1484 68.5059 19.2579 67.4147 17.4848C66.3232 15.7115 64.8308 14.3996 62.9588 13.1655C61.2766 12.0569 59.1364 10.9168 56.5314 9.54562L56.004 9.2682L47.0541 4.55992C44.432 3.18054 42.2947 2.05623 40.4433 1.29054C38.5105 0.491383 36.7031 0 34.7145 0Z"
        fill={HEX_FILL[variant]}
      />
      <path
        d="M41.951 20.25H27.4866C25.8889 20.25 24.5938 21.5452 24.5938 23.1429V46.2859C24.5938 47.8836 25.8889 49.1788 27.4866 49.1788H41.951C43.5487 49.1788 44.8439 47.8836 44.8439 46.2859V23.1429C44.8439 21.5452 43.5487 20.25 41.951 20.25Z"
        stroke="#FA9510"
        strokeWidth="1.08483"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34.7148 43.3931H34.7289"
        stroke="#FA9510"
        strokeWidth="1.08483"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const CARDS: {
  id: string;
  variant: Variant;
  label: string;
  copy: string;
}[] = [
  {
    id: "mission",
    variant: "dark",
    label: "MISSION",
    copy: "Empowering Africa\u2019s smallholder farmers with affordable mechanization that drives productivity, profitability, and sustainability.",
  },
  {
    id: "vision",
    variant: "light",
    label: "Vission",
    copy: "To improve agricultural productivity and economic opportunity for smallholder farmers through accessible, scalable, and sustainable mechanization systems.",
  },
];

export default function AboutMission() {
  return (
    <section className={styles.mission} aria-labelledby="about-mission-heading">
      <div className={styles.missionInner}>
        <header className={styles.missionHeader}>
          <span className={styles.missionTag}>
            {/* <span className={styles.missionTagDot} aria-hidden="true" /> */}
            <span>Mission &amp; Visson</span>
          </span>
          <h2 id="about-mission-heading" className={styles.missionTitle}>
            {bindTitleOrphans("What we stand for")}
          </h2>
        </header>

        <div className={styles.missionCards}>
          {CARDS.map((card) => (
            <article
              key={card.id}
              className={`${styles.missionCard} ${
                card.variant === "dark"
                  ? styles.missionCardDark
                  : styles.missionCardLight
              }`}
              aria-labelledby={`mission-card-${card.id}-label`}
            >
              <HexagonIcon variant={card.variant} />
              <h3
                id={`mission-card-${card.id}-label`}
                className={styles.missionCardLabel}
              >
                {card.label}
              </h3>
              <p className={styles.missionCardCopy}>{card.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
