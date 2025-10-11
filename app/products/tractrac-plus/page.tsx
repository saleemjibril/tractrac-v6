import Header from "@/app/components/header";
import PartnerWithUs from "@/app/components/partnerWithUs";
import ProductBanner from "@/app/components/productBanner";
import TractracPlusImpact from "@/app/components/tractracPlusImpact";
import WhyTracTracPlus from "@/app/components/whyTracTracPlus";

export async function generateMetadata() {
    return {
      title: "TracTrac Plus",
      description:
        "TractracPlus is Tractrac’s flagship digital platform designed to revolutionize how mechanisation services are delivered, tracked, and managed across Nigeria.",
    };
  }

export default function TracTracPlus() {
    return (
        <div style={{position: "relative", background: "#F8F8F0"}}>
            <Header />
             <ProductBanner 
            title="Powering the Future of Mechanisation in Africa"
      subtitle="TractracMSL provides technology-driven solutions that connect farmers, service providers, and equipment owners—making mechanisation smarter, faster, and more reliable."
      image="https://res.cloudinary.com/tractrac-global/image/upload/v1760210420/Frame_182_s17wwy.jpg"
       />
       <WhyTracTracPlus />
       <TractracPlusImpact />
       <PartnerWithUs />
</div>
    )
}