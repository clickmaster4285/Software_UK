'use client';

import { slugify } from '@/data/sub-services';

export default function IndustrySections({ sections, serviceName }) {
  if (!sections?.length) return null;

  return (
    <div className="relative mx-auto max-w-[96vw] lg:max-w-[90vw] py-16 md:py-20">
      <div className="space-y-16 md:space-y-20">
        {sections.map((section, index) => {
          const paragraphs = section.paragraphs || [];
          const isLast = index === sections.length - 1;
          const sectionId = slugify(section.heading);

          return (
            <section
              key={`${sectionId}-${index}`}
              id={sectionId}
              className="scroll-mt-24"
            >
              {/* Section heading */}
              <div className="flex items-start gap-3">
                <div className="mt-1.5 h-10 w-1 shrink-0 rounded-full bg-accent" />
                <h2 className="font-heading text-2xl font-semibold leading-snug text-slate-900 sm:text-3xl">
                  {section.heading}
                </h2>
              </div>

              {/* Paragraphs — bold-led editorial style */}
              <div className="mt-6 max-w-4xl space-y-4 pl-4 md:pl-7">
                {paragraphs.map((para, pIdx) => {
                  const hasBold = para.bold && para.bold.trim();
                  const hasText = para.text && para.text.trim();

                  if (!hasBold && !hasText) return null;

                  return (
                    <div key={pIdx}>
                      {hasBold && (
                        <p className="text-lg font-semibold leading-snug text-slate-900">
                          {para.bold}
                        </p>
                      )}
                      {hasText && (
                        <p className={`text-base leading-relaxed text-slate-600 ${hasBold ? 'mt-1.5' : ''}`}>
                          {para.text}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {!isLast && (
                <div className="mt-14 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent" aria-hidden />
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
