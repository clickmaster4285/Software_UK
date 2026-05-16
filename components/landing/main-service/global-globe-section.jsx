"use client";

import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";

import { GlobeCdn } from "@/components/ui/cobe-globe-cdn";

export function GlobalGlobeSection() {
  return (
    <section
      className="border-b border-slate-200/80 bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="global-reach-heading"
    >
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(260px,380px)] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55 }}
          >
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Globe2 className="h-4 w-4" aria-hidden />
              Global reach
            </p>
            <h2
              id="global-reach-heading"
              className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              Built for teams{" "}
              <span className="text-primary">everywhere</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
              Pins mark every U.S. state and D.C., all Canadian provinces and territories, Australian
              states and territories, New Zealand regions, and major UK regions. We still collaborate
              across Europe and the Middle East beyond what you see here.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:mx-0 lg:max-w-none"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <GlobeCdn
              theme="light"
              className="w-full"
              speed={0.0025}
              showMarkerOverlays
              showArcOverlays={false}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
