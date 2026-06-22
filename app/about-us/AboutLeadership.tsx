import Image from "next/image";
import styles from "./aboutUs.module.css";
import { bindTitleOrphans } from "@/app/utils/bindTitleOrphans";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageSrc: string;
  imageAlt: string;
  linkedinUrl?: string;
};

// TODO: replace placeholder photos with official team headshots and wire each
// member's real LinkedIn URL.
const TEAM: TeamMember[] = [
  {
    id: "godson-ohuruogu",
    name: "Godson Ohuruogu",
    role: "Chief Executive Officer",
    bio: "Godson Ohuruogu is an agribusiness and private sector development expert with over 17 years of experience in value chain development, SME growth, rural transformation, and climate-smart agriculture. He holds an MBA from the University of Leeds (UK) and a BSc in Industrial and Production Engineering from the University of Ibadan (Nigeria). At TracTrac, he leads the strategic vision to accelerate mechanization access and build scalable agricultural systems that empower smallholder farmers.",
    imageSrc: "https://api.tractrac.co/media/images/05d189c8-84bc-41e2-b260-4dc1d20b30a3.webp",
    imageAlt: "Godson Ohuruogu, Chief Executive Officer of TracTrac",
  },
  {
    id: "alero-otis",
    name: "Alero Otis",
    role: "Head of Projects & Partnerships",
    bio: "Alero Otis is a development and research specialist with extensive experience in program implementation, policy advocacy, and strategic partnerships. At TracTrac, she leads the design and execution of large-scale initiatives that strengthen agricultural systems, expand mechanization access, and empower smallholder farmers across Nigeria.",
    imageSrc: "https://api.tractrac.co/media/images/98bf6787-ae3a-405f-84c2-ade4d78b3d8b.jpeg",
    imageAlt: "Alero Otis, Head of Projects & Partnerships at TracTrac",
  },
  {
    id: "stephen-aguebor",
    name: "Stephen Aguebor",
    role: "Deputy Team Lead, ISSAM Project",
    bio: "Stephen Aguebor is a seasoned development and humanitarian specialist with over 12 years of experience designing and managing high-impact projects in agricultural livelihoods, financial inclusion, climate-smart agriculture, and market systems development. At TracTrac, he supports the implementation of the ISSAM Project, empowering youth and women-led mechanization businesses across Nigeria.",
    imageSrc: "",
    imageAlt: "Stephen Aguebor, Deputy Team Lead of the ISSAM Project at TracTrac",
  },
  {
    id: "adanna-atounwu",
    name: "Adanna Atounwu",
    role: "Communications Lead",
    bio: "Adanna leads TracTrac's communications strategy, shaping how we tell our story, amplifies our impact, and engage stakeholders across the agricultural ecosystem. Her work ensures that TracTrac's mission, programs, and partnerships reach audiences that matter.",
    imageSrc: "",
    imageAlt: "Adanna Atounwu, Communications Lead at TracTrac",
  },
  {
    id: "samuel-olanikepun",
    name: "Samuel Olanikepun",
    role: "MERL Team Lead",
    bio: "Samuel leads Monitoring, Evaluation, Research, and Learning (MERL) at TracTrac, ensuring that programs deliver measurable impact and continuous improvement. He oversees data-driven program evaluation and impact measurement across TracTrac initiatives.",
    imageSrc: "",
    imageAlt: "Samuel Olanikepun, MERL Team Lead at TracTrac",
  },
  {
    id: "john-olanrewaju",
    name: "Dr. Engr. John Olaseye Olanrewaju",
    role: "Engineering Lead",
    bio: "Dr. Olanrewaju leads our engineering and mechanization systems development, ensuring the deployment of equipment tailored to the needs of farmers across operational states. He brings deep expertise in agricultural engineering and mechanization infrastructure.",
    imageSrc: "",
    imageAlt: "Dr. Engr. John Olaseye Olanrewaju, Engineering Lead at TracTrac",
  },
  {
    id: "israel-olatunde",
    name: "Israel Olatunde",
    role: "IT Lead",
    bio: "Israel leads the development and management of TracTrac's digital infrastructure, including platforms that connect farmers, mechanization service providers, and partners. His work powers the technology systems behind TracTrac's mechanization ecosystem.",
    imageSrc: "",
    imageAlt: "Israel Olatunde, IT Lead at TracTrac",
  },
  {
    id: "mercy-edoyugbo",
    name: "Mercy Edoyugbo",
    role: "Lead",
    bio: "...",
    imageSrc: "",
    imageAlt: "Mercy Edoyugbo at TracTrac",
  },
  {
    id: "ojoma-okwute",
    name: "Barr. Ojoma Okwute",
    role: "Head of Operations",
    bio: "Barrister Ojoma Okwute leads operational strategy and execution across TracTrac programs, ensuring efficiency, compliance, and successful delivery of mechanization services across operational regions.",
    imageSrc: "",
    imageAlt: "Barr. Ojoma Okwute, Head of Operations at TracTrac",
  },
];

