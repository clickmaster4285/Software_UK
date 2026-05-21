// components/landingPage/servicesPage/CTAComponents.tsx
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function CTAComponents() {
  return (
    <>
      {/* Footer CTA - Related Capabilities */}
      <section className="border-t border-border bg-gradient-to-b from-surface to-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-[11px] font-medium tracking-[0.08em] uppercase rounded-full border border-border bg-surface text-accent px-3 py-1">
              Next Steps
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
            Explore Related Capabilities
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Discover how we can help transform your business through our comprehensive services,
            real-world case studies, or our full solutions portfolio.
          </p>

        </div>
      </section>

      {/* Main CTA Section */}
      <section id="cta" className="scroll-mt-20 px-4 sm:px-6 pb-16">
        <div className="relative max-w-7xl mx-auto">
          {/* Main Gradient Card */}
       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface via-surface-2 to-surface p-8 md:p-12 lg:p-16 shadow-[0_2px_16px_rgba(0,0,0,0.07)] border border-border">
  
  {/* Background Decorations */}
  <div className="absolute -right-10 -top-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
  <div className="absolute -left-10 -bottom-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

  <div className="relative text-center max-w-3xl mx-auto">
    <Badge className="bg-surface border-border border text-accent text-[11px] font-medium tracking-[0.08em] uppercase rounded-full mb-4 px-4 py-1.5 font-medium hover:bg-surface">
      Limited Time Opportunity
    </Badge>

    <h2 className="text-4xl md:text-5xl font-bold font-heading leading-tight mt-4 text-slate-900">
      Get your <span className="text-accent bg-clip-text">free strategy call</span>
    </h2>

    <p className="mt-5 text-lg md:text-xl text-slate-600 leading-relaxed">
      Share your requirements and our team will help you define scope, architecture,
      timeline, and delivery approach.
    </p>

    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        asChild
        size="lg"
        className="rounded-lg bg-gradient-to-r from-accent to-accent-hover text-white font-semibold text-base py-6 px-10 shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
      >
        <Link href="/contact-us" className="flex items-center gap-2">
          Book Strategy Call Now
          <ArrowRight className="h-5 w-5" />
        </Link>
      </Button>

      <Button
        asChild
        variant="outline"
        size="lg"
        className="rounded-lg border-border text-text-body hover:bg-surface/50 hover:border-accent py-6 px-10 text-base font-semibold hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
      >
        <Link href="/case-studies">View Case Studies</Link>
      </Button>
    </div>
  </div>
</div>

          {/* Secondary CTA Card */}
          <div className="mt-6 rounded-2xl border border-border bg-white p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 text-accent mb-3">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold text-sm uppercase tracking-widest">48 Hours</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">
                  Want a fixed-price scope in 48 hours?
                </h3>
                <p className="mt-3 text-slate-600 text-[15px] leading-relaxed max-w-xl">
                  We’ll review your requirements and return a detailed proposal with clear phases,
                  timelines, and investment.
                </p>
              </div>

              <Button
                asChild
                className="rounded-lg bg-gradient-to-r from-accent to-accent-hover text-white font-semibold text-base py-6 px-8 whitespace-nowrap shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <Link href="/contact-us" className="flex items-center gap-2">
                  Get Your Proposal
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}