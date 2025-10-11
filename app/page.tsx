import React from "react";
import ServicesComponent from "./components/services";
import FooterComponent from "./components/footer";
import Header from "./components/header";
import HowItWorksComponent from "./components/howItWorks";
import FaqComponent from "./components/faq";
import GetMobileAppComponent from "./components/getMobileAppComponent";
import OutPartnersComponent from "./components/outPartnersComponent";
import HomeBanner from "./components/homeBanner";
import ContactUsComponent from "./components/contactUs";
import BlogCarouselSection from "./components/blogCarouselSection";

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
