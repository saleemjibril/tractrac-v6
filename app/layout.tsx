// app/layout.tsx
import { Inter } from "next/font/google";
import './app.scss';
import '../styles/pages/_support.scss';
import { Providers } from "@/redux/provider";
import SupportWidget from "./components/support";

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
      <body className={inter.className} style={{scrollBehavior: "smooth"}}>
        <Providers>
          {children}
           <SupportWidget />
        </Providers>
      </body>
    </html>
  );
}