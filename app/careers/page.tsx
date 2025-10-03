import CareersInner from "../components/careersInner";

export async function generateMetadata() {
  return {
    title: "Careers",
    description:
      "Join TracTrac and help power access to mechanization for farmers across Africa.",
  };
}

export default function CareersPage() {
  return <CareersInner />;
}






