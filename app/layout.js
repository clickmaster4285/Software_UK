import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
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
  title: "ClickMasters | Software Development Company",
  description: "We build powerful software that helps companies work smarter everywhere. Custom web apps, mobile apps, and enterprise software solutions.",
  keywords: ["software development", "web apps", "mobile apps", "enterprise software", "SaaS", "AI solutions"],
  openGraph: {
    title: "ClickMasters | Software Development Company",
    description: "We build powerful software that helps companies work smarter everywhere.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${dmSans.variable} antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ToasterProvider />
        <SmoothScroll>
          <Providers>
            {children}
          </Providers>
        </SmoothScroll>
      </body>
    </html>
  );
}
