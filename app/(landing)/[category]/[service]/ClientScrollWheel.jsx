'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NavigationWheel } from './NavigationWheel';

export function ClientScrollWheel({ tocItems }) {
  const [activeSection, setActiveSection] = useState(tocItems[0]?.id || 'overview');
  const [scrollDir, setScrollDir] = useState('down');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [wheelTop, setWheelTop] = useState(-360);

  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);

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

  useEffect(() => {
    let lenis;

    async function initLenis() {
      const { default: Lenis } = await import('@studio-freight/lenis');

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
      });

      lenisRef.current = lenis;

      function raf(time) {
        lenis.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      }
      rafIdRef.current = requestAnimationFrame(raf);

      lenis.on('scroll', ({ scroll, direction, limit }) => {
        const st = scroll;
        const vh = window.innerHeight;
        const dir = direction > 0 ? 'down' : 'up';

        setScrollDir(dir);

        // Calculate scroll progress for wheel rotation (0 to 1)
        const maxScroll = limit > 0 ? limit : 1; 
        const progress = Math.min(st / maxScroll, 1);
        setScrollProgress(progress);

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
        const sectionElements = tocItems.map(item => ({
          id: item.id,
          el: document.getElementById(item.id)
        })).filter(s => s.el);

        for (let i = sectionElements.length - 1; i >= 0; i--) {
          const rect = sectionElements[i].el.getBoundingClientRect();
          if (rect.top <= NAVBAR_H + 100) {
            setActiveSection(sectionElements[i].id);
            break;
          }
        }
      });
    }

    initLenis();

    return () => {
      lenis?.destroy();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [tocItems]);

  return (
    <NavigationWheel
      sections={sections}
      activeSection={activeSection}
      scrollDirection={scrollDir}
      wheelTop={wheelTop}
      lenisRef={lenisRef}
      scrollProgress={scrollProgress}
      isVisible={wheelTop >= 0}
    />
  );
}
