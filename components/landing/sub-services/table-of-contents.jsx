"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";


export function TableOfContents({ items, title = "On this page" }) {
  const [activeId, setActiveId] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Get all currently visible entries
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top); // Topmost first

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-100px 0px -35% 0px",
        threshold: [0.1, 0.3, 0.5, 0.7],
      }
    );

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 110;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveId(id);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-border">
          <List className="h-4 w-4 text-accent" />
        </div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
      </div>

      {/* Navigation */}
      <nav className="relative">
        <div className="space-y-1">
          {items.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={cn(
                  "group relative flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                  item.level === 2 ? "" : "pl-6",
                  isActive
                    ? "bg-surface font-semibold text-accent border-l-2 border-accent"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent" />
                )}

                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-medium transition-colors",
                    isActive
                      ? "bg-accent/15 text-accent font-semibold"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  )}
                >
                  {index + 1}
                </span>
                <span className="truncate">{item.title}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Quick action */}
      <div className="mt-6 rounded-xl bg-gradient-to-br from-surface to-surface-2 p-4 border border-border">
        <p className="text-xs font-medium text-slate-500">Need help?</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">
          Talk to an expert
        </p>
        <Link
          href="/contact-us"
          className="mt-2 inline-flex items-center text-sm font-semibold text-accent hover:text-accent-hover"
        >
          Book a call
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}