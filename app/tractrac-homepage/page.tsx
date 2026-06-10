import { Chivo } from "next/font/google";
import Link from "next/link";
import type { Metadata } from "next";
import TractracHomepageNav from "./TractracHomepageNav";
import TractracHeroCarousel from "./TractracHeroCarousel";
import TractracWhoWeSection from "./TractracWhoWeSection";
import TractracIssamSection from "./TractracIssamSection";
import TractracIssamGalleryHero from "./TractracIssamGalleryHero";
import TractracImpactSection from "./TractracImpactSection";
import TractracProductsSection from "./TractracProductsSection";
import TractracPlusMobileSection from "./TractracPlusMobileSection";
import TractracPartnersInsightsSection from "./TractracPartnersInsightsSection";
import TmfComingSection from "./TmfComingSection";
import TractracFooter from "./TractracFooter";
import styles from "./tractracHomepage.module.css";

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TracTrac — Marketing homepage",
  description:
    "Africa's smallholder farmers deserve the power of mechanization. TracTrac connects farmers with tractors and essential farm mechanization services.",
};

export default function TractracHomepage() {
  return (
    <div className={`${styles.page} ${chivo.className}`}>
      <TractracHomepageNav />

      <section className={styles.hero} aria-labelledby="tractrac-hero-heading">
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <div className={styles.badge}>
              {/* <span className={styles.badgeDot} aria-hidden /> */}
              <span>Agricultural Mechanization in Nigeria &amp; Africa</span>
            </div>

            <h1 id="tractrac-hero-heading" className={styles.headline}>
              Africa&apos;s Smallholder Farmers Deserve the Power of Mechanization.
            </h1>

            <p className={styles.lede}>
              We are building an Africa where every smallholder farmer can access tractors
              and essential farm mechanization services at their fingertips — through
              technology, bold partnerships, and investment.
            </p>

            <div className={styles.heroCtas}>
              <Link href="/services" className={styles.btnHeroPrimary}>
                Explore Our Work
              </Link>
              <Link href="/contact" className={styles.btnHeroSecondary}>
                Partner With Us →
              </Link>
            </div>

            <div className={styles.trustRow}>
              <span className={styles.trustPill}>✓ 100,000+ Farmers Served</span>
              <span className={styles.trustPill}>✓ $2B+ Investment Generated</span>
              <span className={styles.trustPill}>✓ 800+ Tractors Deployed</span>
            </div>
          </div>

          <div className={styles.heroRight}>
            <TractracHeroCarousel />
          </div>
        </div>
      </section>

      <TractracImpactSection />
      <TractracWhoWeSection />
      <TractracIssamSection />



      <TractracIssamGalleryHero />

      <TractracProductsSection />

      <TractracPlusMobileSection />

      <TractracPartnersInsightsSection />

      <TmfComingSection />

      <TractracFooter />
    </div>
  );
}
