import Link from 'next/link';
import { ArrowRight, Code2, Globe, Smartphone, Brain, Palette, Cloud } from 'lucide-react';
import { getFeaturedCaseStudyCards } from '@/lib/case-study-public';

export const dynamic = 'force-static';

const solutionHubs = [
  {
    title: 'Custom Software Development',
    href: '/software-development',
    icon: Code2,
    summary:
      'Bespoke applications, SaaS platforms, APIs and enterprise systems built around your workflows, compliance needs and growth targets.',
  },
  {
    title: 'Web Development',
    href: '/web-development',
    icon: Globe,
    summary:
      'High-performance B2B websites, web apps, headless commerce and portals with Core Web Vitals, SEO and CRM integrations built in.',
  },
  {
    title: 'Mobile App Development',
    href: '/mobile-development',
    icon: Smartphone,
    summary:
      'Native and cross-platform iOS and Android apps using React Native and Flutter, from MVP validation to production scale.',
  },
  {
    title: 'AI & Automation',
    href: '/artificial-intelligence-ai',
    icon: Brain,
    summary:
      'Production AI agents, chatbots, RAG systems and workflow automation that reduce operational cost without sacrificing control.',
  },
  {
    title: 'UI/UX Design',
    href: '/design-ui-ux',
    icon: Palette,
    summary:
      'Research-led product design, design systems and accessible interfaces that help B2B software convert and retain users.',
  },
  {
    title: 'Cloud & DevOps',
    href: '/cloud-and-devops',
    icon: Cloud,
    summary:
      'Cloud migration, CI/CD, infrastructure as code and managed reliability for AWS, GCP and Azure environments.',
  },
];

export default function SolutionsPage() {
  const featured = getFeaturedCaseStudyCards(6);

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary-mid to-primary-light" />
        <div className="relative mx-auto max-w-[96vw] lg:max-w-[90vw] px-6 text-center">
          <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">Our Solutions</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Software Solutions for Every Growth Stage
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
            Clickmasters designs and builds digital products that solve operational bottlenecks, unlock new revenue
            channels and keep UK and international businesses competitive. Whether you need a greenfield product,
            a modernisation programme or an AI-assisted workflow, we pair strategy with engineering so the solution
            ships, scales and stays maintainable.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-surface">
        <div className="mx-auto max-w-[96vw] lg:max-w-[90vw]">
          <div className="max-w-3xl mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Choose the capability that matches your outcome
            </h2>
            <p className="text-text-body text-lg leading-relaxed">
              Our solution hubs map directly to delivery teams. Each path includes discovery, architecture, build,
              QA, launch support and optional retainers. Start with the category closest to your problem — we will
              refine scope on a free consultation and give you a fixed-price proposal in GBP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutionHubs.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-border bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-accent group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-text-body text-sm leading-relaxed mb-6">{item.summary}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Explore solution <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="mx-auto max-w-[96vw] lg:max-w-[90vw]">
          <div className="max-w-3xl mb-10">
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Proven on real UK programmes
            </h2>
            <p className="text-text-body text-lg leading-relaxed">
              Every solution path is backed by delivered work across FinTech, HealthTech, GovTech, EdTech, PropTech
              and commerce. Browse representative case studies, then talk to us about the outcome you need next.
              Engagements typically start with a paid discovery sprint so risk, compliance and integration constraints
              are clear before full build commitment.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {featured.map((cs) => (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="rounded-xl border border-border bg-white px-5 py-4 text-sm font-medium text-text-primary hover:border-accent/40 hover:text-accent transition-colors"
              >
                {cs.industry}: {cs.title}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/case-studies" className="btn-primary inline-flex items-center gap-2">
              Browse all case studies <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-8 py-3 font-semibold text-text-primary hover:border-accent hover:text-accent transition-colors"
            >
              Book a strategy call
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
