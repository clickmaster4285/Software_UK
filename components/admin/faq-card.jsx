'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export function FAQCard({ question, answer, href }) {
   const preview = answer?.length > 120 ? `${answer.slice(0, 120).trim()}...` : answer;
   const cardBody = (
      <Card className="h-full overflow-hidden border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
         <CardContent className="p-6 flex flex-col gap-4">
            <div>
               <h3 className="text-base font-semibold text-slate-900">{question}</h3>
               <p className="mt-3 text-sm leading-relaxed text-slate-600">{preview}</p>
            </div>
            {href ? (
               <div className="mt-auto text-sm font-semibold text-primary">View answer</div>
            ) : null}
         </CardContent>
      </Card>
   );

   return href ? (
      <Link href={href} className="group block h-full" aria-label={`View FAQ ${question}`}>
         {cardBody}
      </Link>
   ) : (
      cardBody
   );
}
