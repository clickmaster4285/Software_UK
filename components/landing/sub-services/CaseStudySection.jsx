"use client";

import { useMemo } from "react";
import { useCaseStudyList } from "@/hooks/useCaseStudies";
import { ParallaxCaseStudiesSection } from '@/components/landing/sub-services/parallax-case-studies-section';
import { filterCaseStudyCardsForService } from '@/lib/case-study-public';

function toParallaxShape(study) {
  return {
    _id: study._id || study.slug,
    title: study.title,
    excerpt: study.excerpt || study.metaDesc || study.challenge?.slice?.(0, 160) || '',
    thumbnail: study.thumbnail || null,
    slug: study.slug || study._id,
    technologies: study.technologies || [],
    industry: study.industry || study.sector || '',
    timeline: study.timeline || '',
    client: study.client || study.country || 'UK',
    published: study.published !== false,
    createdAt: study.createdAt || study.lastUpdated || null,
  };
}

export const CaseStudySection = ({ serviceName }) => {
  const { data: apiStudies = [], isLoading } = useCaseStudyList();

  const filteredStudies = useMemo(() => {
    // Prefer the lightweight static cards so SSR HTML always contains crawlable
    // case-study inlinks, even before the admin API responds.
    const staticCards = filterCaseStudyCardsForService(serviceName, 5).map(toParallaxShape);
    const fromApi = (apiStudies || []).filter((s) => s.published !== false);
    if (fromApi.length === 0) return staticCards;

    const bySlug = new Map(fromApi.map((study) => [study.slug || study._id, study]));
    return staticCards.map((card) => {
      const live = bySlug.get(card.slug);
      return live ? toParallaxShape({ ...card, ...live }) : card;
    });
  }, [apiStudies, serviceName]);

  return (
    <ParallaxCaseStudiesSection
      caseStudies={filteredStudies}
      isLoading={isLoading && filteredStudies.length === 0}
    />
  );
};
