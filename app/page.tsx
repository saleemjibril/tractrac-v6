import React from 'react';
import ClientPreloader from "./components/ClientPreloader";
import ServicesComponent from "./components/services";
import FooterComponent from "./components/footer";
import Header from "./components/header";
import HowItWorksComponent from "./components/howItWorks";
import FaqComponent from "./components/faq";
import GetMobileAppComponent from "./components/getMobileAppComponent";
import OutPartnersComponent from "./components/outPartnersComponent";
import HomeBanner from "./components/homeBanner";
import ContactUsComponent from "./components/contactUs";

export async function generateMetadata() {
  return {
    title: "Home",
    description:
      "Facilitating access to mechanization services for all farmers in Africa.",
  };
}

export default function Home() {
  return (
    <ClientPreloader>
      <div style={{position: "relative"}}>
        <Header />
        <HomeBanner />
        <ServicesComponent />
        <HowItWorksComponent />
        <FaqComponent />
        <GetMobileAppComponent />
        <OutPartnersComponent />
        <ContactUsComponent />
        <FooterComponent />
      </div>
    </ClientPreloader>
  );
}