import { notFound } from 'next/navigation';
import { getResourceGuideBySlug, getRelatedResourceGuides, getDedupedFaqs } from '@/data/resource-guides';
import ResourceGuideDetailClient from './detail-client';

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
    return { title: 'Resource Guide Not Found | ClickMasters' };
  }

  return {
    title: guide.metaTitle || guide.title,
    description: guide.metaDesc || `UK software development resource guide: ${guide.title}.`,
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

  // Build JSON-LD structured data for Article
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDesc || `UK software development resource guide: ${guide.title}.`,
    author: {
      '@type': 'Organization',
      name: guide.writtenBy || guide.author || 'ClickMasters',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ClickMasters Software Development Company',
      url: 'https://clickmasterssoftwaredevelopmentcompany.co.uk',
    },
    dateModified: guide.lastUpdated || undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://clickmasterssoftwaredevelopmentcompany.co.uk/resource/${slug}`,
    },
  };

  // Build FAQ structured data (deduplicated)
  const faqJsonLd = dedupedFaqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: dedupedFaqs.map(faq => ({
          '@type': 'Question',
          name: faq.question.trim(),
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer.trim(),
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
      <ResourceGuideDetailClient guide={{ ...guide, faqs: dedupedFaqs }} relatedGuides={relatedGuides} />
    </>
  );
}
