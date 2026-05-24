"use client";

import { useMemo } from "react";
import { useCaseStudyList } from "@/hooks/useCaseStudies";
import { ParallaxCaseStudiesSection } from '@/components/landing/sub-services/parallax-case-studies-section';

export const CaseStudySection = ({ serviceName }) => {
  const { data: caseStudies = [], isLoading } = useCaseStudyList();

  const filteredStudies = useMemo(() => {
    // Filter out unpublished drafts
    const published = caseStudies.filter(s => s.published !== false);

    if (!serviceName) return published;

    // Prioritize case studies matching the current service/industry
    const related = published.filter(study =>
      study.title?.toLowerCase().includes(serviceName.toLowerCase()) ||
      study.industry?.toLowerCase().includes(serviceName.toLowerCase()) ||
      study.technologies?.some(t => t.toLowerCase().includes(serviceName.toLowerCase()))
    );

    return related.length > 0 ? related : published;
  }, [caseStudies, serviceName]);

  return <ParallaxCaseStudiesSection caseStudies={filteredStudies} isLoading={isLoading} />;
};