'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavigationWheel } from './NavigationWheel';

export function ClientScrollWheel({ tocItems }) {
  const [activeSection, setActiveSection] = useState(tocItems[0]?.id || 'overview');
  const [scrollDir, setScrollDir] = useState('down');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [wheelTop, setWheelTop] = useState(-360);
  const lastScrollY = useRef(0);

  // Map tocItems to sections format expected by NavigationWheel
  const sections = tocItems.map(item => ({
    id: item.id,
    label: item.title
  }));

  const getWheelHeight = () => {
    if (typeof window === 'undefined') return 360;
    const width = window.innerWidth;
    if (width >= 1024) return 360;
    if (width >= 768) return 230;
    return 180;
  };

  const handleScroll = useCallback(() => {
    const st = window.scrollY;
    const vh = window.innerHeight;
    const maxScroll = document.documentElement.scrollHeight - vh;

    // Scroll direction
    setScrollDir(st > lastScrollY.current ? 'down' : 'up');
    lastScrollY.current = st;

    // Scroll progress (0 to 1)
    const progress = maxScroll > 0 ? Math.min(st / maxScroll, 1) : 0;
    setScrollProgress(progress);

    // Wheel position
    const wheelHeight = getWheelHeight();
    const NAVBAR_H = 72;
    const SCROLL_START = 80;

    if (st < SCROLL_START) {
      setWheelTop(-wheelHeight);
    } else {
      const minTop = NAVBAR_H + 16;
      const maxTop = vh - wheelHeight - 16;
      const scrollRange = maxScroll - SCROLL_START;
      const scrollAmount = Math.max(0, st - SCROLL_START);
      let topPos = minTop + (scrollAmount / scrollRange) * (maxTop - minTop);
      topPos = Math.min(maxTop, Math.max(minTop, topPos));
      setWheelTop(topPos);
    }

    // Active section detection
    for (let i = tocItems.length - 1; i >= 0; i--) {
      const el = document.getElementById(tocItems[i].id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= NAVBAR_H + 100) {
          setActiveSection(tocItems[i].id);
          break;
        }
      }
    }
  }, [tocItems]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <NavigationWheel
      sections={sections}
      activeSection={activeSection}
      scrollDirection={scrollDir}
      wheelTop={wheelTop}
      scrollProgress={scrollProgress}
      isVisible={wheelTop >= 0}
    />
  );
}
