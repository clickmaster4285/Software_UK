'use client';

import Link from 'next/link';
import { ArrowRight, Target, CheckCircle2, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export function CaseStudyCard({ title, excerpt, challenge, results, category = 'Project', thumbnail, href }) {
   const content = (
      <Card className="group h-full overflow-hidden border-0 bg-white rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
         {/* Image Section */}
         <div className="relative aspect-video overflow-hidden bg-linear-to-br from-slate-100 to-slate-200">
            {thumbnail ? (
               <>
                  <Image
                     src={thumbnail}
                     alt={title || 'Thumbnail'}
                     fill
                     className="object-cover transition-transform duration-700 group-hover:scale-110"
                     unoptimized
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Overlay Badge */}
                  <div className="absolute top-4 left-4">
                     <span className="bg-accent text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-lg">
                        {category}
                     </span>
                  </div>

                  <div className="absolute bottom-4 right-4">
                     <span className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        Case Study
                     </span>
                  </div>
               </>
            ) : (
               <div className="w-full h-full flex items-center justify-center relative">
                  <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center">
                     <TrendingUp className="w-10 h-10 text-primary" />
                  </div>

                  <div className="absolute top-4 left-4">
                     <span className="bg-accent text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-lg">
                        {category}
                     </span>
                  </div>

                  <div className="absolute bottom-4 right-4">
                     <span className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        Case Study
                     </span>
                  </div>
               </div>
            )}
         </div>

         {/* Content Section */}
         <CardContent className="p-7 flex flex-col gap-6">
            {/* Title */}
            <div>
               <h3 className="text-2xl font-bold text-slate-900 leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
                  {title}
               </h3>
               <p className="mt-3 text-slate-600 leading-relaxed line-clamp-3">
                  {excerpt}
               </p>
            </div>

            {/* Challenge & Results Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
               <div className="group/challenge rounded-xl bg-linear-to-br from-emerald-50 to-emerald-100 border border-emerald-200 p-4 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center gap-2 text-emerald-700 mb-3">
                     <Target className="w-4 h-4" />
                     <span className="text-xs font-bold uppercase tracking-[0.2em]">Challenge</span>
                  </div>
                  <p className="text-sm leading-relaxed text-emerald-800 line-clamp-3">
                     {challenge || excerpt}
                  </p>
               </div>

               <div className="group/results rounded-xl bg-linear-to-br from-amber-50 to-amber-100 border border-amber-200 p-4 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center gap-2 text-amber-700 mb-3">
                     <Award className="w-4 h-4" />
                     <span className="text-xs font-bold uppercase tracking-[0.2em]">Results</span>
                  </div>
                  <p className="text-sm leading-relaxed text-amber-800 line-clamp-3">
                     {results || excerpt}
                  </p>
               </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
               <span className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors duration-300">
                  Read Full Story
               </span>
               <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <ArrowRight className="w-4 h-4 text-primary group-hover:text-accent transition-colors duration-300 group-hover:translate-x-0.5" />
               </div>
            </div>
         </CardContent>
      </Card>
   );

   return href ? (
      <Link href={href} className="block h-full" aria-label={`Read case study: ${title}`}>
         {content}
      </Link>
   ) : (
      content
   );
}
