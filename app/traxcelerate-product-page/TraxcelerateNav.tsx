"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./traxcelerateProduct.module.css";

const LOGO_SRC = "/icons/tractrac-white-logo.svg";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "About Us", href: "/about-us" },
  { label: "What We Do", href: "#how" },
  { label: "Products", href: "#partner" },
  { label: "Resources", href: "#proof" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "#cta" },
];

export default function TraxcelerateNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`${styles.nav} ${scrolled ? styles.navSolid : styles.navTransparent}`}
    >
      <div className={styles.navInner}>
        <Link href="/tractrac-homepage" className={styles.navLogoLink} aria-label="TracTrac home">
          <Image
            src={LOGO_SRC}
            alt="TracTrac"
            width={119}
            height={32}
            className={styles.navLogo}
            priority
          />
        </Link>

        <nav className={styles.navLinks} aria-label="Main">
          {NAV_LINKS.map((item) => (
            <Link key={item.label} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/special-programs/collaborate" className={styles.navCta}>
          Partner With Us
        </Link>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={open}
          aria-controls="trax-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.menuIcon} aria-hidden />
          <span className={styles.srOnly}>Menu</span>
        </button>
      </div>

      <div
        id="trax-mobile-nav"
        className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ""}`}
      >
        {NAV_LINKS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={styles.mobileLink}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/special-programs/collaborate"
          className={styles.navCtaMobile}
          onClick={() => setOpen(false)}
        >
          Partner With Us
        </Link>
      </div>
    </header>
  );
}
