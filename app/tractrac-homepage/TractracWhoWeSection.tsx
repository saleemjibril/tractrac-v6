import Image from "next/image";
import Link from "next/link";
import styles from "./tractracHomepage.module.css";

const DEFAULT_TEAM_IMAGE =
  "https://api.tractrac.co/media/images/42b81593-1244-49ea-9bfe-1742933c1bcd.webp";

const TEAM_IMAGE_SRC =
  process.env.NEXT_PUBLIC_TRACTRAC_TEAM_IMAGE?.trim() || DEFAULT_TEAM_IMAGE;

const PILLARS = [
  {
    id: "technology",
    title: "Technology",
    description:
      "Our digital platforms — TracTrac Plus are connecting farmers and mechanization service providers in one seamless ecosystem.",
    icon: "phone",
  },
  {
    id: "partnership",
    title: "Partnership",
    description:
      "We work with development institutions, financial partners, and private sector stakeholders to unlock investment in the mechanization sector, expand equipment accessibility, and strengthen agricultural value chains.",
    icon: "handshake",
  },
  {
    id: "advocacy",
    title: "Advocacy",
    description:
      "We actively advocate for mechanization-friendly policies, sector reforms, and implementation frameworks across our states of operation. Policy advocacy is not optional — it is a critical pillar of our long-term sustainability strategy.",
    icon: "megaphone",
  },
] as const;

function PillarIcon({ name }: { name: (typeof PILLARS)[number]["icon"] }) {
  const stroke = "#101a2a";
  const common = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true as const };
  if (name === "phone") {
    return (
      <svg {...common}>
      <path d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z" stroke="#060C15" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 18H12.01" stroke="black" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      
    );
  }
  if (name === "handshake") {
    return (
      <svg {...common}>
<path d="M11 17L13 19C13.197 19.197 13.4308 19.3532 13.6882 19.4598C13.9456 19.5665 14.2214 19.6213 14.5 19.6213C14.7786 19.6213 15.0544 19.5665 15.3118 19.4598C15.5692 19.3532 15.803 19.197 16 19C16.197 18.803 16.3532 18.5692 16.4598 18.3118C16.5665 18.0544 16.6213 17.7786 16.6213 17.5C16.6213 17.2214 16.5665 16.9456 16.4598 16.6882C16.3532 16.4308 16.197 16.197 16 16" stroke="#060C15" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.0002 14L16.5002 16.5C16.8981 16.8978 17.4376 17.1213 18.0002 17.1213C18.5628 17.1213 19.1024 16.8978 19.5002 16.5C19.8981 16.1022 20.1215 15.5626 20.1215 15C20.1215 14.4374 19.8981 13.8978 19.5002 13.5L15.6202 9.62002C15.0577 9.05821 14.2952 8.74265 13.5002 8.74265C12.7052 8.74265 11.9427 9.05821 11.3802 9.62002L10.5002 10.5C10.1024 10.8978 9.56284 11.1213 9.00023 11.1213C8.43762 11.1213 7.89805 10.8978 7.50023 10.5C7.1024 10.1022 6.87891 9.56262 6.87891 9.00002C6.87891 8.43741 7.1024 7.89784 7.50023 7.50002L10.3102 4.69002C11.2225 3.78016 12.4121 3.20057 13.6909 3.04299C14.9696 2.88541 16.2644 3.15885 17.3702 3.82002L17.8402 4.10002C18.266 4.357 18.7723 4.44613 19.2602 4.35002L21.0002 4.00002" stroke="#060C15" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21 3L22 14H20" stroke="#060C15" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 3L2 14L8.5 20.5C8.89782 20.8978 9.43739 21.1213 10 21.1213C10.5626 21.1213 11.1022 20.8978 11.5 20.5C11.8978 20.1022 12.1213 19.5626 12.1213 19C12.1213 18.4374 11.8978 17.8978 11.5 17.5" stroke="#060C15" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 4H11" stroke="#060C15" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    );
  }
  return (
    <svg {...common}>
<path d="M11 6C14.0414 6.07835 17.0139 5.0875 19.4 3.2C19.5486 3.08857 19.7252 3.02072 19.9102 3.00404C20.0952 2.98736 20.2811 3.02252 20.4472 3.10557C20.6133 3.18863 20.753 3.31629 20.8507 3.47427C20.9483 3.63225 21 3.81429 21 4V16C21 16.1857 20.9483 16.3678 20.8507 16.5257C20.753 16.6837 20.6133 16.8114 20.4472 16.8944C20.2811 16.9775 20.0952 17.0126 19.9102 16.996C19.7252 16.9793 19.5486 16.9114 19.4 16.8C17.0139 14.9125 14.0414 13.9217 11 14H5C4.46957 14 3.96086 13.7893 3.58579 13.4142C3.21071 13.0391 3 12.5304 3 12V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11Z" stroke="#060C15" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 14C6 16.5964 6.84213 19.1228 8.4 21.2C8.71826 21.6243 9.19206 21.9049 9.71716 21.9799C10.2423 22.0549 10.7757 21.9183 11.2 21.6C11.6243 21.2817 11.9049 20.8079 11.9799 20.2828C12.0549 19.7577 11.9183 19.2243 11.6 18.8C10.5614 17.4152 10 15.731 10 14" stroke="#060C15" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 6V14" stroke="#060C15" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  );
}

export default function TractracWhoWeSection() {
  return (
    <section className={styles.whoWe} aria-labelledby="tractrac-who-we-heading">
      <div className={styles.whoWeInner}>
        <div className={styles.whoWeTop}>
          <div className={styles.whoWeVisual}>
            <Image
              src={TEAM_IMAGE_SRC}
              alt="TracTrac team members"
              width={720}
              height={540}
              className={styles.whoWeImg}
              sizes="(max-width: 1023px) 100vw, 50vw"
            />
            <div className={styles.whoWeImgBadge}>
              <span aria-hidden>🚜</span> Founded 2019 · Nigeria
            </div>
          </div>

          <div className={styles.whoWeCopy}>
            <div className={styles.whoWeTag}>
              <span className={styles.whoWeTagDot} aria-hidden />
              <span>Who We Are</span>
            </div>
            <h2 id="tractrac-who-we-heading" className={styles.whoWeHeading}>
              Catalyzing Africa&apos;s Transition to a Fully Mechanized Agricultural Economy
            </h2>
            <div className={styles.whoWeBody}>
              <p>
                TracTrac MSL is accelerating Africa&apos;s transition to a fully mechanized agricultural
                economy — starting from Nigeria. We build the digital backbone, partnerships, and
                financing pathways that make tractors and essential farm power accessible to
                smallholders at scale.
              </p>
              <p>
                From farmer onboarding to service provider networks and policy engagement, we connect
                every part of the mechanization value chain so that more land is cultivated efficiently,
                more rural incomes grow, and food systems become more resilient.
              </p>
            </div>
            <Link href="/about" className={styles.whoWeCta}>
              About TracTrac →
            </Link>
          </div>
        </div>

        <ul className={styles.whoWePillars}>
          {PILLARS.map((item) => (
            <li key={item.id} className={styles.whoWeCard}>
              <div className={styles.whoWeCardIcon}>
                <PillarIcon name={item.icon} />
              </div>
              <h3 className={styles.whoWeCardTitle}>{item.title}</h3>
              <p className={styles.whoWeCardDesc}>{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
