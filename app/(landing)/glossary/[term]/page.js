import { notFound } from 'next/navigation';
import { getGlossaryTermBySlug, getRelatedTerms } from '@/data/glossary';
import GlossaryDetailClient from './detail-client';

// Generate static params for all glossary term pages
export async function generateStaticParams() {
  const { glossaryListings } = await import('@/data/glossary');
  return glossaryListings.map((gt) => ({ term: gt.slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { term } = await params;
  const glossaryTerm = getGlossaryTermBySlug(term);

  if (!glossaryTerm) {
    return { title: 'Term Not Found | ClickMasters Glossary' };
  }

  return {
    title: glossaryTerm.metaTitle || `What is ${glossaryTerm.termDisplay}? UK Definition | ClickMasters`,
    description: glossaryTerm.metaDesc || `Definition of ${glossaryTerm.termDisplay} in UK software development context.`,
  };
}

export default async function GlossaryTermDetailPage({ params }) {
  const { term } = await params;
  const glossaryTerm = getGlossaryTermBySlug(term);

  if (!glossaryTerm) {
    notFound();
  }

  const relatedTerms = getRelatedTerms(term, 6);

  // Build JSON-LD structured data for DefinedTerm
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: glossaryTerm.termDisplay,
    description: glossaryTerm.directAnswer || glossaryTerm.metaDesc || '',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'ClickMasters Software Development Glossary',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GlossaryDetailClient term={glossaryTerm} relatedTerms={relatedTerms} />
    </>
  );
}
