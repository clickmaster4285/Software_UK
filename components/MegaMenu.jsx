'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BlogCard } from '@/components/admin/blog-card';
import { CaseStudyCard } from '@/components/admin/case-study-card';
import { TestimonialCard } from '@/components/admin/testimonial-card';
import { FAQCard } from '@/components/admin/faq-card';

export default function MegaMenu({ categories, trigger }) {
   const [hoveredCategory, setHoveredCategory] = useState(null);
   const [isOpen, setIsOpen] = useState(false);
   const [isVisible, setIsVisible] = useState(false);

   const handleMouseEnter = () => {
      setIsOpen(true);
      setIsVisible(true);
   };

   const handleMouseLeave = () => {
      setIsOpen(false);
      setTimeout(() => {
         setIsVisible(false);
         setHoveredCategory(null);
      }, 300); // Match transition duration
   };

   return (
      <div
         className="relative"
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
      >
         {trigger}

         {isVisible && (
            <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-6xl bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden max-h-150 transition-all duration-300 ease-out ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2'
               }`} onWheel={(e) => e.stopPropagation()}>
               <div className="flex h-full">
                  {/* Categories Column */}
                  <div className="w-80 bg-slate-50 border-r border-slate-200 p-6">
                     <h3 className="text-lg font-bold text-slate-900 mb-4">
                        {categories?.some(category => category.viewAllHref) ? 'Resources' : 'Our Services'}
                     </h3>
                     <div className="space-y-1 max-h-96 overflow-y-auto">
                        {categories.map((category, index) => (
                           <div
                              key={index}
                              className="group cursor-pointer"
                              onMouseEnter={() => setHoveredCategory(category)}
                           >
                              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-primary hover:text-white hover:shadow-sm shadow-accent transition-all duration-200">
                                 <span className="text-sm font-medium text-slate-700 group-hover:text-primary">
                                    {category.label}
                                 </span>
                                 <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 p-6">
                     {hoveredCategory ? (
                        <div>
                           <h3 className="text-lg font-bold text-slate-900 mb-4">
                              {hoveredCategory.label}
                           </h3>
                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-h-96 overflow-y-auto">
                              {hoveredCategory.items.map((item, index) => {
                                 const key = `${item.type || 'item'}-${index}`;
                                 if (item.type === 'blog') {
                                    return (
                                       <div key={key} className="h-full">
                                          <BlogCard {...item} />
                                       </div>
                                    );
                                 }
                                 if (item.type === 'case-study') {
                                    return (
                                       <div key={key} className="h-full">
                                          <CaseStudyCard {...item} />
                                       </div>
                                    );
                                 }
                                 if (item.type === 'testimonial') {
                                    return (
                                       <div key={key} className="h-full">
                                          <TestimonialCard {...item} />
                                       </div>
                                    );
                                 }
                                 if (item.type === 'faq') {
                                    return (
                                       <div key={key} className="h-full">
                                          <FAQCard {...item} />
                                       </div>
                                    );
                                 }

                                 return (
                                    <Link
                                       key={key}
                                       href={item.href || `/services/${item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                                       className="group block h-full rounded-3xl border border-slate-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >
                                       <h4 className="text-sm font-semibold text-slate-900 group-hover:text-primary mb-2">
                                          {item.title}
                                       </h4>
                                       <p className="text-xs leading-relaxed text-slate-600">
                                          {item.description}
                                       </p>
                                    </Link>
                                 );
                              })}
                           </div>
                           <Link
                              href={hoveredCategory.viewAllHref || `/services/${hoveredCategory.label.toLowerCase().replace(/\s+/g, '-')}`}
                              className="mt-4 inline-block text-sm font-medium text-primary hover:text-accent-hover transition-colors"
                           >
                              View All {hoveredCategory.label}
                           </Link>
                        </div>
                     ) : (
                        <div className="flex items-center justify-center h-full text-center">
                           <div>
                              <h3 className="text-lg font-bold text-slate-900 mb-2">
                                 {categories?.some(category => category.viewAllHref) ? 'Explore Our Resources' : 'Explore Our Services'}
                              </h3>
                              <p className="text-sm text-slate-600">
                                 {categories?.some(category => category.viewAllHref)
                                    ? 'Hover over a category on the left to see available resources'
                                    : 'Hover over a category on the left to see available services'
                                 }
                              </p>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}