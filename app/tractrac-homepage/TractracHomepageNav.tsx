"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./tractracHomepage.module.css";

const LOGO_SRC =
  "https://res.cloudinary.com/tractrac-global/image/upload/v1747644706/tractrac_logo_png_vfhoy7.png";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "About Us", href: "/about" },
  { label: "What We Do", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Resources", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
];

export default function TractracHomepageNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.nav}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.logoLink} aria-label="TracTrac home">
          <Image
            src={LOGO_SRC}
            alt="TracTrac"
            width={119}
            height={34}
            className={styles.logo}
            priority
          />
        </Link>

        <nav className={styles.navLinks} aria-label="Main">
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.navCtas}>
          <Link href="/special-programs/collaborate" className={styles.btnOutline}>
            Partner With Us
          </Link>
          <Link href="/products/tractrac-plus" className={styles.btnPrimarySm}>
            Get The App
          </Link>
        </div>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={open}
          aria-controls="tractrac-home-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.menuIcon} aria-hidden />
          <span className={styles.srOnly}>Menu</span>
        </button>
      </div>

      <div
        id="tractrac-home-mobile-nav"
        className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ""}`}
      >
        {NAV_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.mobileLink}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <div className={styles.mobileCtas}>
          <Link
            href="/special-programs/collaborate"
            className={styles.btnOutline}
            onClick={() => setOpen(false)}
          >
            Partner With Us
          </Link>
          <Link
            href="/products/tractrac-plus"
            className={styles.btnPrimarySm}
            onClick={() => setOpen(false)}
          >
            Get The App
          </Link>
        </div>
      </div>
    </header>
  );
}
