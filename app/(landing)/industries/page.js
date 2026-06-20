import Link from 'next/link';
import { industries } from '@/data/industries';
import { siteConfig } from '@/app/metadata-config';

export const metadata = {
  title: 'Industries We Serve | ClickMasters Software Development',
  description:
    'ClickMasters builds custom software for fintech, healthtech, govtech, edtech, saas, and 8 other UK industries. Compliance-ready, scalable solutions.',
  alternates: { canonical: `${siteConfig.url}/industries` },
  openGraph: {
    title: 'Industries We Serve | ClickMasters',
    description:
      'Custom software development for 14 UK industries. Fintech, healthtech, govtech, edtech, saas and more.',
    url: `${siteConfig.url}/industries`,
  },
};

const industryLabels = {
  fintech: 'Fintech',
  healthtech: 'Healthtech',
  govtech: 'Govtech',
  edtech: 'Edtech',
  saas: 'SaaS',
  logtech: 'Logistics Tech',
  ecommerce: 'E-commerce',
  insurtech: 'Insurtech',
  proptech: 'Proptech',
  retailtech: 'Retail Tech',
  medtech: 'Medtech',
  cleantech: 'Cleantech',
  legaltech: 'Legaltech',
  ai: 'AI & Machine Learning',
  insurance: 'Insurance',
  agritech: 'Agritech',
};

const industryDescriptions = {
  fintech: 'PCI-DSS compliant payment systems, Open Banking integrations, and regulatory reporting for UK financial services.',
  healthtech: 'DTAC-compliant digital health platforms, NHS integrations, and HIPAA-aligned data handling for UK healthcare.',
  govtech: 'GDS-aligned digital services, GOV.UK PaaS hosting, and accessibility-first public sector platforms.',
  edtech: 'SCORM/xAPI-compliant learning platforms, VLE integrations, and Ofsted-ready school management systems.',
  saas: 'Multi-tenant SaaS platforms with subscription billing, UK GDPR data residency, and scalable cloud architecture.',
  logtech: 'Real-time fleet tracking, warehouse management, and supply chain visibility platforms for UK logistics.',
  ecommerce: 'Headless commerce, multi-market platforms, and UK payment integrations for high-growth online retail.',
  insurtech: 'FCA-compliant policy management, claims automation, and actuarial modelling platforms for UK insurers.',
  proptech: 'Property management platforms, automated valuations, and UK land registry integrations.',
  retailtech: 'Omnichannel retail, smart loyalty systems, and real-time inventory management platforms.',
  medtech: 'MHRA-compliant medical device software, IEC 62304 development, and clinical decision support systems.',
  cleantech: 'Carbon tracking, energy optimisation, and ESG reporting platforms for the UK net-zero transition.',
  legaltech: 'SRA-compliant case management, legal document automation, and secure client portals.',
  ai: 'Production ML systems, NLP pipelines, and MLOps infrastructure with UK GDPR-compliant data handling.',
  insurance: 'Digital insurance platforms, broker portals, and FCA-aligned policy administration systems.',
  agritech: 'Precision agriculture, farm management, and DEFRA-compliant reporting platforms.',
};

const industryIcons = {
  fintech: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  healthtech: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  ),
  govtech: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
    </svg>
  ),
  edtech: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
  ),
  saas: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
    </svg>
  ),
  logtech: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  ),
  ecommerce: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  ),
  insurtech: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  ),
  proptech: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  retailtech: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
    </svg>
  ),
  medtech: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  ),
  cleantech: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  legaltech: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352a5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
    </svg>
  ),
  ai: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  ),
  insurance: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  ),
  agritech: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  ),
};

