import Hero from "@/app/(landing)/home/Hero";
import Portfolio from "@/app/(landing)/home/Portfolio";
import About from "@/app/(landing)/home/About";
import TrustedBy from "@/app/(landing)/home/TrustedBy";
import SolutionCTA from "@/app/(landing)/home/SolutionCTA";
import Services from "@/app/(landing)/home/Services";
import {TechStackSection} from "@/app/(landing)/home/TechStackSection";
import StatsBanner from "@/components/StatsBanner";
import MidCTA from "@/app/(landing)/home/MidCTA";
import Pricing from "@/app/(landing)/home/Pricing";
import Benefits from "@/app/(landing)/home/Benefits";
import Testimonials from "@/app/(landing)/home/Testimonials";
import FAQ from "@/app/(landing)/home/FAQ";
import FinalCTA from "@/app/(landing)/home/FinalCTA";

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
