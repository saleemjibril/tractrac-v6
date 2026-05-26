import { Chivo } from "next/font/google";
import type { Metadata } from "next";
import TraxcelerateNav from "./TraxcelerateNav";
import TraxcelerateHero from "./TraxcelerateHero";
import TraxcelerateProblem from "./TraxcelerateProblem";
import TraxcelerateProof from "./TraxcelerateProof";
import TraxcelerateGallery from "./TraxcelerateGallery";
import TraxcelerateHow from "./TraxcelerateHow";
import TraxceleratePartners from "./TraxceleratePartners";
import TraxceleratePromise from "./TraxceleratePromise";
import TraxcelerateTestimonials from "./TraxcelerateTestimonials";
import TraxcelerateCta from "./TraxcelerateCta";
import TraxcelerateFooter from "./TraxcelerateFooter";
import styles from "./traxcelerateProduct.module.css";

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TRAxCelerate — Nigeria's Mechanisation Workforce Programme",
  description:
    "TRAxCelerate is TracTrac's proven mechanisation workforce programme. We recruit, train, certify, and deploy mechanisation service providers at scale.",
};

export default function TraxcelerateProductPage() {
  return (
    <div className={`${styles.page} ${chivo.className}`}>
      <TraxcelerateNav />
      <main>
        <TraxcelerateHero />
        <TraxcelerateProblem />
        <TraxcelerateProof />
        <TraxcelerateGallery />
        <TraxcelerateHow />
        <TraxceleratePartners />
        <TraxceleratePromise />
        <TraxcelerateTestimonials />
        <TraxcelerateCta />
      </main>
      <TraxcelerateFooter />
    </div>
  );
}
