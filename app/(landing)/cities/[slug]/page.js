import { notFound } from 'next/navigation';
import { getCityBySlug, getRelatedCities, getDedupedFaqs } from '@/data/cities';
import { CityDetailClient } from './detail-client';

export async function generateStaticParams() {
  const { cityListings } = await import('@/data/cities');
  return cityListings.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    return { title: 'City Guide Not Found | ClickMasters' };
  }

  return {
    title: city.metaTitle || city.title,
    description: city.metaDesc || `Custom software development services in ${city.city.replace(/-/g, ' ')}.`,
    alternates: {
      canonical: `https://clickmasterssoftwaredevelopmentcompany.co.uk/cities/${slug}`,
    },
  };
}

export default async function CityDetailPage({ params }) {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  const relatedCities = getRelatedCities(slug, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: city.title,
    description: city.metaDesc || `Custom software development in ${city.city.replace(/-/g, ' ')}.`,
    author: {
      '@type': 'Organization',
      name: city.writtenBy || 'ClickMasters Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ClickMasters Software Development Company',
      url: 'https://clickmasterssoftwaredevelopmentcompany.co.uk',
    },
    dateModified: city.lastUpdated || undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://clickmasterssoftwaredevelopmentcompany.co.uk/cities/${slug}`,
    },
  };

  const dedupedFaqs = getDedupedFaqs(city.faqs);
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
      <CityDetailClient city={{ ...city, faqs: dedupedFaqs }} relatedCities={relatedCities} />
    </>
  );
}
