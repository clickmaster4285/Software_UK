"use client";

import { useProjectList } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ProjectCard } from "@/components/admin/ProjectCard";

export default function SolutionCTA() {
  const { data: projects, isLoading } = useProjectList();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  // Section level scroll animations
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(10px)", "blur(0px)"]);

  // Show only featured or latest 3 projects
  const featuredProjects = projects?.slice(0, 3) || [];

  return (
    <section ref={sectionRef} className="py-32 relative bg-white overflow-hidden">
      <motion.div
        style={{ scale, opacity, filter: blur }}
        className="max-w-400 mx-auto px-6 relative z-10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-accent font-bold uppercase tracking-widest text-sm block mb-4">
              Our Recent Work
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary tracking-tight">
              Software Solutions That <span className="text-accent">Deliver Results</span>
            </h2>
          </div>
          <div>
            <Link
              href="/software-solutions"
              className="group inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors"
            >
              View All Projects <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="h-[400px] rounded-[2rem]" />)
          ) : (
            featuredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </section>
  );
}
