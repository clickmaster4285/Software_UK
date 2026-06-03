"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

function Counter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9]/g, "");

  const spring = useSpring(0, {
    mass: 1,
    stiffness: 100,
    damping: 30,
  });

  const displayValue = useTransform(spring, (current) =>
    Math.round(current).toLocaleString() + suffix
  );

  useEffect(() => {
    if (inView) {
      spring.set(numericValue);
    } else {
      spring.set(0);
    }
  }, [inView, numericValue, spring]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
}

export default function StatsBanner() {
  const stats = [
    { value: "1860+", label: "Projects Delivered " },
    { value: "3500+", label: "Clients Served Globally" },
    { value: "75+", label: "Awards & Recognitions" },
    { value: "5+", label: "Years Building Systems" },
  ];

  return (
    <section className="py-20 bg-primary border-y border-white/5">
      <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="font-heading font-bold text-4xl md:text-6xl text-white mb-3 group-hover:text-accent transition-colors duration-500">
                <Counter value={stat.value} />
              </div>
              <div className="text-gray-300 font-body text-sm md:text-base max-w-50 mx-auto leading-relaxed">
                {stat.label}
              </div>
              {/* Decorative line */}
              <div className="w-10 h-1 bg-accent/30 mx-auto mt-4 rounded-full group-hover:w-16 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

