import SignupInner from "../components/signupInner";

export async function generateMetadata() {
  return {
    title: "Signup",
    description:
      "Facilitating access to mechanization services for all farmers in Africa.",
  };
}

export default function Home() {
 
  return (
   <>
   <SignupInner />
   </>
  );
}