export default function IndustriesListingPage() {
  const grouped = {};
  for (const ind of industries) {
    const key = ind.industry || 'other';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ind);
  }

  const categories = Object.keys(grouped).sort();
  const featuredCategories = categories.slice(0, 6);

  const complianceStandards = [
    'UK GDPR', 'PCI-DSS', 'FCA', 'MHRA',
    'DTAC', 'Cyber Essentials', 'ISO 27001', 'IEC 62304',
  ];

  return (
    <div className="min-h-screen text-primary">
      {/* ═══ HERO — Premium Editorial ═══ */}
      <section className="relative overflow-hidden bg-primary">
        {/* Animated background */}
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Gradient orbs */}
          <div className="absolute -top-60 -right-60 w-150 h-150 rounded-full bg-accent/20 blur-[180px] animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-125 h-125 rounded-full bg-accent/70 blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full bg-accent/5 blur-[200px]" />
        </div>

        <div className="relative mx-auto max-w-[96vw] lg:max-w-[90vw] px-5 py-28 md:py-36 lg:py-44">
          <div className="grid gap-12 lg:grid-cols-[1fr_440px] lg:gap-16 items-center">
            {/* Left — Main Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-accent backdrop-blur-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
                </span>
                Industries We Serve
              </div>

              <h1 className="font-heading text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-[3.75rem]">
                Software Built for{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent/70">
                  Your Industry
                </span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-white/60 max-w-xl">
                We engineer sector-specific solutions that meet strict UK regulations —
                from FCA compliance in fintech to DTAC standards in healthtech.
              </p>

              {/* Stats row */}
              <div className="mt-10 flex flex-wrap gap-10">
                {[
                  { value: `${industries.length}`, label: 'Industry Pages', color: 'text-accent' },
                  { value: `${categories.length}`, label: 'UK Sectors', color: 'text-white' },
                  { value: '100%', label: 'GDPR Ready', color: 'text-green-400' },
                ].map((stat, i) => (
                  <div key={stat.label} className="relative">
                    {i > 0 && (
                      <div className="absolute left-0 top-1/2 -translate-x-5 hidden sm:block">
                        <div className="h-8 w-px bg-white/10" />
                      </div>
                    )}
                    <p className={`font-heading text-4xl font-bold ${stat.color} sm:text-4xl`}>
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/40">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30"
                >
                  Get Free Consultation
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="#directory"
                  className="inline-flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:-translate-y-0.5"
                >
                  Browse Industries
                </Link>
              </div>
            </div>

            {/* Right — Featured Industries Card */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-6 rounded-3xl bg-accent/5 blur-3xl" aria-hidden />
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-accent/10 blur-2xl" aria-hidden />

              <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-2xl shadow-black/20">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">
                    Featured Industries
                  </p>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20">
                    <svg className="h-3 w-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-2">
                  {featuredCategories.map((cat, idx) => {
                    const label = industryLabels[cat] || cat;
                    const count = grouped[cat].length;
                    return (
                      <Link
                        key={cat}
                        href={`/industries/${grouped[cat][0].slug}`}
                        className="group flex items-center gap-3.5 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition-all hover:border-accent/40 hover:bg-white/[0.08] hover:translate-x-1"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 text-accent group-hover:from-accent group-hover:to-accent-hover group-hover:text-white transition-all">
                          {industryIcons[cat] || (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white group-hover:text-accent transition-colors">
                            {label}
                          </p>
                          <p className="text-xs text-white/35">
                            {count} service{count !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-[10px] text-white/40 group-hover:bg-accent/20 group-hover:text-accent transition-all">
                          {idx + 1}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-white/5">
                  <Link
                    href="/contact"
                    className="group flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-accent"
                  >
                    <span>Discuss your needs</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade to surface */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-surface to-transparent" aria-hidden />
      </section>

      {/* ═══ FEATURED INDUSTRIES — Bento Grid ═══ */}
      <section className="bg-surface py-24 md:py-32">
        <div className="mx-auto max-w-[96vw] lg:max-w-[90vw] px-5 md:px-8">
          {/* Section header */}
          <div className="mb-16 max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
              <span className="h-1 w-1 rounded-full bg-accent" />
              Our Expertise
            </span>
            <h2 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
              Deep Knowledge Across{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-hover">
                {categories.length} Industries
              </span>
            </h2>
            <p className="mt-5 text-lg text-slate-500 leading-relaxed">
              Each industry has unique regulatory requirements. We understand the nuances —
              from PCI-DSS in fintech to IEC 62304 in medtech.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredCategories.map((cat, idx) => {
              const label = industryLabels[cat] || cat;
              const desc = industryDescriptions[cat] || '';
              const count = grouped[cat].length;
              const firstItem = grouped[cat][0];

              // Alternate card sizes for visual interest
              const isLarge = idx === 0 || idx === 3;

              return (
                <Link
                  key={cat}
                  href={`/industries/${firstItem?.slug || cat}`}
                  className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 ${isLarge ? 'md:col-span-2' : ''
                    }`}
                >
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-accent to-accent-hover opacity-0 transition-all duration-500 group-hover:opacity-100" />

                  {/* Background gradient on hover */}
                  <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/5 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-150" />

                  <div className="relative flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 text-accent transition-all group-hover:bg-gradient-to-br group-hover:from-accent group-hover:to-accent-hover group-hover:text-white">
                      {industryIcons[cat] || (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Z" />
                        </svg>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-500">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                      {count}
                    </span>
                  </div>

                  <h3 className="relative mt-6 text-xl font-bold text-slate-900 transition-colors group-hover:text-accent">
                    {label}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-slate-500 line-clamp-3">
                    {desc}
                  </p>

                  {/* Badges */}
                  {firstItem?.badges && firstItem.badges.length > 0 && (
                    <div className="relative mt-4 flex flex-wrap gap-1.5">
                      {firstItem.badges.slice(0, 3).map((badge, bi) => (
                        <span
                          key={bi}
                          className="inline-block rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500 border border-slate-100"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-accent">
                    <span>Explore {label}</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ ALL INDUSTRIES DIRECTORY ═══ */}
      <section id="directory" className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[96vw] lg:max-w-[90vw] px-5 md:px-8">
          <div className="mb-16 max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
              Complete Directory
            </span>
            <h2 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
              All Industry{' '}
              <span className="text-accent">Solutions</span>
            </h2>
            <p className="mt-5 text-lg text-slate-500 leading-relaxed">
              Browse every industry-service combination. Each page includes compliance details,
              pricing ranges, and a tailored technical approach.
            </p>
          </div>

          <div className="space-y-16">
            {categories.map((cat) => {
              const items = grouped[cat];
              const label = industryLabels[cat] || cat;
              const desc = industryDescriptions[cat] || '';

              return (
                <div key={cat} className="group relative border-b border-accent/30 last:border-b-0">
                  {/* Category header */}
                  <div className="mb-8 flex items-start gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-white shadow-lg shadow-primary/25">
                      {industryIcons[cat] || (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-4">
                        <h3 className="text-2xl font-bold text-slate-900">
                          {label}
                        </h3>
                        <span className="text-sm font-medium text-slate-400">
                          {items.length} service{items.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {desc && (
                        <p className="mt-1.5 max-w-2xl text-sm text-slate-500 leading-relaxed">
                          {desc}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Service cards */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ml-[4.5rem]">
                    {items.map((ind) => (
                      <Link
                        key={ind.slug}
                        href={`/industries/${ind.slug}`}
                        className="group/card flex items-start gap-3.5 rounded-xl border border-slate-150 bg-slate-50/50 p-4 transition-all hover:border-accent/30 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
                      >
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/8 text-accent transition-colors group-hover/card:bg-accent group-hover/card:text-white">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 group-hover/card:text-accent transition-colors line-clamp-2">
                            {ind.title}
                          </p>
                          {ind.badges && ind.badges.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {ind.badges.slice(0, 2).map((badge, bi) => (
                                <span
                                  key={bi}
                                  className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500"
                                >
                                  {badge}
                                </span>
                              ))}
                              {ind.badges.length > 2 && (
                                <span className="inline-block bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-400">
                                  +{ind.badges.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Divider */}
                  {cat !== categories[categories.length - 1] && (
                    <div className="mt-12 h-px w-full bg-linear-to-r from-transparent via-slate/20 to-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ COMPLIANCE STRIP ═══ */}
      <section className="bg-surface border-y border-slate-200">
        <div className="mx-auto max-w-[96vw] lg:max-w-[90vw] px-5 py-16 md:px-8">
          <div className="flex flex-col items-center gap-10 md:flex-row md:justify-between">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent mb-2">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                Compliance & Standards
              </div>
              <p className="text-xl font-semibold text-slate-900">
                Built for UK Regulatory Requirements
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2.5">
              {complianceStandards.map((standard, i) => (
                <span
                  key={standard}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-accent/50 hover:shadow-md hover:scale-105"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <svg className="h-3.5 w-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {standard}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="relative overflow-hidden bg-primary py-28">
        {/* Animated background */}
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="absolute -top-40 right-0 h-125 w-125 rounded-full bg-accent/15 blur-[140px]" />
          <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[96vw] lg:max-w-[90vw] px-5 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-accent backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Start Building
            </span>

            <h2 className="font-heading text-4xl font-bold text-white sm:text-5xl lg:text-[3.5rem]">
              Your Industry.{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-blue-400">
                Your Platform.
              </span>
              <br />
              <span className="text-white">Your Competitive Edge.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg text-white/55 leading-relaxed">
              We engineer software that fits your sector like a glove — compliance-built,
              scalability-tested, and designed to drive measurable ROI from day one.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-lg bg-accent px-8 py-4 text-base font-semibold text-white shadow-xl shadow-accent/25 transition-all hover:bg-accent-hover hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/30"
              >
                Book Free Consultation
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:-translate-y-1"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}