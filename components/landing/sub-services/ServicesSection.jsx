"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart3,
  Bot,
  Building2,
  Cloud,
  Code2,
  Database,
  Globe,
  Layers,
  Plug,
  RefreshCw,
  Rocket,
  Shield,
  Smartphone,
  Users,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICE_ICONS = [
  { match: /mobile|ios|android|flutter/i, Icon: Smartphone },
  { match: /cloud|devops|kubernetes|docker/i, Icon: Cloud },
  { match: /api|integration|middleware/i, Icon: Plug },
  { match: /database|data architecture|warehouse|bi|reporting|intelligence/i, Icon: Database },
  { match: /mvp|startup|product development/i, Icon: Rocket },
  { match: /saas|multi-tenant|platform/i, Icon: Layers },
  { match: /erp|enterprise software/i, Icon: Building2 },
  { match: /crm|sales/i, Icon: Users },
  { match: /compliance|audit|security/i, Icon: Shield },
  { match: /ai|agent|automation|llm/i, Icon: Bot },
  { match: /web application|website|portal/i, Icon: Globe },
  { match: /legacy|modernization|migrate/i, Icon: RefreshCw },
  { match: /workflow|process automation/i, Icon: Workflow },
  { match: /analytics|dashboard/i, Icon: BarChart3 },
];

function getServiceIcon(title) {
  for (const { match, Icon } of SERVICE_ICONS) {
    if (match.test(title)) return Icon;
  }
  return Code2;
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const ServicesSection = ({ serviceName, servicesCards }) => {
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, margin: "-80px" });

  if (!servicesCards?.length) return null;

  const count = servicesCards.length;

  return (
    <section id="our-services" className="scroll-mt-24 pt-4 md:pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-accent">
            What we deliver
          </p>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-10 w-1 shrink-0 rounded-full bg-accent" />
            <h2 className="font-heading text-2xl font-semibold leading-snug text-text-primary sm:text-3xl">
              <span className="text-accent">{serviceName}</span> Services We
              Deliver
            </h2>
          </div>
        </div>
        <p className="shrink-0 text-sm font-medium tabular-nums text-text-muted sm:pt-10">
          {String(count).padStart(2, "0")} capabilities
        </p>
      </div>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-text-body">
        ClickMasters operates as a full-stack{" "}
        <span className="font-semibold text-text-primary">
          {serviceName.toLowerCase()}
        </span>{" "}
        partner — product strategy, UI/UX, engineering, cloud infrastructure,
        QA, and ongoing support in one delivery model.
      </p>

      <motion.div
        ref={gridRef}
        className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {servicesCards.map((service, index) => {
          const Icon = getServiceIcon(service.title);
          const number = String(index + 1).padStart(2, "0");

          return (
            <motion.article
              key={service.title}
              custom={index}
              variants={cardVariants}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white p-6 sm:p-7",
                "shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-300",
                "hover:-translate-y-1 hover:border-accent/25 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
              )}
            >
              <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-accent to-accent-hover transition-all duration-500 group-hover:w-full" />

              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/15 transition-colors group-hover:bg-accent group-hover:text-white group-hover:ring-accent/30">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <span className="font-heading text-sm font-bold tabular-nums text-text-muted/40 group-hover:text-accent/30 transition-colors">
                  {number}
                </span>
              </div>

              <h3 className="mt-5 font-heading text-xl font-semibold leading-snug tracking-tight text-text-primary sm:text-[1.35rem]">
                {service.title}
              </h3>

              <div className="my-5 h-px bg-border transition-colors group-hover:bg-accent/15" />

              <p className="flex-1 text-[16px] leading-relaxed text-text-body">
                {service.description}
              </p>
            </motion.article>
          );
        })}
      </motion.div>

      <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent md:mt-16" />
    </section>
  );
};
