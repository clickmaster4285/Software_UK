"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

function Counter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9]/g, "");
  const [hasAnimated, setHasAnimated] = useState(false);

  // Always render the final figure — never flash "0+" for users or crawlers.
  // Motion is a subtle count-up from ~70% of the value, not from zero.
  const startValue = Math.max(1, Math.floor(numericValue * 0.7));
  const spring = useSpring(numericValue, {
    mass: 1,
    stiffness: 100,
    damping: 30,
  });

  const displayValue = useTransform(spring, (current) =>
    Math.round(current).toLocaleString() + suffix
  );

  useEffect(() => {
    if (!inView || hasAnimated) return;
    spring.jump(startValue);
    spring.set(numericValue);
    setHasAnimated(true);
  }, [inView, numericValue, spring, hasAnimated, startValue]);

  return (
    <motion.span ref={ref} aria-label={value}>
      {displayValue}
    </motion.span>
  );
}

export default function StatsBanner() {
  // Conservative, site-consistent figures (aligned with About / Why Choose Us)
  const stats = [
    { value: "200+", label: "Projects Delivered" },
    { value: "50+", label: "Clients Served" },
    { value: "12+", label: "Industries Served" },
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

