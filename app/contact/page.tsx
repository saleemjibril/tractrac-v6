import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Chivo } from "next/font/google";
import TractracHomepageNav from "../tractrac-homepage/TractracHomepageNav";
import TractracFooter from "../tractrac-homepage/TractracFooter";
import ContactHero from "./ContactHero";
import ContactIntro from "./ContactIntro";
import ContactForm from "./ContactForm";
import ContactOffices from "./ContactOffices";
import styles from "./contact.module.css";

const ContactMap = dynamic(() => import("./ContactMap"), {
  ssr: false,
  loading: () => (
    <div className={styles.mapWrap}>
      <div className={styles.mapPlaceholder}>Loading map…</div>
    </div>
  ),
});

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with TracTrac. Partnerships, support, and office locations across Nigeria.",
};

export default function ContactPage() {
  return (
    <div className={`${styles.page} ${chivo.className}`}>
      <TractracHomepageNav />
      <main>
        <ContactHero />
        <section className={styles.main} aria-label="Contact form and details">
          <div className={styles.topGrid}>
            <ContactIntro />
            <ContactForm />
          </div>
        </section>
        <section className={styles.locations} aria-labelledby="contact-offices-heading">
          <div className={styles.locationsInner}>
            <h2 id="contact-offices-heading" className={styles.locationsTitle}>
              Our offices
            </h2>
            <div className={styles.locationsGrid}>
              <ContactOffices />
              <ContactMap />
            </div>
          </div>
        </section>
      </main>
      <TractracFooter />
    </div>
  );
}
