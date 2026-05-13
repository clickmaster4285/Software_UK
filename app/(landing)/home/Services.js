'use client';

import Link from "next/link";
import { useCategoryList } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

const mainServices = [
   {
      title: "Agile Software Development",
      description: "Sprint-based delivery with full transparency. Our software developers ship faster, iterate smarter, and keep you in control at every milestone.",
   },
   {
      title: "Scalable & Future-Proof Architecture",
      description: "We engineer software solutions on proven stacks � React, Node.js, and cloud-native infrastructure � built to scale without costly rewrites.",
   },
   {
      title: "Enterprise Security & Compliance",
      description: "Every product from our software house follows OWASP standards, GDPR best practices, and rigorous QA � so your business and users stay protected.",
   },
   {
      title: "24/7 Dedicated Support",
      description: "Our software development company stays with you post-launch � monitoring performance, deploying updates, and resolving issues around the clock.",
   },
];

export default function Services() {
   const { data: categories, isLoading } = useCategoryList();
   const homeCategories = categories?.filter(c => c.showOnHome && !c.deleted) || [];

   return (
      <section className="py-24 bg-surface">
         <div className="max-w-400 mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary mb-4 tracking-tight">
                  Ready to accelerate your business?
               </h2>
               <p className="text-text-body font-body max-w-2xl mx-auto">
                  Partner with a software house that prioritizes your ROI through technical excellence and strategic engineering.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
               {mainServices.map((service, index) => (
                  <div key={index} className="p-10 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                     <h3 className="font-heading font-bold text-2xl text-primary mb-4 tracking-tight">
                        {service.title}
                     </h3>
                     <p className="text-text-body font-body leading-relaxed">{service.description}</p>
                  </div>
               ))}
            </div>

            <div className="text-center mb-12">
               <span className="text-accent font-bold uppercase tracking-widest text-sm">Specialized Expertise</span>
               <h3 className="font-heading font-bold text-3xl text-primary mt-4 mb-4">
                  Comprehensive Software Solutions
               </h3>
               <p className="text-text-body font-body max-w-2xl mx-auto">
                  From custom web apps to complex cloud infrastructure, we deliver the technical edge your business needs to scale.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
               {isLoading ? (
                  [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)
               ) : (
                  homeCategories.map((cat) => (
                     <Link
                        key={cat._id}
                        href={`/solutions/${cat.slug || cat._id}`}
                        className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-primary hover:shadow-xl transition-all group relative flex flex-col justify-between"
                     >
                        <div>
                           <h4 className="font-heading font-bold text-lg text-primary mb-3 group-hover:text-accent transition-colors">
                              {cat.name}
                           </h4>
                           <p className="text-text-muted font-body text-sm leading-relaxed">
                              {cat.description || "Expert software development and strategic consulting."}
                           </p>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                           Explore Solution <ArrowRight className="w-4 h-4" />
                        </div>
                     </Link>
                  ))
               )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
               <Link
                  href="/contact"
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-body font-bold rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 text-center"
               >
                  Get Free Consultation
               </Link>
               <Link
                  href="/solutions"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-primary border-2 border-primary font-body font-bold rounded-xl hover:bg-slate-50 transition-all text-center"
               >
                  View All Solutions
               </Link>
            </div>
         </div>
      </section>
   );
}
