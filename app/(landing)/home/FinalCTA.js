'use client';

import Link from "next/link";
import { ArrowRight, Zap, Clock, Headphones } from "lucide-react";
import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-primary">
      {/* Animated Mesh Gradient Background using global colors */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            x: [0, -100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-400 mx-auto px-6 relative z-10 text-center">
        <div className="mb-12 text-center">
          <h2 className="font-heading font-bold text-4xl md:text-6xl text-white mb-6 tracking-tight">
            Ready to Build Your <span className="text-accent">Digital Future?</span>
          </h2>
          <p className="text-white/70 font-body text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Whether you're a startup looking for an MVP or an enterprise scaling your operations, our expert team is ready to turn your vision into high-performance software.
          </p>
        </div>

        {/* Bento Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-6 h-6" />
            </div>
            <div className="font-heading font-bold text-3xl text-white mb-1">Agile</div>
            <div className="text-white/40 font-body text-sm">Development Process</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white/60 mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
              <Clock className="w-6 h-6" />
            </div>
            <div className="font-heading font-bold text-3xl text-white mb-1">On-time</div>
            <div className="text-white/40 font-body text-sm">Guaranteed Delivery</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
              <Headphones className="w-6 h-6" />
            </div>
            <div className="font-heading font-bold text-3xl text-white mb-1">24/7</div>
            <div className="text-white/40 font-body text-sm">Technical Support</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-2 px-10 py-5 bg-accent text-white font-heading font-bold rounded-2xl overflow-hidden shadow-2xl shadow-accent/20 hover:shadow-accent/40 transition-all hover:-translate-y-1 active:translate-y-0"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span>Start Your Project</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-500" />
          </Link>
          
          <Link
            href="/projects"
            className="px-10 py-5 bg-white/5 text-white font-heading font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            View Our Work
          </Link>
        </div>

        <div className="mt-12 text-white/40 font-body text-sm flex items-center justify-center gap-4">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent" /> Free Consultation</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent" /> NDA Protected</span>
        </div>
      </div>
    </section>
  );
}

function CheckCircle2({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

