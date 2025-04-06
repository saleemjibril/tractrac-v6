import ServicesInner from "../components/servicesInner";

export async function generateMetadata() {
  return {
    title: "Services",
    description:
      "Facilitating access to mechanization services for all farmers in Africa.",
  };
}

export default function ServicesPage() {

  return (
    <>
      <ServicesInner />
    </>
  );
}


