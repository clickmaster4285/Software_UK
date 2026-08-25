'use client';

import dynamic from 'next/dynamic';
import Hero from "@/app/(landing)/home/Hero";
import JsonLd from "@/components/JsonLd";
import { webPageSchema, serviceSchema, homepageFaqSchema } from "@/app/metadata-config";

// Lazy-load all sections below the fold (all have default exports)
const TrustedBy = dynamic(() => import("@/app/(landing)/home/TrustedBy"), { ssr: true });
const Portfolio = dynamic(() => import("@/app/(landing)/home/Portfolio"), { ssr: true });
const StatsBanner = dynamic(() => import("@/components/StatsBanner"), { ssr: true });
const About = dynamic(() => import("@/app/(landing)/home/About"), { ssr: true });
const Services = dynamic(() => import("@/app/(landing)/home/Services"), { ssr: true });
const SolutionCTA = dynamic(() => import("@/app/(landing)/home/SolutionCTA"), { ssr: true });
const MidCTA = dynamic(() => import("@/app/(landing)/home/MidCTA"), { ssr: true });
const Pricing = dynamic(() => import("@/app/(landing)/home/Pricing"), { ssr: true });
const Benefits = dynamic(() => import("@/app/(landing)/home/Benefits"), { ssr: true });
const Testimonials = dynamic(() => import("@/app/(landing)/home/Testimonials"), { ssr: true });

const FAQ = dynamic(() => import("@/app/(landing)/home/FAQ"), { ssr: true });
const FinalCTA = dynamic(() => import("@/app/(landing)/home/FinalCTA"), { ssr: true });

// Named export — wrap as a component function
const TechStackSection = dynamic(() =>
  import("@/app/(landing)/home/TechStackSection").then(mod => {
    const Comp = mod.TechStackSection;
    const Wrapper = (props) => <Comp {...props} />;
    Wrapper.displayName = "TechStackSection";
    return Wrapper;
  }),
  { ssr: true }
);

export default function Home() {
  return (
    <>
      <JsonLd schema={webPageSchema('Software Development Company UK | Clickmasters', 'Clickmasters is a software development company providing software development services that build digital products, improve systems and drive digital growth.', '/')} />
      <JsonLd schema={serviceSchema('Software Development Services', 'Clickmasters provides software development services that help businesses build digital products, improve software systems and support digital growth.', '/', 'United Kingdom', 'software-development-service')} />
      <JsonLd schema={homepageFaqSchema} />
      <Hero />
      <TrustedBy />
      <Portfolio />
      <StatsBanner />
      <About />
      <TechStackSection />
      <Services />
      <SolutionCTA />
      <MidCTA />
      <Pricing />
      <Benefits />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}
