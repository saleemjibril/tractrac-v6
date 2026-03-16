// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.scss";
import "../styles/pages/_support.scss";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://tractrac.co";

export const metadata: Metadata = {
  title: {
    default: "TracTrac MSL",
    template: "%s | TracTrac MSL",
  },
  description:
    "Facilitating access to mechanization services for all farmers in Africa.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "TracTrac MSL",
    url: siteUrl,
    title: "TracTrac MSL",
    description:
      "Facilitating access to mechanization services for all farmers in Africa.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TracTrac MSL",
    description:
      "Facilitating access to mechanization services for all farmers in Africa.",
  },
  viewport: {
    width: "device-width",
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