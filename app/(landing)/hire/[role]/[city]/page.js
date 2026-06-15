import { notFound } from 'next/navigation';
import { hirePages } from '@/data/hire-pages';
import { HireDetailClient } from './detail-client';

// Generate static params for all hire pages
export async function generateStaticParams() {
  const params = [];

  hirePages.forEach(hp => {
    params.push({
      role: hp.role,
      city: hp.city
    });
  });

  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { role, city } = await params;
  const hirePage = hirePages.find(hp => hp.role === role && hp.city === city);

  if (!hirePage) {
    return { title: 'Hire Developer Not Found | ClickMasters' };
  }

  return {
    title: hirePage.metaTitle || hirePage.title,
    description: hirePage.metaDesc || `Hire a ${role} in ${city}. IR35-compliant, vetted developers.`,
  };
}

export default async function HireDetailPage({ params }) {
  const { role, city } = await params;
  const hirePage = hirePages.find(hp => hp.role === role && hp.city === city);

  if (!hirePage) {
    notFound();
  }

  // Get related pages: same role, different city
  const relatedPages = hirePages
    .filter(hp => hp.role === role && hp.city !== city)
    .slice(0, 4);

  return (
    <HireDetailClient hirePage={hirePage} relatedPages={relatedPages} />
  );
}