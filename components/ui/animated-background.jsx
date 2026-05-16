// components/ui/animated-background.jsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedBackground = ({ type = "404" }) => {
  const [isClient, setIsClient] = useState(false);
  const [particlesConfig, setParticlesConfig] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  // Background configurations for each error type
  const backgrounds = {
    "404": {
      gradient: "bg-linear-to-br from-primary via-accent-light to-primary",
      particles: 15,
      particleColor: "bg-purple-400/20"
    },
    "500": {
      gradient: "bg-linear-to-br from-rose-900 via-red-900 to-amber-900",
      particles: 20,
      particleColor: "bg-rose-400/20"
    },
    "401": {
      gradient: "bg-linear-to-br from-sky-900 via-sky-900 to-cyan-900",
      particles: 12,
      particleColor: "bg-sky-400/20"
    },
    "loading": {
      gradient: "bg-linear-to-br from-emerald-900 via-teal-900 to-green-900",
      particles: 10,
      particleColor: "bg-emerald-400/20"
    }
  };

  const config = backgrounds[type] || backgrounds["404"];

  useEffect(() => {
    const configs = Array.from({ length: config.particles }).map(() => ({
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.5,
      animateX: Math.random() * 100,
      animateY: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      width: Math.random() * 10 + 5,
      height: Math.random() * 10 + 5,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticlesConfig(configs);
  }, [config.particles]);

  if (!isClient) return <div className="fixed inset-0 -z-10" />;

  return (
    <div className={`fixed inset-0 -z-10 ${config.gradient}`}>
      {particlesConfig.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${config.particleColor}`}
          initial={{
            x: p.initialX,
            y: p.initialY,
            scale: p.scale,
          }}
          animate={{
            x: [null, p.animateX],
            y: [null, p.animateY],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            width: `${p.width}px`,
            height: `${p.height}px`,
          }}
        />
      ))}
    </div>
  );
};