const SLIDE_INDICATORS = 5;
const ACTIVE_SLIDE = 0;

function LinkIcon() {
  return (
    <svg
      className={styles.leadershipLinkIcon}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6.4 9.6a3 3 0 0 0 4.24 0l2.12-2.12a3 3 0 0 0-4.24-4.24l-1 1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.6 6.4a3 3 0 0 0-4.24 0L3.24 8.52a3 3 0 0 0 4.24 4.24l1-1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AboutLeadership() {
  return (
    <section
      className={styles.leadership}
      aria-labelledby="about-leadership-heading"
    >
      <div className={styles.leadershipInner}>
        <header className={styles.leadershipHeader}>
          <span className={styles.leadershipTag}>
            {/* <span className={styles.leadershipTagDot} aria-hidden="true" /> */}
            <span>Our Leadership</span>
          </span>
          <h2
            id="about-leadership-heading"
            className={styles.leadershipTitle}
          >
            {bindTitleOrphans("The Team Behind the Mission")}
          </h2>
          <p className={styles.leadershipSubtitle}>
            Our leadership combines expertise in agribusiness, engineering,
            development finance, policy, and technology to build scalable
            mechanization systems across Africa.
          </p>
        </header>

        <ul className={styles.leadershipGrid} aria-label="TracTrac leadership team">
          {TEAM.map((member) => (
            <li key={member.id}>
              <article
                className={styles.leadershipCard}
                aria-labelledby={`leadership-${member.id}-name`}
              >
                <div className={styles.leadershipPhoto}>
                  <Image
                    src={member.imageSrc}
                    alt={member.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={styles.leadershipPhotoImg}
                  />
                </div>
                <div className={styles.leadershipBody}>
                  <div className={styles.leadershipMeta}>
                    <h3
                      id={`leadership-${member.id}-name`}
                      className={styles.leadershipName}
                    >
                      {member.name}
                    </h3>
                    <p className={styles.leadershipRole}>{member.role}</p>
                  </div>
                  <p className={styles.leadershipBio}>{member.bio}</p>
                  {member.linkedinUrl ? (
                    <a
                      className={styles.leadershipLink}
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <LinkIcon />
                      <span>LinkedIn</span>
                    </a>
                  ) : (
                    <span
                      className={styles.leadershipLink}
                      aria-label={`${member.name} LinkedIn (coming soon)`}
                    >
                      <LinkIcon />
                      <span>LinkedIn</span>
                    </span>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>

        <ul
          className={styles.leadershipDots}
          aria-label="Team grid pagination (decorative)"
          aria-hidden="true"
        >
          {Array.from({ length: SLIDE_INDICATORS }, (_, i) => (
            <li key={i}>
              <span
                className={`${styles.leadershipDot} ${
                  i === ACTIVE_SLIDE ? styles.leadershipDotActive : ""
                }`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
