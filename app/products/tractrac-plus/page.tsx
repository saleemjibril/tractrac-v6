import Header from "@/app/components/header";
import { FarmMap } from "@/app/components/Icons";
import PartnerWithUs from "@/app/components/partnerWithUs";
import ProductBanner from "@/app/components/productBanner";
import TractracPlusImpact from "@/app/components/tractracPlusImpact";
import WhyTracTracPlus from "@/app/components/whyTracTracPlus";

export async function generateMetadata() {
    return {
      title: "TracTrac Plus",
      description:
        "Powering the Future of Mechanisation in Africa",
    };
  }

  const points = [
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
        title: "Smart Tractor Booking & Deployment",
        subtitle: "Connects farmers and tractor owners for real-time, GPS-tracked operations."
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760214287/Group_1000001752_2_i0yql4.png",
        title: "Farm Mapping & Data Analytics",
        subtitle: "GPS tools capture field data to improve planning and precision farming."
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760214287/Group_1000001752_3_urmhsr.png",
        title: "Database Management",
        subtitle: "Central dashboard to track performance, maintenance, and impact metrics."
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760214287/Group_1000001752_4_wjbgct.png",
        title: "Performance & Reporting",
        subtitle: "Visual dashboards track progress and show real-time impact."
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760214287/Group_1000001752_5_rsr2kk.png",
        title: "Mechanisation Marketplace",
        subtitle: "A digital hub for buying, renting, or leasing tractors and equipment."
    },
    {
        image: "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
        title: "Tracking & Monitoring",
        subtitle: "Real-time visibility into equipment use, performance, and field operations."
    }
]

const points2 = [
  {
    id: 1,
   icon: "Training",
    title: "MSP Training & Engagement",
    subtitle: "Enabled the training and deployment of 2,500 service providers.",
  },
  {
    id: 2,
   icon: "Equipment",
    title: "Equipment Access",
    subtitle:
      "Facilitated over 160 tractors and 280+ labour-saving implements.",
  },
  {
    id: 3,
    icon: "Job",
    title: "Job Creation",
    subtitle: "Supported more than 2,500 direct and indirect jobs.",
  },
  {
    id: 4,
    icon: "FarmMap",
    title: "Farm Mapping",
    subtitle:
      "Digitally recorded and tracked over 10,000 hectares of farmland.",
  },
];


export default function TracTracPlus() {
    return (
        <div style={{position: "relative", background: "#F8F8F0"}}>
            <Header />
             <ProductBanner 
             bannerTitle="TracTracPlus"
            title="Powering the Future of Mechanisation in Africa"
      subtitle="TractracMSL provides technology-driven solutions that connect farmers, service providers, and equipment owners—making mechanisation smarter, faster, and more reliable."
      image="https://res.cloudinary.com/tractrac-global/image/upload/v1760210420/Frame_182_s17wwy.jpg"
       />
       <WhyTracTracPlus points={points} bannerTitle="Why Tractrac Plus" title="Key Features & Services" subtitle="Our platform combines technology, data, and transparency to help farmers, service providers, and partners achieve better outcomes in every operation." />
       <TractracPlusImpact points={points2} bannerTitle="Impact Snapshot" title="TractracPlus Driving Change Through Mechanisation" subtitle="In its first year of deployment (under the ISSAM Project), TractracPlus has" image="https://res.cloudinary.com/tractrac-global/image/upload/v1760219658/iPhone_16_-_104_nc0zt4.jpg" />
       <PartnerWithUs />
</div>
    )
}