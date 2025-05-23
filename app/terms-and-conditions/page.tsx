import PrivacyPolicyInner from "../components/privacyPolicyInner";

export async function generateMetadata() {
  return {
    title: "Privacy Policy",
    description:
      "Facilitating access to mechanization services for all farmers in Africa.",
  };
}


export default function Home() {

  return (
    <>
    <PrivacyPolicyInner />
    </>
  );
}


