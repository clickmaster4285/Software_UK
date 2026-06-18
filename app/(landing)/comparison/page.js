import Link from 'next/link';
import { comparisonListings } from '@/data/comparisons';
import { ArrowRight, BookOpen, GitCompare } from 'lucide-react';

const ITEMS_PER_PAGE = 24;

const categoryLabels = {
  'cloud': 'Cloud & Infrastructure',
  'framework': 'Frameworks & Libraries',
  'language': 'Languages & Runtimes',
  'database': 'Databases & Storage',
  'devops': 'DevOps & CI/CD',
  'ai': 'AI & Machine Learning',
  'mobile': 'Mobile Development',
  'payment': 'Payments & FinTech',
  'cms': 'CMS & Content',
  'testing': 'Testing & QA',
  'design': 'Design & UX',
  'business': 'Business & Strategy',
};

function getTopicCategory(topic) {
  const t = topic.toLowerCase();
  if (t.includes('aws') || t.includes('azure') || t.includes('gcp') || t.includes('cloud') || t.includes('kubernetes') || t.includes('docker') || t.includes('serverless') || t.includes('lambda') || t.includes('ecs') || t.includes('ec2') || t.includes('fargate') || t.includes('terraform') || t.includes('pulumi') || t.includes('cdk') || t.includes('iac')) return 'cloud';
  if (t.includes('react') || t.includes('vue') || t.includes('angular') || t.includes('nextjs') || t.includes('remix') || t.includes('astro') || t.includes('nuxt') || t.includes('svelte') || t.includes('tailwind') || t.includes('css')) return 'framework';
  if (t.includes('typescript') || t.includes('javascript') || t.includes('python') || t.includes('node') || t.includes('bun') || t.includes('deno') || t.includes('golang') || t.includes('rust') || t.includes('java') || t.includes('dart')) return 'language';
  if (t.includes('postgresql') || t.includes('mysql') || t.includes('mongodb') || t.includes('dynamodb') || t.includes('redis') || t.includes('memcached') || t.includes('cassandra') || t.includes('snowflake') || t.includes('bigquery') || t.includes('redshift') || t.includes('sql') || t.includes('nosql') || t.includes('prisma') || t.includes('drizzle') || t.includes('typeorm') || t.includes('dbt') || t.includes('pandas') || t.includes('spark')) return 'database';
  if (t.includes('github') || t.includes('gitlab') || t.includes('circleci') || t.includes('jenkins') || t.includes('devops') || t.includes('ci') || t.includes('cd') || t.includes('monolith') || t.includes('microservice') || t.includes('event') || t.includes('rest') || t.includes('graphql') || t.includes('grpc') || t.includes('api')) return 'devops';
  if (t.includes('ai') || t.includes('openai') || t.includes('anthropic') || t.includes('claude') || t.includes('gemini') || t.includes('langchain') || t.includes('llamaindex') || t.includes('rag') || t.includes('ml') || t.includes('machine learning')) return 'ai';
  if (t.includes('react native') || t.includes('flutter') || t.includes('ionic') || t.includes('mobile') || t.includes('native') || t.includes('expo')) return 'mobile';
  if (t.includes('stripe') || t.includes('gocardless') || t.includes('adyen') || t.includes('braintree') || t.includes('worldpay') || t.includes('payment') || t.includes('fintech')) return 'payment';
  if (t.includes('shopify') || t.includes('woocommerce') || t.includes('magento') || t.includes('contentful') || t.includes('sanity') || t.includes('strapi') || t.includes('headless') || t.includes('cms')) return 'cms';
  if (t.includes('playwright') || t.includes('cypress') || t.includes('selenium') || t.includes('vitest') || t.includes('jest') || t.includes('mocha') || t.includes('testing')) return 'testing';
  if (t.includes('figma') || t.includes('adobe') || t.includes('sketch') || t.includes('design') || t.includes('ux')) return 'design';
  return 'business';
}

function getCategoryCounts() {
  const counts = {};
  Object.keys(categoryLabels).forEach(k => counts[k] = 0);
  comparisonListings.forEach(c => {
    const cat = getTopicCategory(c.topic);
    if (counts[cat] !== undefined) counts[cat]++;
  });
  return counts;
}

