"use client";

import { Card } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) setHasAnimated(true);
  }, [isInView, hasAnimated]);

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
      animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden h-full">
        <div className="flex flex-col lg:flex-row">

          {/* ================= LEFT SIDE ================= */}
          <div className="flex flex-col justify-between p-6 lg:p-8 lg:w-5/12 bg-white">

            <div>
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-600 mt-1.5 leading-tight">
                {description}
              </p>

              <div className="mt-6">

                {/* PRICE DISPLAY */}
                {hasValidPrice ? (
                  <>
                    {/* RANGE */}
                    {hasRange ? (
                      <div className="flex flex-col">
                        <span className="text-3xl font-extrabold tracking-tighter">
                          AUD {formatPrice(price)} – {formatPrice(originalPrice)}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">
                          one-time project range
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-4xl font-extrabold tracking-tighter">
                          AUD {formatPrice(price)}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">
                          one-time payment
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-3xl font-bold text-slate-900">
                    Custom Pricing
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8 lg:mt-6">
              <Button className="w-full" size="lg" onClick={onButtonClick}>
                {buttonText}
              </Button>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="bg-slate-50 p-6 lg:p-8 lg:w-7/12">
            <div className="space-y-6">

              {features.map((feature, featureIndex) => (
                <div key={featureIndex}>
                  <h4 className="font-semibold text-base mb-3">
                    {feature.title}
                  </h4>

                  <ul className="space-y-2.5">
                    {feature.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight text-slate-600">
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