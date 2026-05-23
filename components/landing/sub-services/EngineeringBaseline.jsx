"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Check,
  CheckCircle2,
  FileText,
  GitBranch,
  Layers,
  Server,
  Shield,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1];

const CHECKLIST_ICONS = [
  { match: /architecture|separation|concern|design pattern|modular/i, Icon: Layers },
  { match: /test|coverage|qa|quality|unit|integration/i, Icon: CheckCircle2 },
  { match: /ci\/cd|pipeline|deploy|security scan|automated/i, Icon: GitBranch },
  { match: /documentation|api doc|technical doc|comprehensive/i, Icon: FileText },
  { match: /infrastructure|terraform|cloud|scalab|configured as code/i, Icon: Server },
  { match: /security|compliance|audit|owasp/i, Icon: Shield },
];

function getChecklistIcon(text) {
  for (const { match, Icon } of CHECKLIST_ICONS) {
    if (match.test(text)) return Icon;
  }
  return CheckCircle2;
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: EASE },
  }),
};

function BaselineCard({ item, index, showStandardBadge }) {
  const Icon = getChecklistIcon(item.item);
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-5 sm:p-6",
        "shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-300",
        "hover:-translate-y-1 hover:border-accent/25 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
      )}
    >
      <div className="absolute top-0 left-0 h-1 w-0 origin-left bg-gradient-to-r from-accent to-accent-hover transition-all duration-500 group-hover:w-full" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            "bg-accent/10 text-accent ring-1 ring-accent/15",
            "transition-colors group-hover:bg-accent group-hover:text-white group-hover:ring-accent/30"
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
        </div>
        <span className="font-heading text-sm font-bold tabular-nums text-text-muted/40 transition-colors group-hover:text-accent/30">
          {number}
        </span>
      </div>

      <h3 className="mt-4 font-heading text-base font-semibold leading-snug text-text-primary sm:text-lg">
        {item.item}
      </h3>

      {showStandardBadge && item.standard && (
        <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-surface/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-text-muted">
          <Check className="h-3 w-3 shrink-0 text-accent" strokeWidth={2.5} aria-hidden />
          {item.standard}
        </p>
      )}

      <div className="mt-auto flex items-center justify-end pt-4">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium text-accent",
            "opacity-0 translate-y-1 transition-all duration-300",
            "group-hover:opacity-100 group-hover:translate-y-0"
          )}
        >
          Verified
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </motion.article>
  );
}

export function EngineeringBaseline({ serviceName, checklist }) {
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, margin: "-80px" });

  if (!checklist?.length) return null;

  const count = checklist.length;
  const uniqueStandards = [...new Set(checklist.map((c) => c.standard).filter(Boolean))];
  const showPerCardBadge = uniqueStandards.length > 1;
  const sharedStandard = uniqueStandards.length === 1 ? uniqueStandards[0] : null;

  return (
    <section
      className="relative mx-auto max-w-400 scroll-mt-24 overflow-hidden py-4 md:py-8"
      aria-labelledby="engineering-baseline-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-primary/6 blur-[90px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(var(--text-muted) 0.5px, transparent 0.5px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-accent">
              Engineering standards
            </p>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-10 w-1 shrink-0 rounded-full bg-accent" />
              <h2
                id="engineering-baseline-heading"
                className="font-heading text-2xl font-semibold leading-snug text-text-primary sm:text-3xl"
              >
                <span className="text-accent">{serviceName}</span> Engineering
                Baseline
              </h2>
            </div>
          </div>
          <p className="shrink-0 text-sm font-medium tabular-nums text-text-muted sm:pt-10">
            {String(count).padStart(2, "0")} standards
          </p>
        </div>

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-text-body">
          Every {serviceName.toLowerCase()} engagement ships with non-negotiable
          engineering discipline — architecture, testing, automation, and
          documentation baked in from day one.
        </p>

        {sharedStandard && (
          <motion.div
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/5 px-4 py-2 text-sm font-medium text-text-primary"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            <span>
              All {count} items meet:{" "}
              <span className="font-semibold text-accent">{sharedStandard}</span>
            </span>
          </motion.div>
        )}

        <motion.div
          ref={gridRef}
          className={cn(
            "mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5",
            count >= 5 ? "lg:grid-cols-3 xl:grid-cols-5" : "lg:grid-cols-3"
          )}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {checklist.map((item, index) => (
            <BaselineCard
              key={`${item.item}-${index}`}
              item={item}
              index={index}
              showStandardBadge={showPerCardBadge}
            />
          ))}
        </motion.div>
      </div>

      <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent md:mt-16" />
    </section>
  );
}
