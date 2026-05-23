"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Award,
  Building2,
  Check,
  Clock,
  Coins,
  Gauge,
  Layers,
  Lock,
  Rocket,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1];

const TRUST_STATS = [
  { value: "500+", label: "Companies served" },
  { value: "4.9/5", label: "Client rating" },
  { value: "15+", label: "Years in delivery" },
];

const FEATURE_ICONS = [
  { match: /security|compliance|audit|gdpr|hipaa|owasp/i, Icon: Shield },
  { match: /cost|tco|investment|price|billing/i, Icon: Coins },
  { match: /time|speed|implementation|ramp|hire|mvp|weeks|months/i, Icon: Clock },
  { match: /team|dedicated|engineer|hire/i, Icon: Users },
  { match: /architecture|customization|scale|scalab/i, Icon: Layers },
  { match: /integration|api|workflow/i, Icon: Workflow },
  { match: /data|ownership|ip/i, Icon: Lock },
  { match: /kpi|roi|business|innovation|roadmap/i, Icon: TrendingUp },
  { match: /transparent|process|support|maintenance/i, Icon: Target },
  { match: /industry|enterprise|b2b/i, Icon: Building2 },
  { match: /timezone|global/i, Icon: Gauge },
  { match: /ownership|cycle/i, Icon: Rocket },
];

function getFeatureIcon(feature) {
  for (const { match, Icon } of FEATURE_ICONS) {
    if (match.test(feature)) return Icon;
  }
  return Sparkles;
}

function parseDescription(description) {
  const parts = description.split("|").map((s) => s.trim());
  return parts.length > 1 ? parts : null;
}

function getPageMode(slug) {
  if (slug.includes("enterprise")) return "enterprise";
  if (slug.includes("saas")) return "saas";
  return "standard";
}

function getAudienceLabel(mode, slug) {
  if (mode === "enterprise") return "Enterprise Organizations";
  if (mode === "saas") return "SaaS Founders";
  if (slug.includes("mvp")) return "Founders";
  return "Companies";
}

function getComparisonColumns(mode) {
  if (mode === "enterprise") {
    return [
      { key: "clickmasters", label: "ClickMasters", highlight: true },
      { key: "sap", label: "SAP / Oracle", highlight: false },
      { key: "generic", label: "Generic SaaS", highlight: false },
    ];
  }
  if (mode === "saas") {
    return [
      { key: "inhouse", label: "In-House Team", highlight: false },
      { key: "clickmasters", label: "ClickMasters", highlight: true },
    ];
  }
  return [];
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: EASE },
  }),
};

function ComparisonCell({ text, highlight, label }) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-2 rounded-xl border p-4 sm:p-5 transition-colors",
        highlight
          ? "border-accent/30 bg-accent/5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
          : "border-border bg-surface/60"
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
            highlight ? "bg-accent text-white" : "bg-border text-text-muted"
          )}
          aria-hidden
        >
          {highlight ? (
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          ) : (
            <X className="h-3 w-3" strokeWidth={2.5} />
          )}
        </span>
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-[0.08em]",
            highlight ? "text-accent" : "text-text-muted"
          )}
        >
          {label}
        </span>
        {highlight && (
          <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-semibold text-accent">
            Recommended
          </span>
        )}
      </div>
      <p
        className={cn(
          "text-sm leading-relaxed",
          highlight ? "font-medium text-text-primary" : "text-text-body"
        )}
      >
        {text}
      </p>
    </div>
  );
}

function ComparisonRow({ feature, parts, columns, index }) {
  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
    >
      <div className="border-b border-border bg-surface/50 px-5 py-4 sm:px-6">
        <h3 className="font-heading text-base font-semibold text-text-primary sm:text-lg">
          {feature}
        </h3>
      </div>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:gap-4 sm:p-5">
        {parts.map((part, i) => (
          <ComparisonCell
            key={columns[i]?.key ?? i}
            text={part}
            label={columns[i]?.label ?? `Option ${i + 1}`}
            highlight={columns[i]?.highlight ?? false}
          />
        ))}
      </div>
    </motion.article>
  );
}

