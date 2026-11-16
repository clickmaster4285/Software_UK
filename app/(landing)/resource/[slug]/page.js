import { notFound } from 'next/navigation';
import { getResourceGuideBySlug, getRelatedResourceGuides, getDedupedFaqs } from '@/data/resource-guides';
import ResourceGuideDetailClient from './detail-client';
import JsonLd from '@/components/JsonLd';
import { articleSchema, breadcrumbSchema, clampDescription, faqSchema, siteConfig, withBrandSuffix } from '@/app/metadata-config';

// Generate static params for all resource guide pages
export async function generateStaticParams() {
  const { resourceGuideListings } = await import('@/data/resource-guides');
  return resourceGuideListings.map((rg) => ({ slug: rg.slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = getResourceGuideBySlug(slug);

  if (!guide) {
    return { title: 'Resource Guide Not Found | Clickmasters' };
  }

  return {
    title: withBrandSuffix(guide.metaTitle || guide.title),
    description: clampDescription(
      guide.metaDesc || `UK software development resource guide: ${guide.title}.`
    ),
    alternates: {
      canonical: `${siteConfig.url}/resource/${slug}`,
    },
  };
}

export default async function ResourceGuideDetailPage({ params }) {
  const { slug } = await params;
  const guide = getResourceGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedGuides = getRelatedResourceGuides(slug, 4);
  const dedupedFaqs = getDedupedFaqs(guide.faqs);

  // Build JSON-LD structured data for Article using central helpers
  const articleJsonLd = articleSchema({
    title: guide.title,
    description: guide.metaDesc || `UK software development resource guide: ${guide.title}.`,
    url: `/resource/${slug}`,
    author: guide.writtenBy || guide.author || 'Clickmasters',
    datePublished: guide.lastUpdated || undefined,
    dateModified: guide.lastUpdated || undefined,
    image: `${siteConfig.url}/og/services.webp`,
  });

  const breadcrumbsLd = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resource Guides', url: '/resource' },
    { name: guide.title, url: `/resource/${slug}` }
  ]);

  // Build FAQ structured data (deduplicated)
  const faqJsonLd = dedupedFaqs.length > 0
    ? faqSchema(dedupedFaqs)
    : null;

  return (
    <>
      <JsonLd schema={articleJsonLd} />
      <JsonLd schema={breadcrumbsLd} />
      {faqJsonLd && <JsonLd schema={faqJsonLd} />}
      <ResourceGuideDetailClient guide={{ ...guide, faqs: dedupedFaqs }} relatedGuides={relatedGuides} />
    </>
  );
}
