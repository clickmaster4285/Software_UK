"use client";

import { Card } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function PricingCard({
  title,
  description,
  price,
  originalPrice,
  features,
  buttonText = "Get Started",
  onButtonClick,
}) {
  const containerRef = useRef(null);
  // useInView with once: true returns false after first trigger, which is the desired behavior
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const formatPrice = (value) => {
    if (!value || value <= 0) return null;
    return value.toLocaleString("en-AU");
  };

  const hasValidPrice = price > 0;
  const hasRange = originalPrice && originalPrice > price;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full border-border transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-accent/20">
        <div className="flex flex-col lg:flex-row h-full">

          {/* ================= LEFT SIDE ================= */}
          <div className="flex flex-col justify-between p-8 lg:p-10 lg:w-1/2 bg-white">

            <div>
              <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
              <p className="text-base text-slate-500 mt-2 leading-relaxed">
                {description}
              </p>

              <div className="mt-8">

                {/* PRICE DISPLAY */}
                {hasValidPrice ? (
                  <>
                    {/* RANGE */}
                    {hasRange ? (
                      <div className="flex flex-col">
                        <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                          ${formatPrice(price)} – ${formatPrice(originalPrice)}
                        </span>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">
                          AUD · one-time investment range
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-5xl font-extrabold tracking-tight text-slate-900">
                          ${formatPrice(price)}
                        </span>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">
                          AUD · one-time payment
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    Custom Pricing
                  </span>
                )}
              </div>
            </div>

            <div className="mt-10 lg:mt-8">
              <Button
                className="w-full bg-linear-to-r from-accent to-accent-hover text-white font-bold py-7 rounded-xl shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98] border-0"
                size="lg"
                onClick={onButtonClick}
              >
                {buttonText}
              </Button>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="bg-slate-50/50 p-8 lg:p-10 lg:w-1/2 border-l border-border/50">
            <div className="space-y-6">

              {features.map((feature, featureIndex) => (
                <div key={featureIndex}>
                  <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-4">
                    {feature.title}
                  </h4>

                  <ul className="space-y-4">
                    {feature.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </div>
                        <span className="leading-snug text-slate-600 font-medium">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {featureIndex < features.length - 1 && (
                    <Separator className="my-5" />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </Card>
    </motion.div>
  );
}