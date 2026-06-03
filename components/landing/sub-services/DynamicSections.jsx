"use client";

import { Check } from "lucide-react";
import { makeBoldServiceName, getSectionId } from "@/lib/subservice-utils";
import { slugify } from "@/data/sub-services";
import { cn } from "@/lib/utils";

function isQuoteItem(text) {
  const trimmed = String(text).trim();
  return (
    trimmed.startsWith('"') ||
    trimmed.startsWith("'") ||
    trimmed.startsWith("\u201c")
  );
}

export default function DynamicSections({ sections, serviceName }) {
  if (!sections?.length) return null;

  return (
    <div className="relative mx-auto max-w-[96vw] lg:max-w-[90vw]  -mx-4 overflow-hidden px-4 py-10 sm:rounded-2xl md:py-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, oklch(0.88 0.01 250 / 0.45) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-accent/10 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 -left-16 h-56 w-56 rounded-full bg-primary/8 blur-[90px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/3 h-48 w-48 rounded-full bg-primary-mid/6 blur-[80px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/[0.06] to-transparent"
        aria-hidden
      />

      <div className="relative space-y-14 md:space-y-16">
        {sections.map((section, index) => {
          const items = (section.items || []).filter(Boolean);
          const hasBody = Boolean(section.body?.trim());
          const isLast = index === sections.length - 1;

          return (
            <section
              key={`${section.heading}-${index}`}
              id={getSectionId(section.heading, index, slugify)}
              className="scroll-mt-24"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 h-10 w-1 shrink-0 rounded-full bg-accent" />
                <h2
                  className="font-heading text-2xl font-semibold leading-snug text-slate-900 sm:text-3xl [&_strong]:text-accent"
                  dangerouslySetInnerHTML={{
                    __html: makeBoldServiceName(section.heading, serviceName),
                  }}
                />
              </div>

              {hasBody && (
                <div className="mt-6 max-w-4xl pl-4 md:pl-7">
                  {section.body.split("\n\n").map((paragraph, pIdx) => (
                    <p
                      key={pIdx}
                      className={cn(
                        "text-lg leading-relaxed text-slate-600 whitespace-pre-line [&_strong]:font-semibold [&_strong]:text-slate-900",
                        pIdx > 0 && "mt-4"
                      )}
                      dangerouslySetInnerHTML={{
                        __html: makeBoldServiceName(paragraph, serviceName),
                      }}
                    />
                  ))}
                </div>
              )}

              {items.length > 0 && (
                <ul
                  className={cn(
                    "mt-8 max-w-4xl space-y-3",
                    hasBody ? "pl-4 md:pl-7" : "pl-4 md:pl-7"
                  )}
                >
                  {items.map((item, i) => {
                    const isQuote = isQuoteItem(item);
                    return (
                      <li
                        key={i}
                        className={cn(
                          "flex gap-3",
                          isQuote &&
                          "border-l-2 border-accent/30 py-0.5 pl-4 ml-0 md:ml-0"
                        )}
                      >
                        {!isQuote && (
                          <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                        )}
                        <span
                          className={cn(
                            "text-base leading-relaxed text-slate-600 [&_strong]:font-semibold [&_strong]:text-slate-900",
                            isQuote && "italic text-slate-700"
                          )}
                          dangerouslySetInnerHTML={{
                            __html: makeBoldServiceName(item, serviceName),
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}

              {!isLast && (
                <div
                  className="mt-12 h-px w-full bg-border/80 md:mt-14"
                  aria-hidden
                />
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
