import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { ToasterProvider } from "@/components/ToasterProvider";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, webSiteSchema } from "@/app/metadata-config";

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
  title: "Software Development Company UK - ClickMasters",
  description: "ClickMasters delivers software development services for businesses needing custom software, web and mobile apps, SaaS, AI and scalable digital solutions.",
  keywords: ["Software Development", "Software Development Company", "Software Development Company UK", "Software Development Agency", "Software Development Firm", "software development services"],
  openGraph: {
    title: "Software Development Company UK - ClickMasters",
    description: "ClickMasters delivers software development services for businesses needing custom software, web and mobile apps, SaaS, AI and scalable digital solutions.",
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
      lang="en-gb" data-scroll-behavior="smooth"
      className={`${sora.variable} ${dmSans.variable} antialiased`}
    >

      <body className="min-h-full flex flex-col font-sans">
        <JsonLd schema={organizationSchema()} />
        <JsonLd schema={webSiteSchema()} />
        <ToasterProvider />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
