// app/layout.tsx
import { Inter } from "next/font/google";
import './app.scss';
import '../styles/pages/_support.scss';
import { Providers } from "@/redux/provider";
import SupportWidget from "./components/support";
import GoogleAnalytics from "./components/googleAnalytics";
import PageTracker from "./components/pageTracker";
import { AuthProvider } from "./components/AuthProvider";
import FacebookPixel from "./components/facebookPixel";


const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <GoogleAnalytics />
      <FacebookPixel />
      <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBWo_tQ4rjQkZz1kN5WXfnemHCaF0gQ8BU&libraries=places,geometry`}
        ></script>
      </head>
      <body className={inter.className} style={{scrollBehavior: "smooth"}}>
        <Providers>
        <AuthProvider>
        <PageTracker />
          {children}
           <SupportWidget />
           </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}