import type { Metadata } from "next";
import { Chivo } from "next/font/google";
import TractracHomepageNav from "../tractrac-homepage/TractracHomepageNav";
import TractracFooter from "../tractrac-homepage/TractracFooter";
import CareersHero from "./CareersHero";
import CareersPaths from "./CareersPaths";
import CareersMission from "./CareersMission";
import CareersWhyJoin from "./CareersWhyJoin";
import CareersLocations from "./CareersLocations";
import CareersOpenPositions from "./CareersOpenPositions";
import CareersLifeGallery from "./CareersLifeGallery";
import CareersBlog from "./CareersBlog";
import styles from "./careers.module.css";

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Careers: Join the Humans of TracTrac",
  description:
    "Join TracTrac and help power access to mechanization for farmers across Africa.",
};

export default function CareersPage() {
  return (
    <div className={`${styles.page} ${chivo.className}`}>
      <TractracHomepageNav />
      <main>
        <CareersHero />
        <CareersPaths />
        <CareersMission />
        <CareersWhyJoin />
        <CareersLocations />
        <CareersOpenPositions />
        <CareersLifeGallery />
        <CareersBlog />
      </main>
      <TractracFooter />
    </div>
  );
}
