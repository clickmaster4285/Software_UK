"use client";

import { useProjectList } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/admin/ProjectCard";

function ShowcaseCardSkeleton() {
  return (
    <div className="min-h-105 overflow-hidden rounded-2xl bg-white ring-1 ring-primary/8 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
      <Skeleton className="aspect-5/4 w-full rounded-none" />
      <div className="space-y-3 p-5 sm:p-6">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-7 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between border-t border-primary/8 pt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function SolutionCTA() {
  const { data: projects, isLoading } = useProjectList();
  const featuredProjects = projects?.slice(0, 3) || [];

  return (
    <section className="relative overflow-hidden bg-surface py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--primary) 12%, transparent) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        className="pointer-events-none absolute -right-32 top-16 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-8 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-0.5 w-8 rounded-full bg-accent" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                Our Recent Work
              </span>
              <span className="h-0.5 w-8 rounded-full bg-accent" />
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-primary md:text-5xl">
              Software Solutions That{" "}
              <span className="bg-linear-to-r from-accent to-accent-hover bg-clip-text text-transparent">
                Deliver Results
              </span>
            </h2>
          </div>
          <Link
            href="/software-solutions"
            className="group inline-flex items-center gap-2 font-bold text-primary transition-colors hover:text-accent"
          >
            View All Projects
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {isLoading
            ? [1, 2, 3].map((i) => <ShowcaseCardSkeleton key={i} />)
            : featuredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.45 }}
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <ProjectCard project={project} variant="showcase" />
                </motion.div>
              ))}
        </div>
        </div>
    </section>
  );
}
