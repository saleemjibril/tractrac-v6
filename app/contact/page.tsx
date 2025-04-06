import ContactUsInner from "../components/contactInner";

export async function generateMetadata() {
  return {
    title: "Contact Us",
    description:
      "Facilitating access to mechanization services for all farmers in Africa.",
  };
}

export default function ContactUsPage() {


  return (
  <>
  <ContactUsInner />
  </>
  );
}

