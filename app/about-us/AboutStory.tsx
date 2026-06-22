import Image from "next/image";
import styles from "./aboutUs.module.css";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

const STATS = [
  { value: "800+", label: "Tractors Deployed" },
  { value: "125,000+", label: "Farmers Supported" },
  { value: "2,700+", label: "Booking Agents" },
];

export default function AboutStory() {
  return (
    <section className={styles.story} aria-labelledby="about-story-heading">
      <div className={styles.storyInner}>
        {/* TODO: replace placeholder with the official TracTrac team photo (Figma: DSC02478.jpg). */}
        <figure className={styles.storyImageCard}>
          <Image
            src="https://api.tractrac.co/media/images/42b81593-1244-49ea-9bfe-1742933c1bcd.webp"
            alt="The TracTrac Mechanization Services team"
            fill
            sizes="(max-width: 900px) 100vw, 560px"
            className={styles.storyImage}
          />
          <figcaption className={styles.storyFoundedPill}>
            <span className={styles.storyFoundedEmoji} aria-hidden="true">
              🚜
            </span>
            <span>Founded 2019 · Nigeria</span>
          </figcaption>
        </figure>

        <div className={styles.storyBody}>
          <span className={styles.storyTag}>
            {/* <span className={styles.storyTagDot} aria-hidden="true" /> */}
            <span>Our Story</span>
          </span>

          <h2 id="about-story-heading" className={styles.storyHeading}>
            {bindTitleOrphans("Built to Solve Africa's Mechanization Gap")}
          </h2>

          <p className={styles.storyParagraph}>
            TracTrac Mechanization Services Limited was founded in 2019 with a
            clear and urgent mission: increase tractor density in Nigeria and
            ensure that smallholder farmers can access mechanization services at
            their doorstep.
          </p>

          <p className={styles.storyParagraph}>
            In Africa, millions of farmers still rely on manual labour, limiting
            productivity, income, and food security. TracTrac was created to
            change that reality.
          </p>

          <ul className={styles.storyStats} aria-label="TracTrac quick stats">
            {STATS.map((stat) => (
              <li key={stat.label} className={styles.storyStat}>
                <span className={styles.storyStatValue}>{stat.value}</span>
                <span className={styles.storyStatLabel}>{stat.label}</span>
              </li>
            ))}
          </ul>

          <p className={styles.storyParagraph}>
            Since inception, we have built one of Nigeria&apos;s fastest-growing
            investment portfolios in mechanization ecosystems. Today, our
            operations span seven Nigerian states, supporting farmers with
            technology-enabled access to machinery and services.
          </p>
        </div>
      </div>
    </section>
  );
}
