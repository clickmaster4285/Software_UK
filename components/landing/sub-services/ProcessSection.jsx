"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Zap,
  Target,
  Rocket,
  ArrowRight,
  Clock,
  Gem,
  Code,
  BarChart,
  GitCommit,
  GitPullRequest,
  Terminal,
  Workflow,
} from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";

// Simplified easing - no cubicBezier import issues
const EASE_OUT = [0.33, 1, 0.68, 1];

const LEFT_WIDGETS = [
  {
    id: "git",
    icon: GitCommit,
    label: "sprint / main",
    title: "discovery → build",
    lines: ["git checkout -b feature/process", "✓ branch pushed · CI queued"],
    dot: "bg-emerald-500",
  },
  {
    id: "terminal",
    icon: Terminal,
    label: "local",
    title: "quality checks",
    lines: ["npm run lint && npm test", "✓ all phases green"],
    dot: "bg-accent",
  },
];

const RIGHT_WIDGETS = [
  {
    id: "pr",
    icon: GitPullRequest,
    label: "release",
    title: "review & merge",
    lines: ["PR approved · 4/4 checks passed", "Deploying to staging…"],
    dot: "bg-accent",
  },
  {
    id: "ci",
    icon: Workflow,
    label: "pipeline",
    title: "ship to production",
    lines: ["build → test → scan → deploy", "● live · monitoring on"],
    dot: "bg-emerald-500",
  },
];

const getPhaseIcon = (phaseNumber) => {
  const icons = {
    1: Search,
    2: Zap,
    3: Target,
    4: Rocket,
    5: Code,
    6: BarChart,
  };
  return icons[phaseNumber] || Search;
};

const getPhaseColor = (phaseNumber) => {
  const colors = {
    1: { from: "from-primary", to: "to-primary" },
    2: { from: "from-cyan-500", to: "to-blue-500" },
    3: { from: "from-purple-500", to: "to-pink-500" },
    4: { from: "from-emerald-500", to: "to-teal-500" },
    5: { from: "from-indigo-500", to: "to-violet-500" },
    6: { from: "from-red-500", to: "to-primary" },
  };
  return colors[phaseNumber] || { from: "from-primary", to: "to-primary" };
};

const getIconColor = (index) => {
  const colors = {
    1: "text-primary",
    2: "text-cyan-500",
    3: "text-purple-500",
    4: "text-emerald-500",
    5: "text-indigo-500",
    6: "text-red-500",
  };
  return colors[index] || "text-primary";
};

function buildRevealSteps(phaseCount) {
  if (phaseCount === 2) {
    return [
      { kind: "card", phaseIdx: 0 },
      { kind: "h-pipe", key: "h-0" },
      { kind: "card", phaseIdx: 1 },
    ];
  }
  if (phaseCount === 4) {
    return [
      { kind: "card", phaseIdx: 0 },
      { kind: "h-pipe", key: "h-0" },
      { kind: "card", phaseIdx: 1 },
      { kind: "v-pipe", key: "v-0" },
      { kind: "card", phaseIdx: 2 },
      { kind: "h-pipe", key: "h-1", reverse: true },
      { kind: "card", phaseIdx: 3 },
    ];
  }
  if (phaseCount === 6) {
    return [
      { kind: "card", phaseIdx: 0 },
      { kind: "h-pipe", key: "h-0" },
      { kind: "card", phaseIdx: 1 },
      { kind: "v-pipe", key: "v-0" },
      { kind: "card", phaseIdx: 2 },
      { kind: "h-pipe", key: "h-1", reverse: true },
      { kind: "card", phaseIdx: 3 },
      { kind: "v-pipe", key: "v-1" },
      { kind: "card", phaseIdx: 4 },
      { kind: "h-pipe", key: "h-2" },
      { kind: "card", phaseIdx: 5 },
    ];
  }

  const steps = [];
  for (let i = 0; i < phaseCount; i++) {
    steps.push({ kind: "card", phaseIdx: i });
    if (i < phaseCount - 1) {
      steps.push({ kind: "h-pipe", key: `h-${i}` });
    }
  }
  return steps;
}

function getRevealProgress(steps, global, stepIndex) {
  if (steps.length <= 0) return 0;
  const start = stepIndex / steps.length;
  const end = (stepIndex + 1) / steps.length;
  if (global < start) return 0;
  if (global >= end) return 1;
  return (global - start) / (end - start);
}

