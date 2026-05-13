'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function BlogCard({ title, excerpt, category = 'Article', createdAt, readTime = '5 min', image, href }) {
   const content = (
      <Card className="group h-full overflow-hidden border-0 bg-white rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
         {/* Image Section */}
         <div className="relative aspect-video overflow-hidden bg-linear-to-br from-slate-100 to-slate-200">
            {image ? (
               <>
                  <img
                     src={image}
                     alt={title}
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
               </>
            ) : (
               <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                     <Tag className="w-8 h-8 text-primary" />
                  </div>
               </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
               <span className="bg-accent text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-lg">
                  {category}
               </span>
            </div>
         </div>

         {/* Content Section */}
         <CardContent className="p-7 flex flex-col gap-5">
            {/* Title */}
            <h3 className="text-xl font-bold text-slate-900 leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
               {title}
            </h3>

            {/* Excerpt */}
            <p className="text-slate-600 leading-relaxed line-clamp-3 text-sm">
               {excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
               <div className="flex items-center gap-4 text-xs text-slate-500">
                  {createdAt && (
                     <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                     </span>
                  )}
                  <span className="flex items-center gap-1.5">
                     <Clock className="w-3.5 h-3.5" />
                     {readTime}
                  </span>
               </div>

               <ArrowRight className="w-4 h-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
            </div>
         </CardContent>
      </Card>
   );

   return href ? (
      <Link href={href} className="block h-full" aria-label={`Read blog: ${title}`}>
         {content}
      </Link>
   ) : (
      content
   );
}
