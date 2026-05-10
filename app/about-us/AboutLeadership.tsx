import Image from "next/image";
import styles from "./aboutUs.module.css";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageSrc: string;
  imageAlt: string;
  linkedinUrl?: string;
};

// TODO: replace placeholder photos with the official team headshots from Figma
// (DSC00129.jpg, WhatsApp Image 2026-04-17 at 15.04.59.jpg, etc.) and wire each
// member's real LinkedIn URL.
const TEAM: TeamMember[] = [
  {
    id: "godson-ohuruogu",
    name: "Godson Ohuruogu",
    role: "Chief Executive Officer",
    bio: "Godson Ohuruogu is an agribusiness and private sector development expert with over 17 years of experience in value chain development, SME growth,",
    imageSrc: "https://api.tractrac.co/media/images/d803607a-3371-497d-a194-4cb0bfc43e26.webp",
    imageAlt: "Godson Ohuruogu, Chief Executive Officer of TracTrac",
  },
  {
    id: "alero-otis-1",
    name: "Alero Otis",
    role: "Head of Projects & Partnerships",
    bio: "Alero Otis is a development and research specialist with extensive experience in program implementation, policy advocacy, and strategic partnerships.",
    imageSrc: "https://api.tractrac.co/media/images/d803607a-3371-497d-a194-4cb0bfc43e26.webp",
    imageAlt: "Alero Otis, Head of Projects & Partnerships at TracTrac",
  },
  {
    id: "alero-otis-2",
    name: "Alero Otis",
    role: "Head of Projects & Partnerships",
    bio: "Alero Otis is a development and research specialist with extensive experience in program implementation, policy advocacy, and strategic partnerships.",
    imageSrc: "https://api.tractrac.co/media/images/05d189c8-84bc-41e2-b260-4dc1d20b30a3.webp",
    imageAlt: "Alero Otis, Head of Projects & Partnerships at TracTrac",
  },
  {
    id: "alero-otis-3",
    name: "Alero Otis",
    role: "Head of Projects & Partnerships",
    bio: "Alero Otis is a development and research specialist with extensive experience in program implementation, policy advocacy, and strategic partnerships.",
    imageSrc: "https://api.tractrac.co/media/images/05d189c8-84bc-41e2-b260-4dc1d20b30a3.webp",
    imageAlt: "Alero Otis, Head of Projects & Partnerships at TracTrac",
  },
  {
    id: "alero-otis-4",
    name: "Alero Otis",
    role: "Head of Projects & Partnerships",
    bio: "Alero Otis is a development and research specialist with extensive experience in program implementation, policy advocacy, and strategic partnerships.",
    imageSrc: "https://api.tractrac.co/media/images/05d189c8-84bc-41e2-b260-4dc1d20b30a3.webp",
    imageAlt: "Alero Otis, Head of Projects & Partnerships at TracTrac",
  },
  {
    id: "alero-otis-5",
    name: "Alero Otis",
    role: "Head of Projects & Partnerships",
    bio: "Alero Otis is a development and research specialist with extensive experience in program implementation, policy advocacy, and strategic partnerships.",
    imageSrc: "https://api.tractrac.co/media/images/05d189c8-84bc-41e2-b260-4dc1d20b30a3.webp",
    imageAlt: "Alero Otis, Head of Projects & Partnerships at TracTrac",
  },
  {
    id: "alero-otis-6",
    name: "Alero Otis",
    role: "Head of Projects & Partnerships",
    bio: "Alero Otis is a development and research specialist with extensive experience in program implementation, policy advocacy, and strategic partnerships.",
    imageSrc: "https://api.tractrac.co/media/images/d803607a-3371-497d-a194-4cb0bfc43e26.webp",
    imageAlt: "Alero Otis, Head of Projects & Partnerships at TracTrac",
  },
  {
    id: "alero-otis-7",
    name: "Alero Otis",
    role: "Head of Projects & Partnerships",
    bio: "Alero Otis is a development and research specialist with extensive experience in program implementation, policy advocacy, and strategic partnerships.",
    imageSrc: "https://api.tractrac.co/media/images/d803607a-3371-497d-a194-4cb0bfc43e26.webp",
    imageAlt: "Alero Otis, Head of Projects & Partnerships at TracTrac",
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
            <span className={styles.leadershipTagDot} aria-hidden="true" />
            <span>Our Leadership</span>
          </span>
          <h2
            id="about-leadership-heading"
            className={styles.leadershipTitle}
          >
            The Team Behind the Mission
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
