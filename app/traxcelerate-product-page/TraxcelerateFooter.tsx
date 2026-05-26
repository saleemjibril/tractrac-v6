import Image from "next/image";
import Link from "next/link";
import styles from "./traxcelerateProduct.module.css";

const LOGO_SRC = "/icons/tractrac-white-logo.svg";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Programme",
    links: [
      { label: "About TRAxCelerate", href: "#proof" },
      { label: "How It Works", href: "#how" },
      { label: "Partnership Models", href: "#partner" },
      { label: "ISSAM Case Study", href: "/special-programs/issam" },
    ],
  },
  {
    title: "For Partners",
    links: [
      { label: "State Governments", href: "#partner" },
      { label: "DFIs & Donors", href: "#partner" },
      { label: "OEMs & Agribusiness", href: "#partner" },
      { label: "Universities", href: "#partner" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Schedule a briefing", href: "/contact" },
      { label: "Apply as MSP", href: "#cta" },
      { label: "Download prospectus", href: "/contact" },
      { label: "press@tractrac.africa", href: "mailto:press@tractrac.africa" },
    ],
  },
];

export default function TraxcelerateFooter() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.sectionInnerWide}>
        <div className={styles.footerGrid}>
          <div>
            <Link href="/tractrac-homepage" className={styles.navLogoLink} aria-label="TracTrac home">
              <Image
                src={LOGO_SRC}
                alt="TracTrac"
                width={119}
                height={32}
                className={styles.footerLogo}
              />
            </Link>
            <p className={styles.footerMission}>
              TRAxCelerate is TracTrac&apos;s mechanisation workforce programme — training,
              certifying, and deploying MSPs at national scale.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className={styles.footerColTitle}>{col.title}</h2>
              {col.links.map((link) => (
                <Link key={link.label} href={link.href} className={styles.footerLink}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} TracTrac Limited. Delivered in partnership with Mastercard
            Foundation.
          </p>
          <p className={styles.footerSdgs}>SDG 2 · SDG 5 · SDG 8 · SDG 9 · SDG 17</p>
        </div>
      </div>
    </footer>
  );
}
