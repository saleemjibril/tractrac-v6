// app/layout.tsx
import { Inter } from "next/font/google";
import './app.css';
import { Providers } from "@/redux/provider";

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
        </Providers>
      </body>
    </html>
  );
}