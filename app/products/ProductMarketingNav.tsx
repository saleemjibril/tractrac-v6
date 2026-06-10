"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../traxcelerate-product-page/traxcelerateProduct.module.css";

const LOGO_SRC =
  "https://res.cloudinary.com/tractrac-global/image/upload/v1747644706/tractrac_logo_png_vfhoy7.png";

export type ProductNavLink = { label: string; href: string };

const LISTING_LINKS: ProductNavLink[] = [
  { label: "Products", href: "#catalog" },
  { label: "Why", href: "#overview" },
  { label: "Impact", href: "#proof" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "#cta" },
];

const DETAIL_LINKS: ProductNavLink[] = [
  { label: "Overview", href: "#overview" },
  { label: "Features", href: "#features" },
  { label: "Impact", href: "#proof" },
  { label: "All Products", href: "/products" },
  { label: "Contact", href: "#cta" },
];

type ProductMarketingNavProps = {
  variant?: "listing" | "detail";
  links?: ProductNavLink[];
  ctaHref?: string;
  ctaLabel?: string;
};

export default function ProductMarketingNav({
  variant = "listing",
  links,
  ctaHref = "#cta",
  ctaLabel = "Partner With Us",
}: ProductMarketingNavProps) {
  const navLinks = links ?? (variant === "detail" ? DETAIL_LINKS : LISTING_LINKS);
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
          {navLinks.map((item) => (
            <Link key={item.label} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href={ctaHref} className={styles.navCta}>
          {ctaLabel}
        </Link>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={open}
          aria-controls="product-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.menuIcon} aria-hidden />
          <span className={styles.srOnly}>Menu</span>
        </button>
      </div>

      <div
        id="product-mobile-nav"
        className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ""}`}
      >
        {navLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={styles.mobileLink}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link href={ctaHref} className={styles.navCtaMobile} onClick={() => setOpen(false)}>
          {ctaLabel}
        </Link>
      </div>
    </header>
  );
}
