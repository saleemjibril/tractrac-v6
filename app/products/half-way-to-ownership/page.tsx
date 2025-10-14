import Header from "@/app/components/header";
import JoinUs from "@/app/components/joinUs";
import ProductBanner from "@/app/components/productBanner";
import TractracPlusImpact from "@/app/components/tractracPlusImpact";
import WhyTracTracPlus from "@/app/components/whyTracTracPlus";

export async function generateMetadata() {
  return {
    title: "Half-Way to Ownership",
    description:
      "Empowering Youth and Women for Sustainable Mechanisation Ownership",
  };
}

const points = [
  {
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
    title: "Youth & Women Empowerment",
    subtitle:
      "Support young people and women to become Mechanisation Service Providers (MSPs).",
  },
  {
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
    title: "Access to Mechanisation",
    subtitle:
      "Expand affordable mechanisation services for smallholder farmers.",
  },
  {
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
    title: "Inclusive Ownership",
    subtitle:
      "Build shared ownership pathways within the mechanisation ecosystem.",
  },
  {
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
    title: "Job & Enterprise Growth",
    subtitle:
      "Create decent jobs and boost rural enterprise development.",
  },
];

const points2 = [
  {
    id: 1,
    icon: "Training",
    title: "Proven Platform",
    subtitle: "TractracPlus is an established ecosystem solution for booking, monitoring, and performance management.",
  },
  {
    id: 2,
    icon: "Equipment",
    title: "Ecosystem Support",
    subtitle: "Access to a growing network of 2,000+ trained MSPs, mechanics, and operators.",
  },
  {
    id: 3,
    icon: "Training",
    title: "Impact & Return",
    subtitle: "Combines financial ROI with social and developmental impact.",
  },
  {
    id: 4,
    icon: "Training",
    title: "Transparency",
    subtitle: "Real-time performance dashboard and quarterly investor reports",
  },
];

export default function Traxcelerate() {
  return (
    <div style={{ position: "relative", background: "#F8F8F0" }}>
      <Header />
      <ProductBanner
                   bannerTitle="Half-Way to Ownership"
        title="Empowering Youth and Women for Sustainable Mechanisation Ownership"
        subtitle="Across Nigeria, young people and women are ready to join the mechanisation sector, but limited access to finance holds them back."
        image="https://res.cloudinary.com/tractrac-global/image/upload/v1760477199/Frame_183_hhbuy0.jpg"
        button={true}
        height="550px"
        titleMaxWidth="32ch"
        subtitleMaxWidth="73ch"
      />
      <WhyTracTracPlus
        points={points}
        bannerTitle="Project Objectives"
        title="Empowering People, Expanding Access"
        subtitle="This initiative empowers youth and women, expands mechanisation access, and promotes inclusive ownership."
      />

      <TractracPlusImpact
        points={points2}
        bannerTitle="Key Benefits"
        title="Key Advantages"
        subtitle="TRACINVEST uses technology and data to enhance transparency, reduce risk, and deliver measurable returns."
        image="https://res.cloudinary.com/tractrac-global/image/upload/v1760478254/iPhone_16_-_105_2_j9hdpk.png"
      />
      <JoinUs />
    </div>
  );
}
