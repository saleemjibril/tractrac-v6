import TermsAndConditionsInner from "../components/termsAndConditionsInner";

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
    <TermsAndConditionsInner />
    </>
  );
}


