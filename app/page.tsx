import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Header from "./components/header";
import FooterComponent from "./components/footer";
import HowItWorksComponent from "./components/howItWorks";
import FaqComponent from "./components/faq";

// Dynamic imports for heavy components with GSAP and animations
const HomeBanner = dynamic(() => import("./components/homeBanner"), {
  loading: () => <div style={{ minHeight: "400px", backgroundColor: "#f0f0f0" }} />,
});

const ServicesComponent = dynamic(() => import("./components/services"), {
  loading: () => <div style={{ minHeight: "300px", backgroundColor: "#fafafa" }} />,
});

const BlogCarouselSection = dynamic(() => import("./components/blogCarouselSection"), {
  loading: () => <div style={{ minHeight: "200px", backgroundColor: "#fafafa" }} />,
});

const GetMobileAppComponent = dynamic(() => import("./components/getMobileAppComponent"), {
  loading: () => <div style={{ minHeight: "200px", backgroundColor: "#fafafa" }} />,
});

const OutPartnersComponent = dynamic(() => import("./components/outPartnersComponent"), {
  loading: () => <div style={{ minHeight: "200px", backgroundColor: "#fafafa" }} />,
});

const ContactUsComponent = dynamic(() => import("./components/contactUs"), {
  loading: () => <div style={{ minHeight: "200px", backgroundColor: "#fafafa" }} />,
});

export async function generateMetadata() {
  return {
    title: "Home",
    description:
      "Facilitating access to mechanization services for all farmers in Africa.",
  };
}

export default function Home() {
  return (
    <div style={{ position: "relative" }}>
      <Header />
      <HomeBanner
      title="Tractrac MSL"
        bannerTitle="Facilitating access to mechanization services for all farmers in Africa."
        subtitle="Driving up private sector investments in Agricultural Mechanization"
        buttonText="Get started"
        link="/signup"
        image="https://res.cloudinary.com/tractrac-global/image/upload/v1746446556/hero_banner_jh5hui.jpg"
      />
      <ServicesComponent />
      <HowItWorksComponent />
      <FaqComponent />
      <BlogCarouselSection />
      <GetMobileAppComponent />
      <OutPartnersComponent />
      <ContactUsComponent />
      <FooterComponent />
    </div>
  );
}
