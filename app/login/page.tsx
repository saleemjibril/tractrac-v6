import LoginInner from "../components/loginInner";


export async function generateMetadata() {
  return {
    title: "Login",
    description:
      "Facilitating access to mechanization services for all farmers in Africa.",
  };
}

export default function Login() {
 
  return ( 
   <>
   <LoginInner />
   </>
  );
}
