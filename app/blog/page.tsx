import BlogInner from "../components/blogInner";

export async function generateMetadata() {
  return {
    title: "Blog",
    description:
      "Facilitating access to mechanization services for all farmers in Africa.",
  };
}

export default function ServicesPage() {
  return (
    <>
    <BlogInner />
    </>
  );
}
