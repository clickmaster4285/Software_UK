import { notFound } from 'next/navigation';
import { getCityBySlug, getRelatedCities, getDedupedFaqs } from '@/data/cities';
import { CityDetailClient } from './detail-client';
import JsonLd from '@/components/JsonLd';
import {
  articleSchema,
  breadcrumbSchema,
  clampDescription,
  faqSchema,
  siteConfig,
  withBrandSuffix,
} from '@/app/metadata-config';

export async function generateStaticParams() {
  const { cityListings } = await import('@/data/cities');
  return cityListings.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    return { title: 'City Guide Not Found | Clickmasters' };
  }

  return {
    title: withBrandSuffix(city.metaTitle || city.title),
    description: clampDescription(
      city.metaDesc || `Custom software development services in ${city.city.replace(/-/g, ' ')}.`
    ),
    alternates: {
      canonical: `${siteConfig.url}/locations/${slug}`,
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
  const pageUrl = `${siteConfig.url}/locations/${slug}`;
  const description = clampDescription(
    city.metaDesc || `Custom software development in ${city.city.replace(/-/g, ' ')}.`
  );

  const jsonLd = articleSchema({
    title: city.title,
    description,
    url: pageUrl,
    author: city.writtenBy || 'Clickmasters Team',
    datePublished: city.lastUpdated,
    dateModified: city.lastUpdated,
    image: `${siteConfig.url}/og/services.webp`,
  });

  const dedupedFaqs = getDedupedFaqs(city.faqs);
  const faqJsonLd = dedupedFaqs.length > 0 ? faqSchema(dedupedFaqs) : null;
  const crumbs = breadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Locations', url: `${siteConfig.url}/locations` },
    { name: city.cityDisplay || city.city, url: pageUrl },
  ]);

  return (
    <>
      <JsonLd schema={jsonLd} />
      <JsonLd schema={crumbs} />
      {faqJsonLd && <JsonLd schema={faqJsonLd} />}
      <CityDetailClient city={{ ...city, faqs: dedupedFaqs }} relatedCities={relatedCities} />
    </>
  );
}
