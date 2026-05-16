'use client';

import Link from 'next/link';
import { Star, Quote, Building2, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export function TestimonialCard({ authorName, authorRole, authorCompany, content, avatarUrl, rating = 5, href }) {
   const authorLabel = [authorRole, authorCompany].filter(Boolean).join(' • ');
   const initials = authorName?.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

   const cardBody = (
      <Card className="group h-full overflow-hidden border-0 bg-white rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative">
         {/* Quote Icon */}
         <div className="absolute top-6 right-6 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Quote className="w-5 h-5 text-primary" />
         </div>

         <CardContent className="p-7 flex flex-col gap-6">
            {/* Rating */}
            <div className="flex items-center gap-1">
               {Array.from({ length: 5 }, (_, index) => (
                  <Star
                     key={index}
                     className={`w-4 h-4 transition-all duration-200 ${index < rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                        }`}
                  />
               ))}
            </div>

            {/* Content */}
            <blockquote className="text-slate-700 text-lg leading-relaxed font-medium line-clamp-4 relative">
               &quot;{content}&quot;
            </blockquote>

            {/* Author Section */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
               {/* Avatar */}
               <div className="relative">
                  {avatarUrl ? (
                     <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm">
                        <Image
                           src={avatarUrl}
                           alt={authorName || 'Avatar'}
                           fill
                           className="object-cover"
                           unoptimized
                        />
                     </div>
                  ) : (
                     <div className="w-14 h-14 rounded-full bg-linear-to-br from-primary to-primary-mid flex items-center justify-center text-accent font-bold text-lg shadow-md">
                        {initials}
                     </div>
                  )}

                  {/* Status Indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
               </div>

               {/* Author Info */}
               <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg">{authorName}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                     {authorRole && (
                        <span className="flex items-center gap-1">
                           <Briefcase className="w-3 h-3" />
                           {authorRole}
                        </span>
                     )}
                     {authorCompany && (
                        <span className="flex items-center gap-1">
                           <Building2 className="w-3 h-3" />
                           {authorCompany}
                        </span>
                     )}
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>
   );

   return href ? (
      <Link href={href} className="block h-full" aria-label={`Read testimonial by ${authorName}`}>
         {cardBody}
      </Link>
   ) : (
      cardBody
   );
}
