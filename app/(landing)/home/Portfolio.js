"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const industries = [
   {
      title: "Manufacturing",
      stat: "40%",
      statLabel: "Efficiency Increase",
      description: "Custom ERP, MES, production planning, and inventory software. We build manufacturing software that integrates with your shop floor and supply chain.",
      items: ["ERP & MRP", "Production Planning", "Quality Control", "Inventory Systems"],
   },
   {
      title: "Retail & eCommerce",
      stat: "3.5x",
      statLabel: "Sales Growth",
      description: "E-commerce platforms, POS systems, and omnichannel retail software. Custom web and mobile apps for online stores and in-store operations.",
      items: ["E-commerce Apps", "POS Software", "Inventory Sync", "Customer Portals"],
   },
   {
      title: "Professional Services",
      stat: "60%",
      statLabel: "Time Saved",
      description: "Project management, time tracking, billing, and client portal software. Custom software for consultancies, agencies, and service firms.",
      items: ["Project Management", "Time & Billing", "Client Portals", "Reporting"],
   },
   {
      title: "Healthcare",
      stat: "99.9%",
      statLabel: "Uptime",
      description: "Patient management, scheduling, EHR integrations, and compliant healthcare software. Secure, HIPAA-aware applications for clinics and hospitals.",
      items: ["Patient Management", "Scheduling", "EHR Integration", "Telehealth"],
   },
   {
      title: "Education",
      stat: "50k+",
      statLabel: "Students Served",
      description: "Learning management systems, student portals, and education software. Custom web and mobile apps for schools, universities, and ed-tech.",
      items: ["LMS", "Student Portals", "Course Management", "Attendance"],
   },
   {
      title: "Real Estate",
      stat: "25k+",
      statLabel: "Properties Managed",
      description: "Property management, listing platforms, and real estate software. Custom solutions for agents, developers, and property managers.",
      items: ["Property Management", "Listing Platforms", "Lease Management", "Tenant Portals"],
   },
];

export default function Portfolio() {
   return (
      <section className="relative py-32 overflow-hidden bg-primary">
         {/* Fixed Background Image */}
         <div 
            className="absolute inset-0 z-0 opacity-40 bg-fixed bg-cover bg-center"
            style={{ backgroundImage: "url(\"/landing/purple-background-with-wavy-shapes.png\")" }}
         />
         
         <div className="relative z-10 max-w-400 mx-auto px-6">
            <div className="text-center mb-16">
               <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-accent font-bold uppercase tracking-tight text-4xl md:text-6xl lg:text-9xl xl:text-9xl leading-none"
               >
                  Industry Expertise
               </motion.span>
               <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                  className="font-heading font-bold text-3xl md:text-5xl text-white mt-4 mb-4 tracking-tight"
               >
                  Driving Excellence Across Sectors
               </motion.h2>
               <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-gray-200 font-body max-w-2xl mx-auto"
               >
                  Deep technical expertise meets sector-specific knowledge to deliver high-impact software solutions.
               </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {industries.map((industry, index) => (
                  <motion.div 
                     key={index}
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ delay: index * 0.1 }}
                     viewport={{ once: true }}
                     className="p-8 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/10 hover:bg-white/15 transition-all duration-300 group"
                  >
                     <div className="flex items-baseline gap-2 mb-4">
                        <span className="font-heading font-black text-4xl text-accent group-hover:scale-110 transition-transform inline-block">
                           {industry.stat}
                        </span>
                        <span className="text-gray-200 font-bold text-xs uppercase tracking-widest">
                           {industry.statLabel}
                        </span>
                     </div>
                     <h3 className="font-heading font-bold text-2xl text-white mb-4">
                        {industry.title}
                     </h3>
                     <p className="text-gray-100 font-body text-sm mb-8 leading-relaxed">
                        {industry.description}
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {industry.items.map((item) => (
                           <span
                              key={item}
                              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-body text-[10px] font-bold text-gray-200 uppercase tracking-wider"
                           >
                              {item}
                           </span>
                        ))}
                     </div>
                  </motion.div>
               ))}
            </div>

            <div className="text-center mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link
                  href="/projects"
                  className="w-full sm:w-auto px-10 py-4 bg-accent text-white font-body font-bold rounded-xl hover:bg-accent-hover transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
               >
                  View Project Gallery <ArrowRight className="w-5 h-5" />
               </Link>
               <Link
                  href="/case-studies"
                  className="w-full sm:w-auto px-10 py-4 bg-transparent text-white border-2 border-white font-body font-bold rounded-xl hover:bg-white/10 transition-all text-center"
               >
                  Read Success Stories
               </Link>
            </div>
         </div>
      </section>
   );
}

