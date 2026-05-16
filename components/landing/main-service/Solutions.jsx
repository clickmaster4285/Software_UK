"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CardStack } from "@/components/ui/card-stack";
import { apiFetch } from "@/lib/api";
import { resolveImageUrl } from "@/lib/utils";

function useResponsiveCardConfig() {
  const [config, setConfig] = useState({
    spreadDeg,
    cardWidth,
    cardHeight,
    overlap,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setConfig({ spreadDeg, cardWidth, cardHeight, overlap: 0.38 });
      } else if (width < 768) {
        setConfig({ spreadDeg, cardWidth, cardHeight, overlap: 0.42 });
      } else if (width < 1024) {
        setConfig({ spreadDeg, cardWidth, cardHeight, overlap: 0.46 });
      } else if (width < 1280) {
        setConfig({ spreadDeg, cardWidth, cardHeight, overlap: 0.50 });
      } else {
        setConfig({ spreadDeg, cardWidth, cardHeight, overlap: 0.52 });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return config;
}

export default function SolutionsPage() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects-public"],
    queryFn: async () => {
      const res = await apiFetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const responsiveConfig = useResponsiveCardConfig();

  const cardStackItems = projects.slice(0, 9).map((project) => ({
    id,
    title: project.title || "Untitled Project",
    description:
      project.description?.length > 85
        ? `${project.description.substring(0, 85)}...`
        : project.description || "No description available",
    imageSrc: project.thumbnail
      ? resolveImageUrl(project.thumbnail)
      : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    href: project.url || "#",
  }));

  if (isLoading) {
    return <div className="py-24 text-center">Loading...</div>;
  }

  return (
    <main className="bg-linear-to-b from-white to-slate-50">
      {/* overflow-x-clip prevents scrollbar without clipping bottom */}
      <section className="py-12 sm:py-16 md:py-24 bg-gray-50 overflow-x-clip">

        {/* max-w-7xl + px matches your navbar container exactly */}
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-0.5 w-8 rounded-full bg-accent" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                OUR SOLUTIONS
              </p>
              <span className="h-0.5 w-8 rounded-full bg-accent" />
            </div>

            <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
              Our Work in Action
            </h2>

            <p className="mt-5 text-slate-600 text-lg">
              See how we&apos;ve helped businesses transform their ideas into
              successful digital products.
            </p>
          </div>

          {/* Card stack inner padding gives the visual left/right breathing room */}
          <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
            {cardStackItems.length > 0 ? (
              <CardStack
                items={cardStackItems}
                initialIndex={Math.min(2, cardStackItems.length - 1)}
                autoAdvance
                intervalMs={3000}
                pauseOnHover
                showDots
                {...responsiveConfig}
              />
            ) : (
              <p className="text-center py-20 text-gray-500">
                No projects available yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}