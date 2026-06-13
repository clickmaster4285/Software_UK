import { notFound } from 'next/navigation';
import { caseStudies } from '@/data/case-studies';
import { CaseStudyDetailClient } from './detail-client';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = caseStudies.find((cs) => cs.slug === slug);

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
  const study = caseStudies.find((cs) => cs.slug === slug);

  if (!study) {
    notFound();
  }

  // Related studies: same sector, excluding current
  const currentSector = study.sector?.split('/')[0]?.trim();
  const relatedStudies = caseStudies
    .filter(cs => cs.slug !== slug && cs.sector?.split('/')[0]?.trim() === currentSector)
    .slice(0, 3);

  return (
    <CaseStudyDetailClient study={study} relatedStudies={relatedStudies} />
  );
}
