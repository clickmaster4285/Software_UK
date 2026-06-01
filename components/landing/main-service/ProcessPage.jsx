"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Lightbulb,
  Code2,
  Rocket,
  ShieldCheck,
  RefreshCw,
  Users,
  Check,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_PHASES = [
  {
    step: "01",
    title: "Discovery & Strategy",
    icon: Lightbulb,
    description:
      "We learn your goals, users, and constraints — then define scope, stack, and milestones.",
    deliverables: ["Requirements doc", "Technical roadmap", "Timeline"],
    duration: "1–2 weeks",
  },
  {
    step: "02",
    title: "UX/UI Design",
    icon: Users,
    description:
      "Wireframes and visual design focused on clarity, conversion, and usability.",
    deliverables: ["Wireframes", "UI mockups", "Design system"],
    duration: "2–3 weeks",
  },
  {
    step: "03",
    title: "Agile Development",
    icon: Code2,
    description:
      "Two-week sprints with demos, so you always see progress — never a black box.",
    deliverables: ["Working builds", "Sprint demos", "Source code"],
    duration: "Ongoing",
  },
  {
    step: "04",
    title: "QA & Security",
    icon: ShieldCheck,
    description:
      "Testing, performance checks, and security review before anything goes live.",
    deliverables: ["Test reports", "Security audit", "Benchmarks"],
    duration: "1–2 weeks",
  },
  {
    step: "05",
    title: "Deployment",
    icon: Rocket,
    description:
      "Staged rollout, monitoring, and launch support with minimal downtime.",
    deliverables: ["Production deploy", "Monitoring", "Launch checklist"],
    duration: "~1 week",
  },
  {
    step: "06",
    title: "Growth & Support",
    icon: RefreshCw,
    description:
      "Analytics, fixes, and improvements after launch — we stay with you.",
    deliverables: ["Analytics setup", "Optimization plan", "Support SLA"],
    duration: "Ongoing",
  },
];

const PHASE_ICONS = [Lightbulb, Users, Code2, ShieldCheck, Rocket, RefreshCw];
const EASE = [0.22, 1, 0.36, 1];

/**
 * Left panel scroll behaviour (desktop).
 * Scroll down: 23vh → slowly → 51vh (end of timeline).
 * Scroll up:  51vh → slowly → 23vh (reverses automatically).
 */
const PIN_CONFIG = {
  topStart: "23vh",
  topEnd: "40vh",
  scrollStart: "top 23vh",
  scrollEnd: "bottom bottom",
  scrub: 0.85,
  minWidth: "(min-width: 1024px)",
};

function parseMetric(raw) {
  const str = String(raw ?? "");
  if (str.includes("/")) return { display: str, animate: false };
  const numeric = parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
  if (!numeric && str) return { display: str, animate: false };
  const suffix = str.includes("%")
    ? "%"
    : str.includes("+")
      ? "+"
      : str.includes("★")
        ? "★"
        : str.replace(/[0-9.]/g, "") || "";
  return {
    display: `${numeric}${suffix}`,
    animate: true,
    value: numeric,
    suffix,
    isFloat: numeric % 1 !== 0,
  };
}

function MetricStat({ metric }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: EASE }}
      className="group relative text-center py-1"
    >
      <span
        className="absolute inset-x-2 bottom-0 h-px origin-center scale-x-0 bg-accent opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100"
        aria-hidden
      />
      <p className="font-heading text-2xl md:text-3xl font-bold text-primary transition-colors duration-300 group-hover:text-accent">
        {metric.display}
      </p>
      <p className="mt-1 text-sm text-text-muted font-body">{metric.label}</p>
    </motion.div>
  );
}

