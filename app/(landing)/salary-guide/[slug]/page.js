import { notFound } from 'next/navigation';
import { getSalaryGuideBySlug, getRelatedSalaryGuides, getDedupedFaqs } from '@/data/salary-guides';
import { SalaryGuideDetailClient } from './detail-client';
import JsonLd from '@/components/JsonLd';
import {
  articleSchema,
  breadcrumbSchema,
  clampDescription,
  faqSchema,
  siteConfig,
  withBrandSuffix,
} from '@/app/metadata-config';

// Generate static params for all salary guide pages
export async function generateStaticParams() {
  const { salaryGuideListings } = await import('@/data/salary-guides');
  return salaryGuideListings.map((sg) => ({ slug: sg.slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = getSalaryGuideBySlug(slug);

  if (!guide) {
    return { title: 'Salary Guide Not Found | Clickmasters' };
  }

  return {
    title: withBrandSuffix(guide.metaTitle || guide.title),
    description: clampDescription(
      guide.metaDesc ||
        `Find standard UK software developer salaries and day rates for ${guide.role.replace(/-/g, ' ')} roles in ${guide.year}.`
    ),
    alternates: {
      canonical: `${siteConfig.url}/salary-guide/${slug}`,
    },
  };
}

export default async function SalaryGuideDetailPage({ params }) {
  const { slug } = await params;
  const guide = getSalaryGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedGuides = getRelatedSalaryGuides(slug, 4);
  const pageUrl = `${siteConfig.url}/salary-guide/${slug}`;
  const description = clampDescription(
    guide.metaDesc || `Salary benchmarks for ${guide.role.replace(/-/g, ' ')} in the UK.`
  );

  const jsonLd = articleSchema({
    title: guide.title,
    description,
    url: pageUrl,
    author: guide.writtenBy || 'Clickmasters Team',
    datePublished: guide.lastUpdated,
    dateModified: guide.lastUpdated,
    image: `${siteConfig.url}/og/services.webp`,
  });

  const dedupedFaqs = getDedupedFaqs(guide.faqs);
  const faqJsonLd = dedupedFaqs.length > 0 ? faqSchema(dedupedFaqs, pageUrl) : null;
  const crumbs = breadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Salary Guides', url: `${siteConfig.url}/salary-guide` },
    { name: guide.role || guide.title, url: pageUrl },
  ]);

  return (
    <>
      <JsonLd schema={jsonLd} />
      <JsonLd schema={crumbs} />
      {faqJsonLd && <JsonLd schema={faqJsonLd} />}
      <SalaryGuideDetailClient guide={{ ...guide, faqs: dedupedFaqs }} relatedGuides={relatedGuides} />
    </>
  );
}
