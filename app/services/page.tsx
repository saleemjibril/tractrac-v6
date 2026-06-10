import type { Metadata } from "next";
import { Chivo } from "next/font/google";
import TractracHomepageNav from "../tractrac-homepage/TractracHomepageNav";
import TractracFooter from "../tractrac-homepage/TractracFooter";
import ServicesHero from "./ServicesHero";
import ServicesList from "./ServicesList";
import ServicesCta from "./ServicesCta";
import styles from "./services.module.css";

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Services — What We Do",
  description:
    "Facilitating access to mechanization services for all farmers in Africa. Hire tractors, enlist equipment, invest, and more.",
};

export default function ServicesPage() {
  return (
    <div className={`${styles.page} ${chivo.className}`}>
      <TractracHomepageNav />
      <main>
        <ServicesHero />
        <ServicesList />
        <ServicesCta />
      </main>
      <TractracFooter />
    </div>
  );
}
