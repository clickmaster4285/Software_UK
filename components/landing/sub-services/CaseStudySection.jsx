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
    const fromApi = (apiStudies || []).filter((s) => s.published !== false);
    if (fromApi.length > 0) {
      if (!serviceName) return fromApi.slice(0, 6).map(toParallaxShape);
      const q = serviceName.toLowerCase();
      const related = fromApi.filter(
        (study) =>
          study.title?.toLowerCase().includes(q) ||
          study.industry?.toLowerCase().includes(q) ||
          study.sector?.toLowerCase().includes(q) ||
          study.technologies?.some((t) => t.toLowerCase().includes(q))
      );
      return (related.length > 0 ? related : fromApi).slice(0, 6).map(toParallaxShape);
    }

    return filterCaseStudyCardsForService(serviceName, 6).map(toParallaxShape);
  }, [apiStudies, serviceName]);

  return (
    <ParallaxCaseStudiesSection
      caseStudies={filteredStudies}
      isLoading={isLoading && filteredStudies.length === 0}
    />
  );
};
