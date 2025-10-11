import React from 'react';
import ServicesComponent from "../components/services";
import FooterComponent from "../components/footer";
import Header from "../components/header";
import HowItWorksComponent from "../components/howItWorks";
import FaqComponent from "../components/faq";
import GetMobileAppComponent from "../components/getMobileAppComponent";
import OutPartnersComponent from "../components/outPartnersComponent";
import HomeBanner from "../components/homeBanner";
import ContactUsComponent from "../components/contactUs";
import BlogCarouselSection from "../components/blogCarouselSection";
import OurProducts from '../components/ourProducts';
import JoinUs from '../components/joinUs';

export async function generateMetadata() {
  return {
    title: "Products",
    description:
      "Powering the Future of Mechanisation in Africa",
  };
}

export default function Home() {
  return (
    <div style={{position: "relative", background: "#F8F8F0"}}>
      <Header />
      <HomeBanner 
            title="Our product"
      bannerTitle="Powering the Future of Mechanisation in Africa"
      subtitle="TractracMSL provides technology-driven solutions that connect farmers, service providers, and equipment owners—making mechanisation smarter, faster, and more reliable."
      buttonText="Partner with Us"
      link="/contact"
      image="https://res.cloudinary.com/tractrac-global/image/upload/v1760200992/Frame_181_afv1x1.jpg"
       />
       <OurProducts />
       <HomeBanner 
            title="Collaborative Growth"
      bannerTitle="Let’s Build the Future of Mechanisation Together"
      subtitle="We’re partnering with governments, cooperatives, development agencies, and agribusinesses to expand access to mechanisation across Africa."
      buttonText="Be a part of this"
      link="/contact"
      height="628px"
      image="https://res.cloudinary.com/tractrac-global/image/upload/v1760203408/Frame_180_1_y2swcl.jpg"
       />
       <JoinUs />
       <FooterComponent />
    </div>
  );
}