function BenefitCard({ feature, description, index }) {
  const Icon = getFeatureIcon(feature);
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-6 sm:p-7",
        "shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-300",
        "hover:-translate-y-1 hover:border-accent/25 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
      )}
    >
      <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-accent to-accent-hover transition-all duration-500 group-hover:w-full" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/15 transition-colors group-hover:bg-accent group-hover:text-white group-hover:ring-accent/30">
          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
        </div>
        <span className="font-heading text-sm font-bold tabular-nums text-text-muted/40 transition-colors group-hover:text-accent/30">
          {number}
        </span>
      </div>

      <h3 className="mt-5 font-heading text-lg font-semibold leading-snug text-text-primary transition-colors group-hover:text-primary sm:text-xl">
        {feature}
      </h3>

      <div className="my-4 h-px bg-border transition-colors group-hover:bg-accent/15" />

      <p className="flex-1 text-[15px] leading-relaxed text-text-body">
        {description}
      </p>
    </motion.article>
  );
}

export function WhyChooseUs({ slug, differentiators }) {
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, margin: "-80px" });

  if (!differentiators?.length) return null;

  const mode = getPageMode(slug);
  const isComparison = mode === "enterprise" || mode === "saas";
  const columns = getComparisonColumns(mode);
  const audience = getAudienceLabel(mode, slug);
  const count = differentiators.length;

  const comparisonRows = isComparison
    ? differentiators
        .map((diff) => ({
          ...diff,
          parts: parseDescription(diff.description),
        }))
        .filter((diff) => diff.parts)
    : [];

  const standardItems = !isComparison ? differentiators : [];

  return (
    <section
      id="why-choose-us"
      className="relative mx-auto max-w-400 scroll-mt-24 overflow-hidden py-4 md:py-8"
      aria-labelledby="why-choose-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/8 blur-[90px]" />
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
              Why choose us
            </p>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-10 w-1 shrink-0 rounded-full bg-accent" />
              <h2
                id="why-choose-heading"
                className="font-heading text-2xl font-semibold leading-snug text-text-primary sm:text-3xl"
              >
                Why <span className="text-accent">{audience}</span> Choose
                ClickMasters
              </h2>
            </div>
          </div>
          <p className="shrink-0 text-sm font-medium tabular-nums text-text-muted sm:pt-10">
            {String(count).padStart(2, "0")}{" "}
            {isComparison ? "comparisons" : "advantages"}
          </p>
        </div>

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-text-body">
          {isComparison ? (
            <>
              See how ClickMasters stacks up against{" "}
              {mode === "enterprise"
                ? "legacy ERP vendors and off-the-shelf SaaS"
                : "building an in-house engineering team"}
              — on the criteria that actually drive delivery outcomes.
            </>
          ) : (
            <>
              We combine architecture discipline, transparent delivery, and
              long-term partnership — so your investment translates into
              measurable business results, not just shipped code.
            </>
          )}
        </p>

        {isComparison && columns.length > 0 && (
          <motion.div
            className="mt-8 flex flex-wrap gap-2 sm:gap-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {columns.map((col) => (
              <span
                key={col.key}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
                  col.highlight
                    ? "border-accent/35 bg-accent/10 text-accent"
                    : "border-border bg-white text-text-muted"
                )}
              >
                {col.highlight && (
                  <Award className="h-3.5 w-3.5 shrink-0" aria-hidden />
                )}
                {col.label}
              </span>
            ))}
          </motion.div>
        )}

        <motion.div
          ref={gridRef}
          className={cn(
            "mt-10",
            isComparison
              ? "flex flex-col gap-5"
              : "grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          )}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {isComparison
            ? comparisonRows.map((row, index) => (
                <ComparisonRow
                  key={row.feature}
                  feature={row.feature}
                  parts={row.parts}
                  columns={columns}
                  index={index}
                />
              ))
            : standardItems.map((diff, index) => (
                <BenefitCard
                  key={diff.feature}
                  feature={diff.feature}
                  description={diff.description}
                  index={index}
                />
              ))}
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-white px-6 py-8 sm:grid-cols-3 sm:px-8 md:mt-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 sm:flex-col sm:text-center sm:gap-1">
              <Zap
                className="h-4 w-4 shrink-0 text-accent sm:mx-auto"
                aria-hidden
              />
              <div>
                <p className="font-heading text-xl font-bold text-primary sm:text-2xl">
                  {stat.value}
                </p>
                <p className="text-sm text-text-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent md:mt-16" />
    </section>
  );
}
