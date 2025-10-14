import Header from "@/app/components/header";
import JoinUs from "@/app/components/joinUs";
import ProductBanner from "@/app/components/productBanner";
import TractracPlusImpact from "@/app/components/tractracPlusImpact";
import WhyTracTracPlus from "@/app/components/whyTracTracPlus";

export async function generateMetadata() {
  return {
    title: "TracInvest",
    description:
      "Accelerating Mechanisation Investment in Nigeria",
  };
}

const points = [
  {
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
    title: "Digital Deployment via TractracPlus",
    subtitle:
      "Access to verified farmer demand and service clusters across Nigeria..",
  },
  {
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
    title: "Data-Driven ROI",
    subtitle:
      "Transparent dashboard showing tractor utilization, revenue, and performance.",
  },
  {
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
    title: "Reduced Operational Risk",
    subtitle:
      "Centralized operator management, maintenance scheduling, and service tracking.",
  },
  {
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
    title: "Assured Market Access",
    subtitle:
      "Guaranteed booking support within high-demand clusters",
  },
  {
    image:
      "https://res.cloudinary.com/tractrac-global/image/upload/v1760214289/Group_1000001752_y1t2sp.png",
    title: "Impact Branding",
    subtitle:
      "Each investor contributes to national food security, rural jobs, and youth engagement",
  },
];

const points2 = [
  {
    id: 1,
    icon: "Training",
    title: "Proven Platform",
    subtitle: "TractracPlus is an established ecosystem solution for booking, monitoring, and performance management..",
  },
  {
    id: 2,
    icon: "Equipment",
    title: "Ecosystem Support",
    subtitle: "Access to a growing network of 2,000+ trained MSPs, mechanics, and operators..",
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
    subtitle: "Real-time performance dashboard and quarterly investor reports.",
  },
];

export default function Traxcelerate() {
  return (
    <div style={{ position: "relative", background: "#F8F8F0" }}>
      <Header />
      <ProductBanner
                   bannerTitle="TRACINVEST"
        title="Accelerating Mechanisation Investment in Nigeria"
        subtitle="A Gateway for Private and Institutional Investors into Nigeria’s Tractors-for-Development Revolution"
        image="https://res.cloudinary.com/tractrac-global/image/upload/v1760477199/Frame_183_hhbuy0.jpg"
        button={true}
        height="550px"
        titleMaxWidth="27ch"
        subtitleMaxWidth="75ch"
      />
      <WhyTracTracPlus
        points={points}
        bannerTitle="Feature"
        title="Investor Benefit"
        subtitle="TRACINVEST offers investors a blend of financial return and measurable social impact. Each feature is designed to maximise efficiency, reduce risk, and ensure transparent performance."
      />

      <TractracPlusImpact
        points={points2}
        bannerTitle="Why Invest"
        title="Key Advantages"
        subtitle="TRACINVEST uses technology and data to enhance transparency, reduce risk, and deliver measurable returns.."
        image="https://res.cloudinary.com/tractrac-global/image/upload/v1760477693/iPhone_16_-_105_1_zyx6sf.png"
      />
      <JoinUs />
    </div>
  );
}
