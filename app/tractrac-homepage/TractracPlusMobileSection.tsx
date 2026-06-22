import Image from "next/image";
import Link from "next/link";
import { FaApple } from "react-icons/fa";
import { SiGoogleplay } from "react-icons/si";
import styles from "./tractracHomepage.module.css";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

const APP_STORE_URL =
  "https://apps.apple.com/search?term=TracTrac%20Plus";
const PLAY_STORE_URL =
  "https://play.google.com/store/search?q=TracTrac+Plus&c=apps";

function FeatureIcon({ name }: { name: "sprout" | "tractor" | "track" | "card" }) {
  const stroke = "#cbd5e1";
  const c = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none" as const, "aria-hidden": true as const };
  switch (name) {
    case "sprout":
      return (
        <svg {...c}>
          <path
            d="M12 22v-6M12 8c0-3 2-5 5-5-1 3-2 5-5 5zm0 0c0-3-2-5-5-5 1 3 2 5 5 5z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "tractor":
      return (
        <svg {...c}>
          <path
            d="M4 16h2.5M18 16h2M6 16l1-4h6l1.5 4M8 12V9h4v3M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm8 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "track":
      return (
        <svg {...c}>
          <path
            d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="10" r="2.2" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );
    case "card":
      return (
        <svg {...c}>
          <rect x="2" y="5" width="20" height="14" rx="2" stroke={stroke} strokeWidth="1.6" />
          <path d="M2 10h20" stroke={stroke} strokeWidth="1.6" />
          <path d="M6 15h4" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

const FEATURES: { icon: "sprout" | "tractor" | "track" | "card"; text: string }[] = [
  { icon: "sprout", text: "Discover services near your farm" },
  { icon: "tractor", text: "Book tractors in minutes" },
  { icon: "track", text: "Track your service provider live" },
  { icon: "card", text: "Pay securely in-app" },
];

export default function TractracPlusMobileSection() {
  return (
    <section
      className={styles.plusMobile}
      aria-labelledby="tractrac-plus-mobile-heading"
    >
      <div className={styles.plusMobileInner}>
        <div className={styles.plusMobileCopy}>
          <p className={styles.plusMobileTag}>
            {/* <span className={styles.plusMobileTagDot} aria-hidden /> */}
            <span>TracTrac Plus Mobile App</span>
          </p>

          <h2 id="tractrac-plus-mobile-heading" className={styles.plusMobileTitle}>
            {bindTitleOrphans("Access Mechanization From Your Phone")}
          </h2>

          <p className={styles.plusMobileDesc}>
            Download TracTrac Plus and access tractors, farm equipment, and mechanization
            services directly from your mobile phone. Farmers can book equipment quickly,
            transparently, and efficiently, exactly when they need it.
          </p>

          <p className={styles.plusMobileProof}>1,000+ bookings completed and counting.</p>

          <ul className={styles.plusMobileFeatures}>
            {FEATURES.map((f) => (
              <li key={f.text} className={styles.plusMobileFeature}>
                <span className={styles.plusMobileFeatureIcon}>
                  <FeatureIcon name={f.icon} />
                </span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          <div className={styles.plusMobileStores}>
            <Link
              href={APP_STORE_URL}
              className={styles.plusMobileBtnIos}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaApple className={styles.plusMobileStoreIcon} aria-hidden />
              <span>Get on iPhone</span>
            </Link>
            <Link
              href={PLAY_STORE_URL}
              className={styles.plusMobileBtnAndroid}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiGoogleplay className={styles.plusMobilePlayIcon} aria-hidden />
              <span>Get on Android</span>
            </Link>
          </div>
        </div>

        <div className={styles.plusMobileVisual} aria-hidden>
          <div className={styles.plusMobilePhones}>
            <Image
              src="/icons/tractracplusmobile.svg"
              alt="TracTrac Plus app: map tracking and home dashboard on two phones"
              width={413}
              height={520}
              className={styles.plusMobilePhonesImg}
              sizes="(max-width: 413px) 100vw, 50vw"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
