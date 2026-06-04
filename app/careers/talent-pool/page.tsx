import type { Metadata } from "next";
import { Chivo } from "next/font/google";
import Link from "next/link";
import TractracHomepageNav from "../../tractrac-homepage/TractracHomepageNav";
import TractracFooter from "../../tractrac-homepage/TractracFooter";
import TalentPoolApplicationForm from "./TalentPoolApplicationForm";
import styles from "./talentPool.module.css";

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Join Our Talent Pool — Careers",
  description:
    "Submit an open application to join the TracTrac talent pool and be considered for future opportunities.",
};

export default function TalentPoolPage() {
  return (
    <div className={`${styles.page} ${chivo.className}`}>
      <TractracHomepageNav />
      <main className={styles.main}>
        <Link href="/careers" className={styles.backLink}>
          ← Back to Careers
        </Link>

        <div className={styles.layout}>
          <div>
            <h1 className={styles.introTitle}>Open Application?</h1>
            <p className={styles.introCopy}>
              Are you passionate about making a difference and contributing your
              skills to meaningful work in agricultural mechanization? TracTrac
              welcomes talented professionals from diverse fields to join our
              network.
            </p>
            <p className={styles.introCopy}>
              By submitting your application, you will be considered for future
              opportunities to collaborate with us and drive impactful initiatives
              that create lasting change for smallholder farmers.
            </p>
            <p className={styles.introCopy}>
              Apply today and take the first step toward being part of a dynamic
              team shaping the future of mechanization in Nigeria and across
              Africa.
            </p>
          </div>

          <TalentPoolApplicationForm />
        </div>
      </main>
      <TractracFooter />
    </div>
  );
}
