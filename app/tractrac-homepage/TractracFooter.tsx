import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import styles from "./tractracHomepage.module.css";

const LOGO_SRC =
  "/icons/tractrac-white-logo.svg";

const QUICK_LINKS: { label: string; href: string }[] = [
  { label: "About Us", href: "/about" },
  { label: "What We Do", href: "/services" },
  { label: "Our Products", href: "/products" },
  { label: "Resources", href: "/blog" },
  { label: "Blog", href: "/blog" },
];

const PROGRAM_LINKS: { label: string; href: string }[] = [
  { label: "ISSAM Project", href: "/special-programs/issam" },
  { label: "TracTrac Plus", href: "/products/tractrac-plus" },
  { label: "TMF 2026", href: "/tractrac-homepage#tmf-2026" },
  { label: "Partner With Us", href: "/special-programs/collaborate" },
  { label: "Careers", href: "/careers" },
];

const CONTACT_LINKS: { label: string; href: string }[] = [
  { label: "Partnership Inquiries", href: "/contact" },
  { label: "Press & Media", href: "/contact" },
  { label: "Call Us", href: "/contact" },
  { label: "Our Offices", href: "/contact" },
  { label: "Newsletter", href: "/contact" },
];

const SOCIAL: { label: string; href: string; Icon: typeof FaXTwitter }[] = [
  { label: "TracTrac on X", href: "https://twitter.com/TractracGlobal", Icon: FaXTwitter },
  { label: "TracTrac on LinkedIn", href: "https://www.linkedin.com/company/tractrac", Icon: FaLinkedinIn },
  { label: "TracTrac on Facebook", href: "https://web.facebook.com/tractracglobal", Icon: FaFacebookF },
  {
    label: "TracTrac on YouTube",
    href: "https://www.youtube.com/results?search_query=TracTrac",
    Icon: FaYoutube,
  },
];

export default function TractracFooter() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrandCol}>
            <Link href="/" className={styles.footerLogoLink}>
              <Image
                src={LOGO_SRC}
                alt="TracTrac"
                width={132}
                height={38}
                className={styles.footerLogoImg}
              />
            </Link>
            <p className={styles.footerMission}>
              Mechanizing Africa, one farm at a time. Building a future where every smallholder farmer
              has access to the tools that unlock prosperity.
            </p>
            <div className={styles.footerSocial}>
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={href}
                  href={href}
                  className={styles.footerSocialBtn}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className={styles.footerSocialIcon} aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <nav className={styles.footerCol} aria-labelledby="footer-quick-heading">
            <h2 id="footer-quick-heading" className={styles.footerColTitle}>
              Quick Links
            </h2>
            <ul className={styles.footerList}>
              {QUICK_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.footerCol} aria-labelledby="footer-programs-heading">
            <h2 id="footer-programs-heading" className={styles.footerColTitle}>
              Programs
            </h2>
            <ul className={styles.footerList}>
              {PROGRAM_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.footerCol} aria-labelledby="footer-contact-heading">
            <h2 id="footer-contact-heading" className={styles.footerColTitle}>
              Contact
            </h2>
            <ul className={styles.footerList}>
              {CONTACT_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <hr className={styles.footerRule} />

      <div className={styles.footerBottom}>
        <p className={styles.footerCopyright}>
          © {new Date().getFullYear()} TracTrac Mechanization Services Limited. All rights reserved.
        </p>
        <div className={styles.footerLegal}>
          <Link href="/privacy-policy" className={styles.footerLegalLink}>
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" className={styles.footerLegalLink}>
            Terms of Use
          </Link>
          <Link href="/privacy-policy" className={styles.footerLegalLink}>
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
