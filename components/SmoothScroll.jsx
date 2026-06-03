"use client";

import { createContext, useCallback, useContext } from "react";

const ScrollContext = createContext(null);

export function useScrollToTop() {
  const context = useContext(ScrollContext);

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
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollToTop }}>
      {children}
    </ScrollContext.Provider>
  );
}
