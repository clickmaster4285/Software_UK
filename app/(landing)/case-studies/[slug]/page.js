import { notFound } from 'next/navigation';
import { getCaseStudyBySlug, getRelatedCaseStudies } from '@/data/case-studies';
import { CaseStudyDetailClient } from './detail-client';
import JsonLd from '@/components/JsonLd';
import { articleSchema, breadcrumbSchema, siteConfig } from '@/app/metadata-config';

// Generate static params for all case study pages
export async function generateStaticParams() {
  // Use lightweight data for params generation
  const { caseStudyListings } = await import('@/data/case-studies');
  return caseStudyListings.map((cs) => ({ slug: cs.slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    return { title: 'Case Study Not Found | ClickMasters' };
  }

  return {
    title: study.metaTitle || study.title,
    description: study.metaDesc || study.challenge?.substring(0, 160),
    alternates: {
      canonical: `https://clickmasterssoftwaredevelopmentcompany.co.uk/case-studies/${slug}`,
    },
  };
}

export default async function CaseStudyDetailPage({ params }) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  // Related studies: same sector, excluding current
  const relatedStudies = getRelatedCaseStudies(slug, 3);

  // Build JSON-LD structured data using central helpers
  const articleJsonLd = articleSchema({
    title: study.title,
    description: study.metaDesc || study.challenge?.substring(0, 200),
    url: `/case-studies/${slug}`,
    author: study.writtenBy || 'ClickMasters',
    dateModified: study.lastUpdated || undefined,
  });

  const breadcrumbsLd = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Case Studies', url: '/case-studies' },
    { name: study.title, url: `/case-studies/${slug}` }
  ]);

  // Add review structured data if client quote exists
  const reviewJsonLd = study.clientQuote
    ? {
        '@context': 'https://schema.org',
        '@type': 'Review',
        itemReviewed: {
          '@type': 'Organization',
          name: siteConfig.legalName || siteConfig.name,
        },
        author: {
          '@type': 'Person',
          name: study.writtenBy || 'Client',
        },
        reviewBody: study.clientQuote,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
      }
    : null;

  return (
    <>
      <JsonLd schema={articleJsonLd} />
      <JsonLd schema={breadcrumbsLd} />
      {reviewJsonLd && <JsonLd schema={reviewJsonLd} />}
      <CaseStudyDetailClient study={study} relatedStudies={relatedStudies} />
    </>
  );
}
