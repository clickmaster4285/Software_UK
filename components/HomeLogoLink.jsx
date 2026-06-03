"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrollToTop } from "@/components/SmoothScroll";

export default function HomeLogoLink({ children, className }) {
  const pathname = usePathname();
  const { scrollToTop } = useScrollToTop();

  const handleClick = (e) => {
    if (pathname === "/") {
      e.preventDefault();
      scrollToTop();
    }
  };

  return (
    <Link href="/" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
