import React from 'react';
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
    <div style={{position: "relative"}}>
      <Header />
      <HomeBanner />
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