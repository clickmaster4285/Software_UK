"use client";

import { useEffect, useRef } from "react";
import {
  Search,
  Zap,
  Target,
  Rocket,
  Code,
  BarChart,
  Clock,
  ArrowRight,
  Check,
} from "lucide-react";
import Link from "next/link";

const PHASE_ICONS = [Search, Zap, Target, Rocket, Code, BarChart];

/* ─── Scroll-reveal hook ─── */
function useRevealOnScroll(refs) {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [refs]);
}

/* ─── Individual Step Card ─── */
function StepCard({ phase, index, cardRef }) {
  const Icon = PHASE_ICONS[index % PHASE_ICONS.length];
  const stepNum = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={cardRef}
      className="process-card"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {/* Glow layer — shows on hover */}
      <span className="card-glow" aria-hidden />

      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <span className="step-badge">{stepNum}</span>
        <span className="icon-wrap">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 flex-1">
        {phase.phase && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            {phase.phase}
          </p>
        )}
        <h3 className="font-heading text-lg font-bold leading-snug text-text-primary">
          {phase.title}
        </h3>
        <p className="text-sm leading-relaxed text-text-body">{phase.text}</p>
      </div>

      {/* Timeline */}
      {phase.timeline && (
        <div className="mt-4 flex items-center gap-1.5 pt-3 border-t border-border">
          <Clock className="h-3.5 w-3.5 text-text-muted" aria-hidden />
          <span className="text-xs font-medium text-text-muted">
            {phase.timeline}
          </span>
        </div>
      )}

      {/* Deliverables */}
      {phase.deliverables?.length > 0 && (
        <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
          {phase.deliverables.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-text-body">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      )}

      {/* Bottom accent line — grows on hover */}
      <span className="accent-bar" aria-hidden />
    </div>
  );
}

/* ─── Main Export ─── */
export const ProcessSection = ({ serviceName, processPhases }) => {
  const phases = processPhases?.map((phase, index) => ({ ...phase, index })) ?? [];
  const cardRefs = useRef([]);
  const headerRef = useRef(null);
  const allRefs = useRef([]);

  useEffect(() => {
    allRefs.current = [headerRef.current, ...cardRefs.current].filter(Boolean);
  }, [phases.length]);

  useRevealOnScroll(allRefs);

  if (phases.length === 0) return null;

  const gridCols =
    phases.length <= 2 ? "sm:grid-cols-2" :
    phases.length === 3 ? "sm:grid-cols-3" :
    phases.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" :
    "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        /* Blob drift animation */
        @keyframes blob-drift {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(30px, -20px) scale(1.05); }
          66%  { transform: translate(-20px, 15px) scale(0.97); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .blob { animation: blob-drift 10s ease-in-out infinite; }
        .blob-2 { animation: blob-drift 13s ease-in-out infinite reverse; }

        /* Card fade-up entrance */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .process-card, .process-header {
          opacity: 0;
          transform: translateY(28px);
        }
        .process-card.revealed, .process-header.revealed {
          animation: fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* Card base */
        .process-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: #fff;
          padding: 24px;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 0.3s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .process-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.10),
                      0 0 0 1px color-mix(in oklch, var(--accent) 25%, transparent);
          border-color: color-mix(in oklch, var(--accent) 35%, transparent);
        }

        /* Hover glow layer */
        .card-glow {
          pointer-events: none;
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: radial-gradient(
            600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            color-mix(in oklch, var(--accent) 8%, transparent),
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .process-card:hover .card-glow { opacity: 1; }

        /* Step badge */
        .step-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 32px;
          width: 32px;
          border-radius: 50%;
          background: var(--accent);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .process-card:hover .step-badge {
          transform: scale(1.15);
          box-shadow: 0 0 0 5px color-mix(in oklch, var(--accent) 20%, transparent);
        }

        /* Icon wrap */
        .icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          width: 40px;
          border-radius: 12px;
          background: color-mix(in oklch, var(--primary) 8%, transparent);
          color: var(--accent);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background 0.3s ease;
        }
        .process-card:hover .icon-wrap {
          transform: scale(1.12) rotate(8deg);
          background: color-mix(in oklch, var(--accent) 12%, transparent);
        }

        /* Bottom accent bar */
        .accent-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 0%;
          border-radius: 0 0 16px 16px;
          background: linear-gradient(90deg, var(--accent), var(--accent-hover));
          transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .process-card:hover .accent-bar { width: 100%; }

        /* Connector dots between cards on desktop */
        .connector {
          display: none;
          align-items: center;
          justify-content: center;
          color: color-mix(in oklch, var(--accent) 40%, transparent);
        }
        @media (min-width: 1024px) { .connector { display: flex; } }
      `}</style>

      <section
        className="relative py-20 bg-white"
        aria-labelledby="process-section-heading"
      >
        {/* Animated background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <div
            className="blob absolute -top-24 left-1/4 h-80 w-80 rounded-full opacity-[0.07]"
            style={{ background: "var(--accent)", filter: "blur(80px)" }}
          />
          <div
            className="blob-2 absolute bottom-0 right-1/4 h-72 w-72 rounded-full opacity-[0.05]"
            style={{ background: "var(--primary)", filter: "blur(90px)" }}
          />
          {/* Grid dots */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "radial-gradient(var(--accent) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div
            ref={headerRef}
            className="process-header mb-14 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-px w-8 rounded-full bg-accent" />
              <span className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
                Our Process
              </span>
              <span className="h-px w-8 rounded-full bg-accent" />
            </div>
            <h2
              id="process-section-heading"
              className="font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
            >
              How We Deliver{" "}
              <span className="text-accent">{serviceName}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-body">
              A clear, structured approach — so you always know what happens next and why.
            </p>
          </div>

          {/* Cards */}
          <div className={`grid gap-6 ${gridCols}`}>
            {phases.map((phase, index) => (
              <StepCard
                key={phase.phase ?? index}
                phase={phase}
                index={index}
                cardRef={(el) => { cardRefs.current[index] = el; }}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              Start Your Project
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProcessSection;