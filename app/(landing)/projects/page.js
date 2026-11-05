import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { caseStudyCards, getFeaturedCaseStudyCards } from '@/lib/case-study-public';

export const dynamic = 'force-static';

const sectors = [
  'FinTech',
  'HealthTech',
  'GovTech',
  'EdTech',
  'PropTech',
  'eCommerce',
  'InsurTech',
  'LegalTech',
];

export default function ProjectsPage() {
  const featured = getFeaturedCaseStudyCards(9);
  const total = caseStudyCards.length;

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary-mid to-primary-light" />
        <div className="relative mx-auto max-w-[96vw] lg:max-w-[90vw] px-6 text-center">
          <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">Portfolio</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Project Gallery &amp; Delivery Outcomes
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
            Explore {total}+ documented software programmes delivered by Clickmasters for UK and international
            clients. This gallery highlights the systems, platforms and products we engineer — from regulated
            FinTech and NHS-connected HealthTech to commerce, PropTech and public-sector digital services.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-surface border-b border-border">
        <div className="mx-auto max-w-[96vw] lg:max-w-[90vw]">
          <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">Browse by sector</h2>
          <p className="text-text-body mb-8 max-w-3xl">
            Each sector collection links into our full case-study library with measurable outcomes, technology
            stacks and compliance notes. Use these as a starting point for scoping a similar engagement.
          </p>
          <div className="flex flex-wrap gap-3">
            {sectors.map((sector) => (
              <Link
                key={sector}
                href={`/case-studies?sector=${encodeURIComponent(sector)}`}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-text-primary hover:border-accent hover:text-accent transition-colors"
              >
                {sector}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="mx-auto max-w-[96vw] lg:max-w-[90vw]">
          <div className="max-w-3xl mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Featured delivery programmes
            </h2>
            <p className="text-text-body text-lg leading-relaxed">
              These projects represent the depth of work behind the Clickmasters portfolio: FCA-aware FinTech
              platforms, DTAC-ready NHS applications, local authority digital services, commerce rebuilds and
              multi-tenant SaaS products. Every write-up covers challenge, approach, results and the stack we
              used — so you can evaluate fit before we talk delivery model or commercial terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featured.map((cs) => (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="group rounded-2xl border border-border bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">{cs.industry || 'Case Study'}</p>
                <h3 className="font-heading text-lg font-bold text-text-primary mb-3 group-hover:text-accent transition-colors leading-snug">
                  {cs.title}
                </h3>
                <p className="text-sm text-text-muted line-clamp-3 mb-4">{cs.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  Read case study <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>

          <div className="rounded-3xl bg-primary px-8 py-12 md:px-12 text-center">
            <h2 className="font-heading text-3xl font-bold text-white mb-4">Looking for a similar outcome?</h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-8 text-lg">
              Tell us about the product, system or workflow you need to ship. We will recommend an approach,
              timeline and GBP investment range based on comparable programmes in this gallery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/case-studies" className="btn-primary inline-flex items-center justify-center gap-2">
                View full case-study library <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-3 font-bold text-white hover:bg-white/10 transition-colors"
              >
                Start a conversation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
