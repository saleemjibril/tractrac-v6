import type { Metadata } from "next";
import { Chivo } from "next/font/google";
import TractracHomepageNav from "../tractrac-homepage/TractracHomepageNav";
import TractracFooter from "../tractrac-homepage/TractracFooter";
import AboutHero from "./AboutHero";
import AboutStory from "./AboutStory";
import AboutMission from "./AboutMission";
import AboutAwards from "./AboutAwards";
import AboutTestimonials from "./AboutTestimonials";
import AboutLeadership from "./AboutLeadership";
import AboutCta from "./AboutCta";
import styles from "./aboutUs.module.css";

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "About TracTrac MSL: Mechanization for the Last Mile",
  description:
    "TracTrac is bringing tractors, technology, and opportunity to the smallholder farmers who have long been excluded from mechanization access.",
};

export default function AboutUsPage() {
  return (
    <div className={`${styles.page} ${chivo.className}`}>
      <TractracHomepageNav />
      <AboutHero />
      <AboutStory />
      <AboutMission />
      <AboutAwards />
      <AboutTestimonials />
      <AboutLeadership />
      <AboutCta />
      <TractracFooter />
    </div>
  );
}
