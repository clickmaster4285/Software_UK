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

// Different color gradients for each industry
const colorMap = {
  'Manufacturing & Industrial Operations': {
    from: 'from-blue-500',
    to: 'to-cyan-500',
    iconFrom: 'from-blue-600',
    iconTo: 'to-cyan-600'
  },
  'Healthcare & MedTech': {
    from: 'from-emerald-500',
    to: 'to-teal-500',
    iconFrom: 'from-emerald-600',
    iconTo: 'to-teal-600'
  },
  'Logistics & Supply Chain': {
    from: 'from-primary',
    to: 'to-red-500',
    iconFrom: 'from-orange-600',
    iconTo: 'to-red-600'
  },
  'Fintech & Financial Services': {
    from: 'from-purple-500',
    to: 'to-pink-500',
    iconFrom: 'from-purple-600',
    iconTo: 'to-pink-600'
  },
  'Real Estate & PropTech': {
    from: 'from-primary',
    to: 'to-yellow-500',
    iconFrom: 'from-amber-600',
    iconTo: 'to-yellow-600'
  },
  'SaaS & Technology Companies': {
    from: 'from-indigo-500',
    to: 'to-violet-500',
    iconFrom: 'from-indigo-600',
    iconTo: 'to-violet-600'
  },
  // Default fallback
  'default': {
    from: 'from-slate-500',
    to: 'to-gray-500',
    iconFrom: 'from-slate-600',
    iconTo: 'to-gray-600'
  }
};

const getColors = (industryName) => {
  if (colorMap[industryName]) {
    return colorMap[industryName];
  }
  return colorMap.default;
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
      className="scroll-mt-24"
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
          className="h-10 w-1 rounded-full bg-gradient-to-b from-primary to-primary"
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
     <div className="mt-10 grid gap-6 grid-cols-1 md:grid-cols-4 lg:grid-cols-6">
  {industryUseCases.map((useCase, index) => {
    const Icon = getIcon(useCase.name);
    const colors = getColors(useCase.name);
    
    return (
      <motion.div
        key={useCase.name}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -8 }}
        className="group"
      >
        <div className="relative rounded-2xl bg-white p-6 text-left border border-slate-200 transition-all duration-300 hover:shadow-xl overflow-hidden h-full">
          {/* Square aspect ratio container */}
          <div className="flex flex-col h-full items-center">
            {/* Animated Background Gradient on Hover - Industry specific color */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-5"
              style={{
                background: `linear-gradient(to bottom right, ${colors.from.replace('from-', '')}, ${colors.to.replace('to-', '')})`
              }}
            />
            
            {/* Icon Container with Industry Specific Color - Centered */}
            <motion.div 
              className="relative mb-4"
              whileHover={{ scale: 1.05, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative inline-block">
                {/* Glow Effect - Industry specific */}
                <motion.div 
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.from} ${colors.to} blur-xl`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 0.4, scale: 1.5 }}
                  transition={{ duration: 0.4 }}
                />
                {/* Icon Background - Industry specific gradient */}
                <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${colors.iconFrom} ${colors.iconTo} shadow-lg`}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
                  <Icon className="relative h-7 w-7 text-white drop-shadow-md" />
                </div>
              </div>
            </motion.div>

            {/* Industry Name - Centered */}
            <h3 className="text-lg font-semibold text-slate-800 transition-colors duration-300 text-center">
              {useCase.name}
            </h3>

            {/* Decorative Line - Centered */}
            <motion.div 
              className={`mt-3 h-0.5 w-12 bg-gradient-to-r ${colors.from} ${colors.to} rounded-full mx-auto`}
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
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </motion.div>
    </motion.section>
  );
};