// components/landingPage/servicesPage/IndustriesSection.tsx
"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Landmark,
  Building2,
  Factory,
  Truck,
  Cpu,
} from "lucide-react";

// Icon mapping matching your exact industry names
const iconMap = {
  'Manufacturing & Industrial Operations': Factory,
  'Healthcare & MedTech': Heart,
  'Logistics & Supply Chain': Truck,
  'Fintech & Financial Services': Landmark,
  'Real Estate & PropTech': Building2,
  'SaaS & Technology Companies': Cpu,
  'Manufacturing': Factory,
  'Healthcare': Heart,
  'Logistics': Truck,
  'Fintech': Landmark,
  'Real Estate': Building2,
  'SaaS': Cpu,
  'Technology': Cpu,
};

const getIcon = (industryName) => {
  if (iconMap[industryName]) {
    return iconMap[industryName];
  }
  return Building2;
};

export const IndustriesSection = ({ industryUseCases }) => {
  if (!industryUseCases || industryUseCases.length === 0) return null;

  return (
    <motion.section
      id="industries"
      className="mx-auto max-w-[96vw] lg:max-w-[90vw] scroll-mt-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: 40 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="h-10 w-1 rounded-full bg-accent"
        />
        <motion.h2
          className="text-2xl font-semibold text-slate-900 sm:text-3xl"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Industry-Specific Expertise
        </motion.h2>
      </div>

      <motion.p
        className="mt-4 text-lg text-slate-600 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Deep expertise across various sectors with tailored solutions
      </motion.p>

      {/* Square Card Grid - 1:1 aspect ratio */}
      <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {industryUseCases.map((useCase, index) => {
          const Icon = getIcon(useCase.name);

          return (
            <motion.div
              key={useCase.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-default"
            >
              <div className="relative rounded-2xl bg-white p-8 text-left border border-border transition-all duration-300 group-hover:border-accent/30 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden h-full">
                {/* Square aspect ratio container */}
                <div className="flex flex-col h-full items-start">
                  {/* Animated Background Gradient on Hover - Industry specific color */}
                  <motion.div
                    className="absolute inset-0 bg-accent/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  {/* Icon Container with Industry Specific Color - Centered */}
                  <motion.div
                    className="relative mb-6"
                    whileHover={{ scale: 1.05, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative inline-block">
                      {/* Glow Effect - Industry specific */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-accent blur-xl"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 0.2, scale: 1.5 }}
                        transition={{ duration: 0.4 }}
                      />
                      {/* Icon Background - Industry specific gradient */}
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                        <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Icon className="relative h-7 w-7" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Industry Name - Centered */}
                  <h3 className="text-xl font-bold text-text-primary transition-colors duration-300">
                    {useCase.name}
                  </h3>

                  {/* Decorative Line - Centered */}
                  <motion.div
                    className="mt-4 h-1 w-10 bg-accent/20 rounded-full group-hover:w-16 group-hover:bg-accent transition-all duration-300"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Divider with Animation */}
      <motion.div
        className="my-16 flex items-center gap-4"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 to-transparent" />
      </motion.div>
    </motion.section>
  );
};