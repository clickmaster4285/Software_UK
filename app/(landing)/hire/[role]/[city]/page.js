import { notFound } from 'next/navigation';
import { hirePageListings, getHirePageByRoleCity, getRelatedHirePages, getDedupedFaqs } from '@/data/hire-pages';
import { HireDetailClient } from './detail-client';

// Generate static params for all hire pages
export async function generateStaticParams() {
  return hirePageListings.map((hp) => ({
    role: hp.role,
    city: hp.city,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { role, city } = await params;
  const hirePage = getHirePageByRoleCity(role, city);

  if (!hirePage) {
    return { title: 'Hire Developer Not Found | ClickMasters' };
  }

  return {
    title: hirePage.metaTitle || hirePage.title,
    description: hirePage.metaDesc || `Hire a ${role} in ${city}. IR35-compliant, vetted developers.`,
    alternates: {
      canonical: `https://clickmasterssoftwaredevelopmentcompany.co.uk/hire/${role}/${city}`,
    },
  };
}

export default async function HireDetailPage({ params }) {
  const { role, city } = await params;
  const hirePage = getHirePageByRoleCity(role, city);

  if (!hirePage) {
    notFound();
  }

  // Get related pages: same role, different city
  const relatedPages = getRelatedHirePages(role, city, 8);

  // Build JSON-LD structured data
  const cityName = hirePage.cityDisplay
    ? hirePage.cityDisplay.charAt(0).toUpperCase() + hirePage.cityDisplay.slice(1)
    : city;
  const roleName = role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Hire ${roleName} Developer in ${cityName}`,
    description: hirePage.metaDesc || `Hire a vetted ${roleName} developer in ${cityName}. IR35-compliant, 3-stage vetting.`,
    provider: {
      '@type': 'Organization',
      name: 'ClickMasters Software Development Company',
      url: 'https://clickmasterssoftwaredevelopmentcompany.co.uk',
    },
    areaServed: {
      '@type': 'City',
      name: cityName,
      containedInPlace: {
        '@type': 'Country',
        name: 'United Kingdom',
      },
    },
    ...(hirePage.rates?.mid && {
      offers: {
        '@type': 'Offer',
        price: hirePage.rates.mid.replace(/[^0-9.]/g, ''),
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
      },
    }),
  };

  // Build FAQ structured data (deduplicated)
  const dedupedFaqs = getDedupedFaqs(hirePage.faqs);
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
      <HireDetailClient hirePage={{ ...hirePage, faqs: dedupedFaqs }} relatedPages={relatedPages} />
    </>
  );
}
