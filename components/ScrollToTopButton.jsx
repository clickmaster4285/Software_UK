"use client";

import { ArrowUp } from "lucide-react";
import { useScrollToTop } from "@/components/SmoothScroll";

export default function ScrollToTopButton() {
  const { scrollToTop } = useScrollToTop();

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="absolute bottom-12 right-6 z-20 p-3 bg-accent text-white rounded-xl border border-white/10 hover:bg-accent-hover transition-all shadow-lg"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
