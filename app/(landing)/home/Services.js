"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Globe2, Smartphone, Palette, BrainCircuit, Database } from "lucide-react";

const services = [
  {
    title: "Software Development",
    description: "Custom enterprise platforms and scalable SaaS products engineered for high performance.",
    icon: <Code2 className="w-10 h-10" />,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    href: "/software-development"
  },
  {
    title: "Web Development",
    description: "Modern web applications and SEO-optimized portals that convert visitors into revenue.",
    icon: <Globe2 className="w-10 h-10" />,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    href: "/web-development"
  },
  {
    title: "Mobile Development",
    description: "Native and cross-platform mobile apps for iOS and Android with seamless sync capabilities.",
    icon: <Smartphone className="w-10 h-10" />,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop",
    href: "/mobile-development"
  },
  {
    title: "AI & Machine Learning",
    description: "Transformative generative AI, RAG systems, and predictive models integrated into your workflow.",
    icon: <BrainCircuit className="w-10 h-10" />,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    href: "/artificial-intelligence-ai"
  },
  {
    title: "UI/UX Design",
    description: "User-first design systems and interactive prototypes focused on measurable business outcomes.",
    icon: <Palette className="w-10 h-10" />,
    image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/design"
  },
  {
    title: "Cloud & DevOps",
    description: "Scalable cloud-native architecture and automated CI/CD pipelines for zero-downtime releases.",
    icon: <Database className="w-10 h-10" />,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    href: "/cloud-devops"
  }
];

export default function Services() {
  return (
    <section className="py-32 bg-surface overflow-hidden">
      <div className="max-w-400 mx-auto px-6">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent/60 font-bold uppercase tracking-loose text-[9.25rem] leading-0 "
          >
            What We Do
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="font-heading font-bold text-2xl md:text-3xl text-primary mt-4 mb-6 tracking-tight"
          >
            End-to-End <span className="text-accent">Engineering Excellence</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-text-body font-body text-lg "
          >
            We combine strategic product design with deep technical expertise to build software that scales.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={service.href}
                className="group relative block h-105 rounded-[2.5rem] overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 grayscale group-hover:grayscale-0 group-hover:opacity-40"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/10 to-primary/40 z-10" />
                </div>

                {/* Content */}
                <div className="relative z-20 p-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg text-accent mb-8 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                      {service.icon}
                    </div>
                    <h3 className="font-heading font-semibold text-3xl text-white mb-4 group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-100 font-body text-sm leading-relaxed max-w-60 group-hover:text-white transition-colors duration-500">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-white  font-bold text-xs uppercase tracking-wide transition-colors duration-500">
                    Explore Solution <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

