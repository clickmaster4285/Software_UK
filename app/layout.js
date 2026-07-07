import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { ToasterProvider } from "@/components/ToasterProvider";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "ClickMasters — Software Development Company in UK",
  description: "ClickMasters is a UK software development company delivering bespoke web, mobile, SaaS, and AI-powered systems. Custom software that drives business growth.",
  keywords: ["software development", "web apps", "mobile apps", "enterprise software", "SaaS", "AI solutions"],
  openGraph: {
    title: "Best Software Development Company in UK",
    description: "Creating the future of business. We’re a Software development Company delivering bespoke web, mobile, SaaS, and AI-powered systems including AI monitoring solutions powering a global market",
    type: "website",
  },
  alternates: {
    canonical: "https://clickmasterssoftwaredevelopmentcompany.co.uk",
  },
  verification: {
    google: "nUmOnlPBAytESz6YJ7CTqD9MsdE_Zx9hi0zzw6PrDt8",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en" data-scroll-behavior="smooth"
      className={`${sora.variable} ${dmSans.variable} antialiased`}
    >

      <body className="min-h-full flex flex-col font-sans">
        <ToasterProvider />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