function buildProgressMaps(steps, global) {
  const cardProgress = {};
  const pipeProgress = {};

  steps.forEach((step, i) => {
    const fill = getRevealProgress(steps, global, i);
    if (step.kind === "card") {
      cardProgress[step.phaseIdx] = fill;
    } else {
      pipeProgress[step.key] = fill;
    }
  });

  return { cardProgress, pipeProgress };
}

function FluidHPipe({ progress, reverse = false, reducedMotion }) {
  const fill = reducedMotion ? 1 : progress;
  const arrowOpacity = Math.min(1, Math.max(0, (fill - 0.75) / 0.25));

  return (
    <div className="relative mx-2 hidden min-w-[180px] flex-1 items-center lg:flex">
      {!reverse && (
        <motion.div
          style={{ opacity: arrowOpacity, scale: arrowOpacity }}
          className="order-last -ml-3 shrink-0"
        >
          <div className="h-0 w-0 border-y-[12px] border-y-transparent border-l-[20px] border-l-accent" />
        </motion.div>
      )}

      <div className="relative h-4 flex-1">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-surface">
          <motion.div
            style={{
              scaleX: fill,
              transformOrigin: reverse ? "right" : "left",
            }}
            className="h-full w-full rounded-full bg-gradient-to-r from-primary via-accent to-accent-hover"
            transition={{ duration: 0.3, ease: EASE_OUT }}
          />
          {!reducedMotion && fill > 0 && fill < 1 && (
            <motion.div
              className="absolute inset-0 h-full w-[200%] rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
        {!reducedMotion && fill > 0.05 && (
          <motion.div
            className="absolute top-1/2 z-10 h-2 w-6 -translate-y-1/2 rounded-full bg-accent/90 blur-[1px]"
            style={{
              left: `${fill * 92}%`,
              opacity: fill > 0.1 && fill < 0.95 ? 1 : 0,
            }}
          />
        )}
      </div>

      {reverse && (
        <motion.div
          style={{ opacity: arrowOpacity, scale: arrowOpacity }}
          className="order-first -mr-3 shrink-0"
        >
          <div className="h-0 w-0 border-y-[12px] border-y-transparent border-r-[20px] border-r-primary" />
        </motion.div>
      )}
    </div>
  );
}

function FluidVPipe({ progress, align = "end", reducedMotion }) {
  const fill = reducedMotion ? 1 : progress;
  const arrowOpacity = Math.min(1, Math.max(0, (fill - 0.75) / 0.25));

  return (
    <div
      className={cn(
        "relative my-2 flex flex-col items-center md:my-4",
        align === "end" ? "lg:justify-end lg:pr-[18%]" : "lg:justify-start lg:pl-[18%]",
        "flex justify-center"
      )}
    >
      <div className="relative hidden h-14 w-4 lg:block">
        <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden rounded-full bg-surface">
          <motion.div
            style={{ scaleY: fill, transformOrigin: "top" }}
            className="h-full w-full rounded-full bg-gradient-to-b from-primary via-accent to-accent-hover"
            transition={{ duration: 0.3, ease: EASE_OUT }}
          />
        </div>
        {!reducedMotion && fill > 0.05 && (
          <motion.div
            className="absolute left-1/2 z-10 w-2 -translate-x-1/2 rounded-full bg-accent/90 blur-[1px]"
            style={{
              top: `${fill * 88}%`,
              height: "0.5rem",
              opacity: fill > 0.1 && fill < 0.95 ? 1 : 0,
            }}
          />
        )}
      </div>
      <motion.div style={{ opacity: arrowOpacity, scale: arrowOpacity }} className="-mt-2 hidden lg:block">
        <div className="h-0 w-0 border-x-[10px] border-x-transparent border-t-[16px] border-t-accent" />
      </motion.div>
    </div>
  );
}

function ProcessDevWidget({ widget, side, index, visible, reducedMotion }) {
  const Icon = widget.icon;
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || !visible) return;
    const id = setInterval(() => {
      setLineIndex((p) => (p + 1) % widget.lines.length);
    }, 3000);
    return () => clearInterval(id);
  }, [visible, reducedMotion, widget.lines.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, x: side === "left" ? -10 : 10 }}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 12,
        x: visible ? 0 : side === "left" ? -10 : 10,
      }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className="w-44 rounded-xl border border-border bg-white/95 p-3 shadow-[0_8px_28px_rgba(0,0,0,0.07)] backdrop-blur-sm ring-1 ring-black/[0.03] xl:w-48"
    >
      <motion.div
        animate={reducedMotion || !visible ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="mb-2 flex items-center gap-2 border-b border-border/80 pb-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/5 text-primary">
            <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-[10px] font-medium uppercase tracking-wider text-text-muted">
              {widget.label}
            </p>
            <p className="truncate text-xs font-semibold text-text-primary">{widget.title}</p>
          </div>
          <span className={cn("h-2 w-2 shrink-0 rounded-full", widget.dot)} />
        </div>
        <div className="min-h-[2rem] font-mono text-[10px] leading-relaxed">
          <AnimatePresence mode="wait">
            <motion.p
              key={lineIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className={lineIndex === 0 ? "text-text-muted" : "text-emerald-600"}
            >
              {widget.lines[lineIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="mt-2 flex gap-1" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProcessSideWidgets({ side, widgets, visible, reducedMotion }) {
  const isLeft = side === "left";

  return (
    <div
      className={cn(
        "pointer-events-none absolute top-[20%] z-0 hidden flex-col gap-4 xl:flex",
        isLeft ? "-left-2 2xl:left-2" : "-right-2 2xl:right-2"
      )}
      aria-hidden
    >
      {widgets.map((w, i) => (
        <ProcessDevWidget
          key={w.id}
          widget={w}
          side={side}
          index={i}
          visible={visible}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}

function DesktopProcessCard({ phase, progress, side }) {
  const Icon = phase.icon;
  const colors = getPhaseColor(phase.index);
  const initialX = side === "left" ? -40 : 40;
  const p = Math.min(1, Math.max(0, progress));

  // Smoother reveal - starts at 0 opacity, reaches full by p=1
  const cardOpacity = Math.min(1, p * 1.2);
  const scaleValue = 0.85 + 0.15 * p;
  const xValue = initialX * (1 - Math.min(1, p * 1.1));
  const rotateValue = -6 * (1 - Math.min(1, p * 1.1));
  const yValue = 15 * (1 - Math.min(1, p * 1.1));

  return (
    <motion.div
      style={{
        opacity: cardOpacity,
        scale: scaleValue,
        x: xValue,
        rotate: rotateValue,
        y: yValue,
      }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="relative z-10 flex w-72 flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] md:gap-4 md:p-6 lg:w-80 xl:w-96"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {phase.phase}
          </span>
          <div className="mt-1 flex items-center gap-2 md:mt-2">
            <Badge
              variant="outline"
              className="rounded-full border-border bg-surface px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-accent md:py-1"
            >
              <Clock className="mr-1 h-3 w-3" />
              {phase.timeline}
            </Badge>
          </div>
        </div>
        <motion.div
          animate={{ scale: p > 0.2 ? 1 : 0.6, opacity: p > 0.2 ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl md:h-12 md:w-12"
        >
          <Icon className={`h-5 w-5 md:h-6 md:w-6 ${getIconColor(phase.index)}`} />
        </motion.div>
      </div>

      <div className="flex-1">
        <h3 className="mb-2 text-lg font-bold leading-tight text-text-primary md:mb-3 md:text-xl lg:text-2xl">
          {phase.title}
        </h3>
        <p className="text-sm leading-relaxed text-text-body">{phase.text}</p>
        <motion.div
          className={`mt-3 h-1 origin-left rounded-full bg-gradient-to-r md:mt-4 ${colors.from} ${colors.to}`}
          style={{ width: `${Math.min(120, 80 * p)}px` }}
          animate={{ width: `${Math.min(120, 80 * p)}px` }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        />
      </div>
    </motion.div>
  );
}

function MobileProcessCard({ phase, progress }) {
  const Icon = phase.icon;
  const colors = getPhaseColor(phase.index);
  const p = Math.min(1, Math.max(0, progress));
  const cardOpacity = Math.min(1, p * 1.2);

  return (
    <motion.div
      style={{ opacity: cardOpacity, y: 15 * (1 - Math.min(1, p * 1.2)) }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-7 shadow-[0_2px_16px_rgba(0,0,0,0.07)]"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {phase.phase}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-full border-border bg-surface px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-accent"
            >
              <Clock className="mr-1 h-3 w-3" />
              {phase.timeline}
            </Badge>
          </div>
        </div>
        <motion.div
          animate={{ scale: p > 0.2 ? 1 : 0.6, opacity: p > 0.2 ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        >
          <Icon className={`h-5 w-5 ${getIconColor(phase.index)}`} />
        </motion.div>
      </div>
      <div>
        <h3 className="mb-2 text-lg font-bold text-text-primary">{phase.title}</h3>
        <p className="text-sm leading-relaxed text-text-body">{phase.text}</p>
        <motion.div
          className={`mt-3 h-1 rounded-full bg-gradient-to-r ${colors.from} ${colors.to}`}
          style={{ width: `${Math.min(80, 60 * p)}px` }}
          animate={{ width: `${Math.min(80, 60 * p)}px` }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        />
      </div>
    </motion.div>
  );
}

function MobilePipe({ progress }) {
  const p = Math.min(1, Math.max(0, progress));
  return (
    <div className="flex justify-center py-1">
      <div className="relative h-10 w-1 overflow-hidden rounded-full bg-surface">
        <motion.div
          style={{ scaleY: p, transformOrigin: "top" }}
          className="h-full w-full rounded-full bg-gradient-to-b from-primary to-accent"
        />
      </div>
    </div>
  );
}

export const ProcessSection = ({ serviceName, processPhases }) => {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(false);

  const phases = processPhases.map((phase, index) => ({
    ...phase,
    index: index + 1,
    icon: getPhaseIcon(index + 1),
  }));

  const steps = buildRevealSteps(phases.length);
  const scrollSteps = steps.length > 0 ? steps : [{ kind: "card", phaseIdx: 0 }];
  const { cardProgress, pipeProgress } = buildProgressMaps(
    scrollSteps,
    reducedMotion ? 1 : scrollProgress
  );

  const { scrollYProgress } = useScroll({
    target: scrollTrackRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrollProgress(v);
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const widgetsVisible = scrollProgress > 0.02 || reducedMotion;

  // FIXED: 40vh total scroll for complete animation (20-60vh range)
  // For 6 phases: 40vh total = ~6.6vh per card - smooth and fast
  const trackHeightVh = 40; // Fixed 40vh for complete reveal

  const renderDesktopRows = () => {
    const cp = cardProgress;
    const pp = pipeProgress;

    if (phases.length === 2) {
      return (
        <div className="flex flex-row flex-wrap items-center justify-center gap-6">
          <DesktopProcessCard phase={phases[0]} progress={cp[0] ?? 0} side="left" />
          <FluidHPipe progress={pp["h-0"] ?? 0} reducedMotion={reducedMotion} />
          <DesktopProcessCard phase={phases[1]} progress={cp[1] ?? 0} side="right" />
        </div>
      );
    }

    if (phases.length === 4) {
      return (
        <>
          <div className="flex flex-row flex-wrap items-center justify-center gap-6">
            <DesktopProcessCard phase={phases[0]} progress={cp[0] ?? 0} side="left" />
            <FluidHPipe progress={pp["h-0"] ?? 0} reducedMotion={reducedMotion} />
            <DesktopProcessCard phase={phases[1]} progress={cp[1] ?? 0} side="right" />
          </div>
          <FluidVPipe progress={pp["v-0"] ?? 0} align="end" reducedMotion={reducedMotion} />
          <div className="flex flex-row flex-wrap items-center justify-center gap-6">
            <DesktopProcessCard phase={phases[3]} progress={cp[3] ?? 0} side="left" />
            <FluidHPipe progress={pp["h-1"] ?? 0} reverse reducedMotion={reducedMotion} />
            <DesktopProcessCard phase={phases[2]} progress={cp[2] ?? 0} side="right" />
          </div>
        </>
      );
    }

    if (phases.length === 6) {
      return (
        <>
          <div className="flex flex-row flex-wrap items-center justify-center gap-6">
            <DesktopProcessCard phase={phases[0]} progress={cp[0] ?? 0} side="left" />
            <FluidHPipe progress={pp["h-0"] ?? 0} reducedMotion={reducedMotion} />
            <DesktopProcessCard phase={phases[1]} progress={cp[1] ?? 0} side="right" />
          </div>
          <FluidVPipe progress={pp["v-0"] ?? 0} align="end" reducedMotion={reducedMotion} />
          <div className="flex flex-row flex-wrap items-center justify-center gap-6">
            <DesktopProcessCard phase={phases[3]} progress={cp[3] ?? 0} side="left" />
            <FluidHPipe progress={pp["h-1"] ?? 0} reverse reducedMotion={reducedMotion} />
            <DesktopProcessCard phase={phases[2]} progress={cp[2] ?? 0} side="right" />
          </div>
          <FluidVPipe progress={pp["v-1"] ?? 0} align="start" reducedMotion={reducedMotion} />
          <div className="flex flex-row flex-wrap items-center justify-center gap-6">
            <DesktopProcessCard phase={phases[4]} progress={cp[4] ?? 0} side="left" />
            <FluidHPipe progress={pp["h-2"] ?? 0} reducedMotion={reducedMotion} />
            <DesktopProcessCard phase={phases[5]} progress={cp[5] ?? 0} side="right" />
          </div>
        </>
      );
    }

    return (
      <div className="flex flex-col items-center gap-4">
        {phases.map((phase, i) => (
          <div key={phase.phase} className="flex flex-col items-center gap-4">
            <DesktopProcessCard
              phase={phase}
              progress={cp[i] ?? 0}
              side={i % 2 === 0 ? "left" : "right"}
            />
            {i < phases.length - 1 && (
              <FluidHPipe progress={pp[`h-${i}`] ?? 0} reducedMotion={reducedMotion} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto max-w-400 overflow-x-clip bg-white"
      aria-labelledby="process-section-heading"
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -top-16 left-1/3 h-56 w-56 rounded-full bg-accent/8 blur-[90px]" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary/6 blur-[100px]" />
      </div>

      {/* Header - stays visible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={headerVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="relative z-10 mx-auto mb-12 max-w-3xl text-center px-4"
      >
        <div className="mb-3 inline-flex items-center gap-2">
          <span className="h-[2px] w-8 rounded-full bg-accent" />
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-accent">
            Our Process
          </span>
          <span className="h-[2px] w-8 rounded-full bg-accent" />
        </div>
        <h2
          id="process-section-heading"
          className="mt-5 font-heading text-3xl font-bold tracking-tight text-text-primary"
        >
          Our <span className="text-accent">{serviceName}</span> Process
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-text-body sm:text-lg">
          Scroll to walk through each phase — lines connect as you move down.
        </p>
      </motion.div>

      {/* Scroll track - 40vh total scroll for complete animation */}
      <div
        ref={scrollTrackRef}
        className="relative"
        style={{ minHeight: `${trackHeightVh}vh` }}
      >
        <div className="sticky top-[20vh] z-10 flex flex-col items-center justify-center py-8">
          {/* Mobile */}
          <div className="w-full px-4 space-y-0 lg:hidden">
            {scrollSteps.map((step, i) => {
              if (step.kind === "card") {
                return (
                  <MobileProcessCard
                    key={`m-card-${step.phaseIdx}`}
                    phase={phases[step.phaseIdx]}
                    progress={cardProgress[step.phaseIdx] ?? 0}
                  />
                );
              }
              return (
                <MobilePipe
                  key={`m-pipe-${step.key}`}
                  progress={pipeProgress[step.key] ?? 0}
                />
              );
            })}
          </div>

          {/* Desktop */}
          <div className="relative hidden w-full max-w-7xl px-4 lg:block">
            <ProcessSideWidgets
              side="left"
              widgets={LEFT_WIDGETS}
              visible={widgetsVisible}
              reducedMotion={reducedMotion}
            />
            <ProcessSideWidgets
              side="right"
              widgets={RIGHT_WIDGETS}
              visible={widgetsVisible}
              reducedMotion={reducedMotion}
            />
            <div className="relative xl:mx-10 2xl:mx-20">
              {renderDesktopRows()}
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            className="mt-12 text-center"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollProgress - 0.8) / 0.2)),
            }}
          >
            <motion.button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent to-accent-hover px-8 py-3.5 text-sm font-semibold text-white shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] md:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Journey
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Decorative footer */}
      <div className="relative z-10 mx-auto mt-12 flex items-center gap-4 px-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <Gem className="h-3 w-3 text-text-muted/40" aria-hidden />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    </section>
  );
};