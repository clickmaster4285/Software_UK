"use client";

import React from "react";
import { motion } from "framer-motion";
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

const defaultClients = [
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
];

function ClientCard({ client, index }) {
  const Icon = client.icon || Building2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-card hover:bg-surface transition-all duration-300 p-8 flex flex-col items-center justify-center gap-4 min-h-[160px] border border-border/50 hover:border-accent/20 hover:shadow-xl hover:shadow-accent/5"
    >
      {/* Accent bar on hover */}
      <span
        className="absolute top-0 left-0 w-full h-1 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        aria-hidden="true"
      />

      {/* Icon Container */}
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-surface group-hover:bg-accent/10 transition-colors duration-300">
        <Icon
          size={28}
          className="text-muted-foreground group-hover:text-accent transition-colors duration-300"
          strokeWidth={1.5}
        />
      </div>

      {/* Text Info */}
      <div className="text-center">
        <p className="text-sm font-heading font-bold text-foreground leading-tight mb-1">
          {client.name}
        </p>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">
          {client.industry}
        </p>
      </div>
    </motion.div>
  );
}

export function TrustedClientsSection({ clients = defaultClients, title, subtitle }) {
  // Ensure we have an array to map over
  const clientsList = Array.isArray(clients) ? clients : defaultClients;

  return (
    <section className="bg-background py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <span className="w-10 h-0.5 bg-accent rounded-full" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
              Recognition
            </span>
            <span className="w-10 h-0.5 bg-accent rounded-full" />
          </motion.div>

          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6"
          >
            {title || "Trusted by Visionary Brands"}
          </motion.h3>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto font-body text-lg"
          >
            {subtitle || "Join 3,500+ businesses globally that leverage our engineering excellence to scale their digital infrastructure."}
          </motion.p>
        </div>

        {/* Client Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border border-border/60 rounded-[2rem] overflow-hidden">
          {clientsList.map((client, idx) => (
            <ClientCard
              key={`${client.name}-${idx}`}
              client={client}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustedClientsSection;
