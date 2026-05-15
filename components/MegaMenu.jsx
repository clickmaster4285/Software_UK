'use client';

import { useState, useRef, useEffect } from 'react';
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
   const timeoutRef = useRef(null);

   // Set first category as default when categories change or menu becomes visible
   useEffect(() => {
      if (categories && categories.length > 0 && !hoveredCategory) {
         setHoveredCategory(categories[0]);
      }
   }, [categories]);

   const handleMouseEnter = () => {
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
         timeoutRef.current = null;
      }
      setIsVisible(true);
      // Ensure the first category is selected by default if nothing is hovered
      if (categories && categories.length > 0 && !hoveredCategory) {
         setHoveredCategory(categories[0]);
      }
      // Small delay for the transition to trigger correctly
      setTimeout(() => setIsOpen(true), 10);
   };

   const handleMouseLeave = () => {
      setIsOpen(false);
      timeoutRef.current = setTimeout(() => {
         setIsVisible(false);
         // Reset to first category on close so it's fresh for next open
         if (categories && categories.length > 0) {
            setHoveredCategory(categories[0]);
         }
      }, 300); // Match transition duration
   };

   // Clean up timeout on unmount
   useEffect(() => {
      return () => {
         if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
   }, []);

   return (
      <div
         className="relative"
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
      >
         {trigger}

         {isVisible && (
            <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-6xl pt-4 z-50 transition-all duration-300 ease-out ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2'
               }`} onWheel={(e) => e.stopPropagation()}>
               <div className="bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden max-h-[40vh]">
                  <div className="flex h-full min-h-75 max-h-[40vh]">
                     {/* Categories Column */}
                     <div className="w-80 bg-slate-50 border-r border-slate-200 p-6 flex flex-col max-h-[40vh]">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">
                           {categories?.some(category => category.viewAllHref) ? 'Resources' : 'Our Services'}
                        </h3>
                        <div className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                           {categories.map((category, index) => {
                              const isActive = hoveredCategory?.label === category.label;
                              return (
                                 <div
                                    key={index}
                                    className="group cursor-pointer"
                                    onMouseEnter={() => setHoveredCategory(category)}
                                 >
                                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${isActive
                                          ? 'bg-black text-white shadow-md'
                                          : 'hover:bg-black hover:text-white text-slate-700'
                                       }`}>
                                       <span className="text-sm font-medium">
                                          {category.label}
                                       </span>
                                       <ChevronRight className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                                          }`} />
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>

                     {/* Content Column */}
                     <div className="flex-1 p-6 overflow-y-auto max-h-[40vh] custom-scrollbar">
                        {hoveredCategory ? (
                           <div>
                              <div className="flex items-center justify-between mb-6">
                                 <h3 className="text-xl font-bold text-slate-900">
                                    {hoveredCategory.label}
                                 </h3>
                                 <Link
                                    href={hoveredCategory.viewAllHref || `/services/${hoveredCategory.label.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="text-sm font-medium text-primary hover:text-accent-hover transition-colors flex items-center gap-1"
                                 >
                                    View All <ChevronRight className="w-4 h-4" />
                                 </Link>
                              </div>
                              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                                          className="group block h-full rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20"
                                       >
                                          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-primary mb-2 transition-colors">
                                             {item.title}
                                         </h4>
                                          <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
                                             {item.description}
                                          </p>
                                       </Link>
                                    );
                                 })}
                              </div>
                           </div>
                        ) : (
                           <div className="flex items-center justify-center h-full text-center py-20">
                              <div className="max-w-sm">
                                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ChevronRight className="w-8 h-8 text-slate-300" />
                                 </div>
                                 <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    {categories?.some(category => category.viewAllHref) ? 'Explore Our Resources' : 'Explore Our Services'}
                                 </h3>
                                 <p className="text-sm text-slate-600">
                                    {categories?.some(category => category.viewAllHref)
                                       ? 'Select a category from the left to browse our latest insights, case studies, and guides.'
                                       : 'Select a service category to discover how we can help your business grow with tailored solutions.'
                                    }
                                 </p>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}