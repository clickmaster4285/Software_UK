"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";

const LenisContext = createContext(null);

export function useLenisScroll() {
  const context = useContext(LenisContext);

  const scrollToTop = useCallback(() => {
    if (context?.scrollToTop) {
      context.scrollToTop();
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [context]);

  return { scrollToTop };
}

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  const scrollToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      orientation: "vertical",
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={{ scrollToTop }}>
      {children}
    </LenisContext.Provider>
  );
}
