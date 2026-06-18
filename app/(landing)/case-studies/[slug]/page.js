import { notFound } from 'next/navigation';
import { getCaseStudyBySlug, getRelatedCaseStudies } from '@/data/case-studies';
import { CaseStudyDetailClient } from './detail-client';

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

  // Build JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: study.title,
    description: study.metaDesc || study.challenge?.substring(0, 200),
    author: {
      '@type': 'Organization',
      name: study.writtenBy || 'ClickMasters',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ClickMasters Software Development Company',
      url: 'https://clickmasterssoftwaredevelopmentcompany.co.uk',
    },
    dateModified: study.lastUpdated || undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://clickmasterssoftwaredevelopmentcompany.co.uk/case-studies/${slug}`,
    },
  };

  // Add review structured data if client quote exists
  const reviewJsonLd = study.clientQuote
    ? {
        '@context': 'https://schema.org',
        '@type': 'Review',
        itemReviewed: {
          '@type': 'Organization',
          name: 'ClickMasters Software Development Company',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {reviewJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
        />
      )}
      <CaseStudyDetailClient study={study} relatedStudies={relatedStudies} />
    </>
  );
}
