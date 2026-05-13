"use client";

import { useProjectList } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function SolutionCTA() {
  const { data: projects, isLoading } = useProjectList();
  
  // Show only featured or latest 3 projects
  const featuredProjects = projects?.slice(0, 3) || [];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-400 mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-accent font-bold uppercase tracking-widest text-sm"
            >
              Our Recent Work
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="font-heading font-bold text-3xl md:text-5xl text-primary mt-4 tracking-tight"
            >
              Software Solutions That <span className="text-accent">Deliver Results</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors"
            >
              View All Projects <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
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
                <Card className="py-0 group border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-surface flex flex-col h-full">
                  <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
                    <img 
                      src={project.thumbnail || "https://via.placeholder.com/800x600?text=Project"} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-6 right-6">
                      <Badge className="bg-white/95 text-primary border-none backdrop-blur-md uppercase tracking-wider text-[10px] font-black px-3 py-1.5 shadow-lg">
                        {project.status || "Completed"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-10 flex-1 flex flex-col">
                    <h3 className="text-2xl font-heading font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-text-body font-body text-sm line-clamp-3 mb-8 flex-1 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-text-muted uppercase tracking-wider bg-white border border-border px-3 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <Link 
                      href={project.url || "#"} 
                      target="_blank"
                      className="w-full py-4 bg-primary hover:bg-accent text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/10"
                    >
                      View Project <ExternalLink className="w-4 h-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

