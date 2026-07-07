import { notFound } from 'next/navigation';
import { hirePageListings, getHirePageByRoleCity, getRelatedHirePages, getDedupedFaqs } from '@/data/hire-pages';
import { HireDetailClient } from './detail-client';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, siteConfig } from '@/app/metadata-config';

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
  const formattedFaqs = dedupedFaqs.map(faq => ({
    question: faq.question.replace(/^:\s*/, ''),
    answer: faq.answer.replace(/^:\s*/, ''),
  }));
  const faqJsonLd = formattedFaqs.length > 0 ? faqSchema(formattedFaqs) : null;

  const breadcrumbsLd = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Hire', url: '/hire' },
    { name: roleName, url: `/hire#${role}` },
    { name: cityName, url: `/hire/${role}/${city}` }
  ]);

  return (
    <>
      <JsonLd schema={jsonLd} />
      <JsonLd schema={breadcrumbsLd} />
      {faqJsonLd && <JsonLd schema={faqJsonLd} />}
      <HireDetailClient hirePage={{ ...hirePage, faqs: dedupedFaqs }} relatedPages={relatedPages} />
    </>
  );
}