function ProcessStepCard({ phase, cardRef, nodeRef, isActive, reducedMotion }) {
  const Icon = phase.icon;
  const stepNum = phase.step.replace(/^0/, "");

  return (
    <article
      ref={cardRef}
      className={`relative pl-14 md:pl-16 ${reducedMotion ? "opacity-100" : "opacity-0"}`}
    >
      {/* Timeline node */}
      <div
        ref={nodeRef}
        className={`absolute left-0 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold font-heading transition-all duration-500 ${isActive
          ? "scale-110 border-accent bg-accent text-white shadow-[0_0_0_6px_color-mix(in_oklch,var(--accent)_22%,transparent)]"
          : "scale-100 border-border bg-white text-primary"
          }`}
        aria-hidden
      >
        {stepNum}
      </div>

      <div
        className={`group rounded-xl border bg-white p-5 md:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-all duration-500 ${isActive
          ? "border-accent/40 shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
          : "border-border"
          }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span
              className={`icon-circle shrink-0 transition-transform duration-500 ${isActive ? "scale-105" : ""
                }`}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="font-heading text-lg font-semibold text-text-primary">
              {phase.title}
            </h3>
          </div>
          {phase.duration && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-medium text-text-muted border border-border">
              <Clock className="h-3.5 w-3.5 text-accent" aria-hidden />
              {phase.duration}
            </span>
          )}
        </div>

        <p className="text-sm md:text-base text-text-body font-body leading-relaxed">
          {phase.description}
        </p>

        {phase.deliverables?.length > 0 && (
          <ul className="mt-4 pt-4 border-t border-border space-y-2">
            <li className="text-xs font-medium uppercase tracking-[0.08em] text-text-muted mb-1">
              You receive
            </li>
            {phase.deliverables.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-text-body font-body"
              >
                <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export function ProcessPage({ serviceData }) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const leftPanelRef = useRef(null);
  const lineBgRef = useRef(null);
  const lineProgressRef = useRef(null);
  const cardRefs = useRef([]);
  const nodeRefs = useRef([]);

  const [activeStep, setActiveStep] = useState(0);

  const phases =
    serviceData?.lifecycle?.map((l, idx) => ({
      step: l.step || `0${idx + 1}`,
      title: l.title,
      description: l.description,
      icon: PHASE_ICONS[idx % PHASE_ICONS.length],
      deliverables: l.deliverables || [
        "Documentation",
        "Working code",
        "QA report",
      ],
      duration: l.duration || "Flexible",
    })) || DEFAULT_PHASES;

  const defaultMetrics = [
    { ...parseMetric("98%"), label: "On-time delivery" },
    { ...parseMetric("3.5x"), label: "Avg. revenue growth" },
    { ...parseMetric("40%"), label: "Faster launch" },
    { ...parseMetric("100%"), label: "IP ownership" },
  ];

  const displayMetrics =
    serviceData?.stats?.map((s) => ({
      label: s.label,
      ...parseMetric(s.value),
    })) || defaultMetrics;

  const serviceTitle = serviceData?.title || "Our";

  // Initialize refs in useEffect to avoid render-time access
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, phases.length);
    nodeRefs.current = nodeRefs.current.slice(0, phases.length);
  }, [phases.length]);

  useEffect(() => {
    const track = trackRef.current;
    const lineProgress = lineProgressRef.current;
    if (!track || !lineProgress) return;

    const prefersReduced = reducedMotion === true;

    const leftPanel = leftPanelRef.current;

    if (prefersReduced) {
      gsap.set(lineProgress, { scaleY: 1 });
      cardRefs.current.forEach((card) => {
        if (card) gsap.set(card, { opacity: 1, y: 0 });
      });
      if (leftPanel) gsap.set(leftPanel, { top: PIN_CONFIG.topStart });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(lineProgress, { scaleY: 0, transformOrigin: "top center" });

      const mm = gsap.matchMedia();
      mm.add(PIN_CONFIG.minWidth, () => {
        if (!leftPanel) return;

        gsap.set(leftPanel, { top: PIN_CONFIG.topStart });

        ScrollTrigger.create({
          trigger: track,
          start: PIN_CONFIG.scrollStart,
          end: PIN_CONFIG.scrollEnd,
          pin: leftPanel,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        gsap.fromTo(
          leftPanel,
          { top: PIN_CONFIG.topStart },
          {
            top: PIN_CONFIG.topEnd,
            ease: "none",
            scrollTrigger: {
              trigger: track,
              start: PIN_CONFIG.scrollStart,
              end: PIN_CONFIG.scrollEnd,
              scrub: PIN_CONFIG.scrub,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      gsap.to(lineProgress, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: track,
          start: "top 58%",
          end: "bottom 42%",
          scrub: 0.45,
        },
      });

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 56 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 55%",
              toggleActions: "play none none reverse",
            },
          }
        );

        ScrollTrigger.create({
          trigger: card,
          start: "top 65%",
          end: "bottom 35%",
          onEnter: () => setActiveStep(index),
          onEnterBack: () => setActiveStep(index),
          onLeaveBack: () => {
            if (index > 0) setActiveStep(index - 1);
          },
        });

        const node = nodeRefs.current[index];
        if (node) {
          gsap.fromTo(
            node,
            { scale: 0.5, opacity: 0.4 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "back.out(1.6)",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, sectionRef);

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [phases.length, reducedMotion]);

  const scrollToStep = (index) => {
    const card = cardRefs.current[index];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 overflow-hidden bg-transparent font-sans"
      aria-labelledby="process-heading"
    >
      {/* Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Mesh Gradients */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] -translate-y-1/2" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[140px] translate-y-1/2" />
          <div className="absolute rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-accent/20" />
        </motion.div>

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Decorative Floating Nodes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, 30, 0],
                x: [0, 10, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 7 + i * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
              }}
              className="absolute h-20 w-20 rounded-full bg-primary"
              style={{
                top: `${30 + i * 25}%`,
                left: `${15 + (i % 2) * 70}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container relative z-10">
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <span className="text-lg font-bold uppercase tracking-[0.2em] text-accent">Our process</span>
          <h2
            id="process-heading"
            className="mt-6 font-heading text-4xl font-bold text-text-primary leading-tight"
          >
            How we build your{" "}
            <span className="text-accent capitalize"> {serviceTitle}</span> project
          </h2>
          <p className="mt-6 text-lg md:text-xl text-text-body font-body leading-relaxed max-w-2xl mx-auto">
            Scroll through each phase — the line tracks your progress from
            discovery to launch.
          </p>
        </motion.header>

        {/* Two-column layout: left = pinned step card, right = scrolling timeline */}
        <div className="max-w-7xl mx-auto lg:flex lg:items-start lg:gap-14">
          {/* leftPanelRef — scrolls 30vh → 60vh while pinned (PIN_CONFIG) */}
          <aside className="hidden lg:block lg:w-[34%] lg:shrink-0">
            <div ref={leftPanelRef} className="w-full">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE }}
                className="rounded-3xl border border-border bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)]"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">
                  Step {String(activeStep + 1).padStart(2, "0")} of{" "}
                  {String(phases.length).padStart(2, "0")}
                </p>
                <h3 className="font-heading text-2xl font-bold text-text-primary leading-tight transition-all duration-300">
                  {phases[activeStep]?.title}
                </h3>
                <p className="mt-4 text-base text-text-body font-body leading-relaxed line-clamp-4">
                  {phases[activeStep]?.description}
                </p>

                <nav
                  className="mt-8 flex flex-col gap-2 max-h-[min(42vh,320px)] overflow-y-auto custom-scrollbar pr-1"
                  aria-label="Process steps"
                >
                  {phases.map((phase, index) => (
                    <button
                      key={phase.step}
                      type="button"
                      onClick={() => scrollToStep(index)}
                      className={`flex items-center gap-4 rounded-xl px-4 py-3 text-left text-sm transition-all duration-300 border ${activeStep === index
                        ? "bg-surface border-accent/20 text-text-primary font-bold"
                        : "border-transparent text-text-muted hover:text-text-body hover:bg-surface/60"
                        }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold font-heading transition-colors duration-300 ${activeStep >= index
                          ? "bg-accent text-white"
                          : "bg-surface border border-border text-text-muted"
                          }`}
                      >
                        {phase.step.replace(/^0/, "")}
                      </span>
                      <span className="truncate">{phase.title}</span>
                    </button>
                  ))}
                </nav>
                <div className="pt-2 flex items-center justify-center  ">
                  <Button
                    className="bg-accent text-white "
                    type="button"
                    href="/contact">
                    Get a free quote</Button>
                </div>
              </motion.div>
            </div>
          </aside>

          {/* Right — scroll track + cards */}
          <div className="lg:flex-1 lg:min-w-0 relative" ref={trackRef}>
            <div className="mb-8 lg:hidden rounded-2xl border border-border bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Step {String(activeStep + 1).padStart(2, "0")} of{" "}
                {String(phases.length).padStart(2, "0")}
              </p>
              <p className="mt-2 font-heading text-lg font-bold text-text-primary">
                {phases[activeStep]?.title}
              </p>
            </div>

            {/* Background line */}
            <div
              ref={lineBgRef}
              className="absolute left-5 top-0 bottom-0 w-0.5 bg-border/60"
              aria-hidden
            />
            {/* Progress line — grows on scroll */}
            <div
              ref={lineProgressRef}
              className="absolute left-5 top-0 w-0.5 h-full origin-top will-change-transform"
              style={{
                background:
                  "linear-gradient(180deg, var(--accent) 0%, var(--primary) 100%)",
                boxShadow:
                  "0 0 15px color-mix(in oklch, var(--accent) 30%, transparent)",
              }}
              aria-hidden
            />

            <div className="flex flex-col gap-12 md:gap-16">
              {phases.map((phase, index) => (
                <ProcessStepCard
                  key={phase.step}
                  phase={phase}
                  isActive={activeStep >= index}
                  reducedMotion={reducedMotion === true}
                  cardRef={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  nodeRef={(el) => {
                    nodeRefs.current[index] = el;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProcessPage;
