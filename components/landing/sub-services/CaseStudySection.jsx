"use client";

import { useCaseStudyList } from "@/hooks/useCaseStudies";
import { ParallaxCaseStudiesSection } from '@/components/landing/sub-services/parallax-case-studies-section';

export const CaseStudySection = () => {
  const { data: caseStudies = [], isLoading } = useCaseStudyList();

  return <ParallaxCaseStudiesSection caseStudies={caseStudies} isLoading={isLoading} />;
};