function ComparisonCard({ comparison }) {
  const category = getTopicCategory(comparison.topic);
  const label = categoryLabels[category] || 'Business & Strategy';

  return (
    <Link href={`/comparison/${comparison.slug}`} className="group block h-full bg-white rounded-xl border border-border hover:border-accent hover:-translate-y-1 transition-all duration-250 shadow-xs hover:shadow-md">
      <div className="p-6 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-border text-text-body">
              <GitCompare className="w-3 h-3" />
              {label}
            </span>
            {comparison.year && (
              <span className="text-xs font-bold text-accent uppercase tracking-wider bg-accent/5 px-2 py-0.5 rounded">
                {comparison.year}
              </span>
            )}
          </div>

          <h3 className="font-heading text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {comparison.title}
          </h3>

          {comparison.metaDesc && (
            <p className="text-sm text-text-muted line-clamp-3 mb-6">
              {comparison.metaDesc}
            </p>
          )}

          {comparison.badges && comparison.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {comparison.badges.slice(0, 3).map((badge, idx) => (
                <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted">
                  {badge.length > 25 ? badge.substring(0, 25) + '...' : badge}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center text-sm font-semibold text-accent group-hover:gap-1.5 gap-1 transition-all">
          View Comparison <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

function PaginationBar({ currentPage, totalPages }) {
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push('...');
    pages.push(totalPages);
  } else if (currentPage >= totalPages - 3) {
    pages.push(1);
    pages.push('...');
    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push('...');
    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
    pages.push('...');
    pages.push(totalPages);
  }

  const buildHref = (page) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    return `/comparison${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="mt-16 flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link href={buildHref(currentPage - 1)} className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-text-body hover:bg-white transition-all">
          ← Prev
        </Link>
      )}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`e-${idx}`} className="w-9 h-9 flex items-center justify-center text-text-muted text-sm">…</span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={`w-9 h-9 rounded-xl text-sm font-semibold flex items-center justify-center transition-all ${page === currentPage ? 'bg-accent text-white shadow-md shadow-accent/20' : 'text-text-body hover:bg-white'}`}
          >
            {page}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link href={buildHref(currentPage + 1)} className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-text-body hover:bg-white transition-all">
          Next →
        </Link>
      )}
    </div>
  );
}

export default async function ComparisonsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams?.page || '1', 10);

  const filtered = [...comparisonListings].sort((a, b) => a.title.localeCompare(b.title));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary-mid to-primary-light" />
        <div className="absolute top-10 right-[8%] w-125 h-125 rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute bottom-0 left-[5%] w-100 h-100 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 text-center">
          <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">
            <BookOpen className="w-3 h-3 mr-1.5 inline -mt-0.5" />
            Technology Comparisons
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Honest Technology Comparisons
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-body">
            {filtered.length} side-by-side comparisons covering cloud platforms, frameworks, languages, databases, DevOps tools, and more — from a UK agency perspective.
          </p>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-b border-border bg-white">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-muted">
              Showing <span className="font-semibold text-text-primary">{(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-text-primary">{filtered.length}</span> comparisons
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <span key={key} className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Results Grid ── */}
      <section className="py-16 px-6 bg-surface min-h-[60vh]">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginated.map((comparison, index) => (
              <div
                key={comparison.id}
                className="opacity-0 animate-fade-up"
                style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 0.06}s`, animationFillMode: 'forwards' }}
              >
                <ComparisonCard comparison={comparison} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <PaginationBar currentPage={safePage} totalPages={totalPages} />
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary-mid to-primary-light px-8 py-16 md:px-16 md:py-20 text-center">
            <div className="absolute top-0 right-0 w-75 h-75 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-63 h-63 rounded-full bg-accent/5 blur-3xl" />
            <div className="relative">
              <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">Get Expert Guidance</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Not Sure Which Technology to Choose?</h2>
              <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg">Book a free architecture consultation. Our engineers will help you pick the right stack for your UK business.</p>
              <Link href="/contact" className="btn-primary inline-flex items-center justify-center gap-2 text-base px-10 py-4">
                Book Free Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
