import { notFound } from 'next/navigation';
import { getSalaryGuideBySlug, getRelatedSalaryGuides, getDedupedFaqs } from '@/data/salary-guides';
import { SalaryGuideDetailClient } from './detail-client';

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
    return { title: 'Salary Guide Not Found | ClickMasters' };
  }

  return {
    title: guide.metaTitle || guide.title,
    description: guide.metaDesc || `Find standard UK software developer salaries and day rates for ${guide.role.replace(/-/g, ' ')} roles in ${guide.year}.`,
  };
}

export default async function SalaryGuideDetailPage({ params }) {
  const { slug } = await params;
  const guide = getSalaryGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  // Get related guides: same role category
  const relatedGuides = getRelatedSalaryGuides(slug, 4);

  // Build JSON-LD structured data for Article
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDesc || `Salary benchmarks for ${guide.role.replace(/-/g, ' ')} in the UK.`,
    author: {
      '@type': 'Organization',
      name: guide.writtenBy || 'ClickMasters HR Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ClickMasters Software Development Company',
      url: 'https://clickmasterssoftwaredevelopmentcompany.co.uk',
    },
    dateModified: guide.lastUpdated || undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://clickmasterssoftwaredevelopmentcompany.co.uk/salary-guide/${slug}`,
    },
  };

  // Build FAQ structured data (deduplicated)
  const dedupedFaqs = getDedupedFaqs(guide.faqs);
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
      <SalaryGuideDetailClient guide={{ ...guide, faqs: dedupedFaqs }} relatedGuides={relatedGuides} />
    </>
  );
}
