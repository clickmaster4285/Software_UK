import { notFound } from 'next/navigation';
import { getCaseStudyBySlug, getRelatedCaseStudies } from '@/data/case-studies';
import { CaseStudyDetailClient } from './detail-client';
import JsonLd from '@/components/JsonLd';
import { articleSchema, breadcrumbSchema } from '@/app/metadata-config';

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
    return { title: 'Case Study Not Found | Clickmasters' };
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
  const relatedStudies = getRelatedCaseStudies(slug, 4);

  // Build JSON-LD structured data using central helpers
  const articleJsonLd = articleSchema({
    title: study.title,
    description: study.metaDesc || study.challenge?.substring(0, 200),
    url: `/case-studies/${slug}`,
    author: study.writtenBy || 'Clickmasters',
    datePublished: study.lastUpdated || undefined,
    dateModified: study.lastUpdated || undefined,
    image: study.image || study.heroImage || undefined,
  });

  const breadcrumbsLd = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Case Studies', url: '/case-studies' },
    { name: study.title, url: `/case-studies/${slug}` }
  ]);

  // Review/Rating JSON-LD omitted: client quotes are anonymised ("name withheld")
  // and must not claim a named, consenting reviewer in Rich Results.

  return (
    <>
      <JsonLd schema={articleJsonLd} />
      <JsonLd schema={breadcrumbsLd} />
      <CaseStudyDetailClient study={study} relatedStudies={relatedStudies} />
    </>
  );
}
