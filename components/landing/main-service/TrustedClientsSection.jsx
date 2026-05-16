"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Cpu,
  Stethoscope,
  ShoppingBag,
  Building2,
  GraduationCap,
  Coins,
  Truck,
  Tv2,
  Landmark,
  Leaf,
  Hotel,
  Activity,
  CircuitBoard,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const trustedClients = [
  { name: "TechCorp", industry: "Manufacturing", icon: Cpu },
  { name: "HealthPlus", industry: "Healthcare", icon: Stethoscope },
  { name: "RetailHub", industry: "Retail", icon: ShoppingBag },
  { name: "EstatePro", industry: "Real Estate", icon: Building2 },
  { name: "EduSmart", industry: "Education", icon: GraduationCap },
  { name: "FinTrust", industry: "Finance", icon: Coins },
  { name: "LogiFlow", industry: "Logistics", icon: Truck },
  { name: "MediaWave", industry: "Media", icon: Tv2 },
  { name: "NovaBank", industry: "Banking", icon: Landmark },
  { name: "GreenField", industry: "Agriculture", icon: Leaf },
  { name: "Skyline Hotels", industry: "Hospitality", icon: Hotel },
  { name: "Pulse Fitness", industry: "Health & Fitness", icon: Activity },
  { name: "Quantum Dynamics", industry: "Technology", icon: CircuitBoard },
  { name: "Lumina Insurance", industry: "Insurance", icon: ShieldCheck },
  { name: "Vertex Solutions", industry: "Consulting", icon: BarChart3 },
];

// const stats = [
//   { value: "3,500+", label: "Clients worldwide" },
//   { value: "12", label: "Industries served" },
//   { value: "98%", label: "Satisfaction rate" },
// ];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function ClientCard({
  client,
  index,
  visible,
}) {
  const Icon = client.icon;

  return (
    <div
      className="group relative bg-white hover:bg-gray-50 transition-colors duration-200 p-8 flex flex-col items-center justify-center gap-5 min-h-[180px]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.4s ease ${index * 50}ms, transform 0.4s ease ${index * 50}ms, background-color 0.2s`,
      }}
    >
      {/* Gold bottom accent bar on hover */}
      <span
        className="absolute bottom-0 left-0 w-full h-[3px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Icon */}
      <div className="w-16 h-16 flex items-center justify-center rounded-xl  group-hover:border-primary group-hover:bg-primary/10 transition-all duration-200">
        <Icon
          size={28}
          className="text-primary"
          strokeWidth={1.5}
          aria-hidden
        />
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-base font-semibold text-gray-900 leading-snug">
          {client.name}
        </p>
        <p className="text-[11px] uppercase tracking-widest text-gray-400 mt-1">
          {client.industry}
        </p>
      </div>
    </div>
  );
}

export function TrustedClientsSection() {
  const { ref, visible } = useInView();

  return (
    <section ref={ref} className="bg-gradient-to-b from-white to-slate-50  py-6 px-6 lg:px-26 lg:py-16 ">



     
  
    

      {/* Header original design */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-3">
           <span className="h-0.5 w-8 rounded-full bg-accent" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                Trusted By Industry Leaders
              </p>
              <span className="h-0.5 w-8 rounded-full bg-accent" />
        </div>

        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
          Our Trusted Partners & Clients
        </h3>

        <p className="text-gray-700 max-w-2xl mx-auto text-sm">
          Join 3,500+ businesses that trust ClickMasters to deliver exceptional software solutions
        </p>
      </div>

      {/* Client Grid */}
      <div className="border border-gray-200 rounded-xl overflow-hidden grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-y divide-gray-200 lg:mx-20">
        {trustedClients.map((client, idx) => (
          <ClientCard
            key={client.name}
            client={client}
            index={idx}
            visible={visible}
          />
        ))}
      </div>

      {/* Stats Bar */}
      {/* <div className="mt-10 flex items-center justify-center gap-10 flex-wrap">
        {stats.map((stat, i) => (
          <React.Fragment key={stat.label}>
            {i > 0 && (
              <span className="w-px h-8 bg-gray-200 hidden sm:block" aria-hidden />
            )}
            <div className="text-center">
              <p
                className="text-2xl font-semibold text-gray-900"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">
                {stat.label}
              </p>
            </div>
          </React.Fragment>
        ))}
      </div> */}
    </section>
  );
}

export default TrustedClientsSection;

