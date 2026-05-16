"use client";

import { useProjectList } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

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
    <section ref={sectionRef} className="py-32 bg-white relative overflow-hidden">
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
              href="/projects"
              className="group inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors"
            >
              View All Projects <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="h-112 rounded-[2rem]" />)
          ) : (
            featuredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className=" py-0 group border border-border/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2rem] overflow-hidden bg-white flex flex-col h-full cursor-pointer">
                  <div className="aspect-16/10 relative overflow-hidden">
                    <Image 
                      src={project.thumbnail || "https://via.placeholder.com/800x600?text=Project"} 
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/80 backdrop-blur-md text-primary border-none uppercase tracking-wider text-[10px] font-bold px-3 py-1.5 shadow-sm">
                        {project.status || "Completed"}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-8 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags?.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/5 px-2.5 py-1 rounded-lg border border-accent/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-heading font-bold text-primary mb-3 group-hover:text-accent transition-colors leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-text-body font-body text-sm line-clamp-2 mb-6 leading-relaxed opacity-80">
                        {project.description}
                      </p>
                    </div>

                    <Link 
                      href={project.url || "#"} 
                      target="_blank"
                      className="inline-flex items-center gap-3 text-primary font-bold group/btn hover:text-accent transition-colors"
                    >
                      <span>Explore Project</span>
                      <div className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center group-hover/btn:bg-accent group-hover/btn:text-white transition-all duration-300">
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </section>
  );
}
