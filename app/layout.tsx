// app/layout.tsx
import { Inter } from "next/font/google";
import './app.scss';
import '../styles/pages/_support.scss';
import { Providers } from "@/redux/provider";
import GoogleAnalytics from "./components/googleAnalytics";
import PageTracker from "./components/pageTracker";
import WebVitals from "./components/WebVitals";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";
import { AuthProvider } from "./components/AuthProvider";
import FacebookPixel from "./components/facebookPixel";


const inter = Inter({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

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
      </head>
      <body className={inter.className} style={{scrollBehavior: "smooth"}}>
        <Providers>
        <AuthProvider>
        <PageTracker />
        <WebVitals />
        <ServiceWorkerRegistration />
          {children}
           {/* <SupportWidget /> */}
           </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}