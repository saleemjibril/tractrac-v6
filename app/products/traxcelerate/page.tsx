import Header from "@/app/components/header";
import JoinUs from "@/app/components/joinUs";
import ProductBanner from "@/app/components/productBanner";
import TractracPlusImpact from "@/app/components/tractracPlusImpact";
import WhyTracTracPlus from "@/app/components/whyTracTracPlus";

export async function generateMetadata() {
  return {
    title: "TRAxCelerate",
    description:
      "Building the Human Infrastructure for Nigeria’s Mechanisation Revolution",
  };
}

const points = [
  {
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
    title: "Recruitment and Mobilisation",
    subtitle:
      "Identification and screening of suitable youth and women across partner states.",
  },
  {
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
    title: "Training Delivery",
    subtitle:
      ": A hands-on, 3–4 week hybrid program combining classroom instruction, field practicals, and digital learning modules",
  },
  {
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
    title: "Certification and Onboarding",
    subtitle:
      "Graduates receive official Tractrac MSP certification and are integrated into TractracPlus, our proprietary digital platform for job placement, bookings, and service monitoring.",
  },
  {
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
    title: "Post-Training Support",
    subtitle:
      "Continuous mentorship, refresher courses, and integration into cooperatives and private service delivery networks.",
  },
];

const points2 = [
  {
    id: 1,
    icon: "Training",
    title: "MSP Training & Certification",
    subtitle: "Train and certify 2,000 service providers.",
  },
  {
    id: 2,
    icon: "Equipment",
    title: "Service Efficiency",
    subtitle: "Improve mechanisation reach and performance.",
  },
  {
    id: 3,
    icon: "Training",
    title: "Ecosystem Growth",
    subtitle: "Strengthen state-level systems and MSME value chains.",
  },
  {
    id: 4,
    icon: "Training",
    title: "Youth Empowerment",
    subtitle: "Promote jobs, entrepreneurship, and digital skills.",
  },
];

export default function Traxcelerate() {
  return (
    <div style={{ position: "relative", background: "#F8F8F0" }}>
      <Header />
      <ProductBanner
                   bannerTitle="TRAxCelerate"
        title="Building the Human Infrastructure for Nigeria’s Mechanisation Revolution"
        subtitle="The TRAxCelerate program is Tractrac’s flagship initiative to train, certify, and deploy 2,000 mechanisation service providers operators, agents, and mechanics across Nigeria."
        image="https://res.cloudinary.com/tractrac-global/image/upload/v1760477199/Frame_183_hhbuy0.jpg"
        button={true}
        height="550px"
        titleMaxWidth="27ch"
      />
      <WhyTracTracPlus
        points={points}
        bannerTitle="How It Works"
        title="Product Design"
        subtitle="The Tractrac MSP Model is built on four pillars"
      />

      <TractracPlusImpact
        points={points2}
        bannerTitle="Impact"
        title="TractracMSL is Building the Workforce Powering Mechanisation"
        subtitle="The TRAxCelerate program builds skilled service providers to drive mechanisation, create jobs, and strengthen MSMEs across Nigeria."
        image="https://res.cloudinary.com/tractrac-global/image/upload/v1760474805/iPhone_16_-_105_mu9xxh.png"
      />
      <JoinUs />
    </div>
  );
}
