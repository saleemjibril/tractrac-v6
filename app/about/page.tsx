import AboutInner from "../components/aboutInner";

export async function generateMetadata() {
  return {
    title: "About Us",
    description:
      "Facilitating access to mechanization services for all farmers in Africa.",
  };
}

export default function About() {


  return (
    <AboutInner />
  );
}



