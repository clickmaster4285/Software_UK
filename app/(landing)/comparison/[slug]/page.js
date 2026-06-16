import { notFound } from 'next/navigation';
import { getComparisonBySlug, getRelatedComparisons, getDedupedFaqs } from '@/data/comparisons';
import { ComparisonDetailClient } from './detail-client';

export async function generateStaticParams() {
  const { comparisonListings } = await import('@/data/comparisons');
  return comparisonListings.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

  if (!comparison) {
    return { title: 'Comparison Not Found | ClickMasters' };
  }

  return {
    title: comparison.metaTitle || comparison.title,
    description: comparison.metaDesc || `Compare ${comparison.topic.replace(/_/g, ' ')} for UK software development.`,
  };
}

export default async function ComparisonDetailPage({ params }) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

  if (!comparison) {
    notFound();
  }

  const relatedComparisons = getRelatedComparisons(slug, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: comparison.title,
    description: comparison.metaDesc || `Comparison of ${comparison.topic.replace(/_/g, ' ')} for UK businesses.`,
    author: {
      '@type': 'Organization',
      name: comparison.writtenBy || 'ClickMasters Technology Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ClickMasters Software Development Company',
      url: 'https://clickmasterssoftwaredevelopmentcompany.co.uk',
    },
    dateModified: comparison.lastUpdated || undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://clickmasterssoftwaredevelopmentcompany.co.uk/comparison/${slug}`,
    },
  };

  const dedupedFaqs = getDedupedFaqs(comparison.faqs);
  const faqJsonLd = dedupedFaqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: dedupedFaqs.map(faq => ({
          '@type': 'Question',
          name: faq.question.replace(/^:\s*/, ''),
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer.replace(/^:\s*/, ''),
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ComparisonDetailClient comparison={{ ...comparison, faqs: dedupedFaqs }} relatedComparisons={relatedComparisons} />
    </>
  );
}
