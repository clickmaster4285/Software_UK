'use client';

import dynamic from 'next/dynamic';
import Hero from "@/app/(landing)/home/Hero";

// Lazy-load all sections below the fold (all have default exports)
const TrustedBy = dynamic(() => import("@/app/(landing)/home/TrustedBy"), { ssr: true });
const Portfolio = dynamic(() => import("@/app/(landing)/home/Portfolio"), { ssr: true });
const StatsBanner = dynamic(() => import("@/components/StatsBanner"), { ssr: true });
const About = dynamic(() => import("@/app/(landing)/home/About"), { ssr: true });
const SolutionCTA = dynamic(() => import("@/app/(landing)/home/SolutionCTA"), { ssr: true });
const Services = dynamic(() => import("@/app/(landing)/home/Services"), { ssr: true });
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
      <Hero />
      <TrustedBy />
      <Portfolio />
      <StatsBanner />
      <About />
      <TechStackSection />
      <SolutionCTA />
      <Services />
      <MidCTA />
      <Pricing />
      <Benefits />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}
