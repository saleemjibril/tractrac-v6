import Image from "next/image";
import Link from "next/link";
import styles from "./tractracHomepage.module.css";

/** Replace with your TMF 2025 highlights video or playlist when ready. */
const TMF_HIGHLIGHTS_URL =
  "https://youtu.be/OUu71JvsgZc?si=yJvuBPp2qedGqvk3";

const TMF_SAVE_DATE_HREF = "/contact";

function PlayGlyph() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M9.5 7.5v9l8-4.5-8-4.5Z"
        fill="#ff7c1f"
        stroke="#ff7c1f"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TmfComingSection() {
  return (
    <section id="tmf-2026" className={styles.tmf} aria-labelledby="tmf-coming-heading">
      <div className={styles.tmfInner}>
        <p className={styles.tmfBadge}>
          {/* <span className={styles.tmfBadgeDot} aria-hidden /> */}
          <span>Event · TracTrac Mechanization Forum 2026</span>
        </p>

        <h2 id="tmf-coming-heading" className={styles.tmfTitle}>
          TMF 2026 is Coming!
        </h2>

        <p className={styles.tmfDesc}>
          Africa&apos;s premier gathering for mechanization leaders, policymakers, innovators, and
          investors. The second edition promises to be bigger, bolder, and more impactful.
        </p>

        <a
          href={TMF_HIGHLIGHTS_URL}
          className={styles.tmfVideoCard}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="https://api.tractrac.co/media/images/7186f738-9967-41c5-aa7a-e227bbfc62da.jpg"
            alt="Group photo from TracTrac Mechanization Forum 2025"
            width={1000}
            height={440}
            className={styles.tmfVideoImg}
            // sizes="(max-width: 768px) 100vw, 640px"
          />
          <div className={styles.tmfVideoOverlay}>
            <span className={styles.tmfPlayCircle}>
              <PlayGlyph />
            </span>
            <span className={styles.tmfWatchPill}>Watch TMF 2025 Highlights</span>
          </div>
        </a>

        <Link href={TMF_SAVE_DATE_HREF} className={styles.tmfCtaSignup}>
          Sign Up for Save-the-Date →
        </Link>
      </div>
    </section>
  );
}
