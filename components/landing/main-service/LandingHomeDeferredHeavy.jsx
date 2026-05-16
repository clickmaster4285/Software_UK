'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useRef, useState, ReactNode } from 'react';
import { FinalCTA } from './finalCta';

const pulse96 = () => <div className="h-96 animate-pulse rounded-lg bg-gray-100" />;
const pulse64 = () => <div className="h-64 animate-pulse rounded-lg bg-gray-100" />;

const WhyChooseUs = dynamic(
  () =>
    import('@/src/components/landingPage/home/whyUs').then((m) => m.WhyChooseUs),
  { loading: pulse96, ssr: false },
);
const CommunitySection = dynamic(
  () =>
    import('@/components/landingPage/home/CommunitySection').then((m) => m.CommunitySection),
  { loading: pulse96, ssr: false },
);
const TestimonialsSection = dynamic(
  () =>
    import('@/components/landingPage/home/TestimonialsSection').then((m) => m.TestimonialsSection),
  { loading: pulse96, ssr: false },
);
const HelpSection = dynamic(
  () => import('@/components/landingPage/home/help-section').then((m) => m.HelpSection),
  { loading: pulse64, ssr: false },
);

function deferNonCritical(fn) {
  if (typeof window === 'undefined') return;
  const w = window & { requestIdleCallback: (cb, opts) => number };
  if (typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(fn, { timeout: 2000 });
    return;
  }
  queueMicrotask(fn);
}

/**
 * Mounts `children` only after the placeholder enters the viewport (with margin),
 * so heavy JS chunks are not downloaded or executed during the initial TBT window.
 */
function LoadOnVisible({
  children,
  skeleton,
  minHeightClass,
}) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;
        io.disconnect();
        deferNonCritical(() => setActive(true));
      },
      { root: null, rootMargin: '320px 0px', threshold: 0.01 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`w-full ${minHeightClass}`}>
      {active ? children : skeleton}
    </div>
  );
}

/**
 * Client-only: `ssr: false` + viewport/idle-gated mounts for GSAP / Swiper / Motion-heavy sections.
 * FAQ stays server-rendered via `children` (App Router composition).
 */
export function LandingHomeDeferredHeavy({ children }) {
  const sk96 = <div className="h-96 animate-pulse rounded-lg bg-gray-100" aria-hidden />;
  const sk64 = <div className="h-64 animate-pulse rounded-lg bg-gray-100" aria-hidden />;

  return (
    <>
   


     


      <LoadOnVisible skeleton={sk96} minHeightClass="min-h-96">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-gray-100" />}>
          <TestimonialsSection />
        </Suspense>
      </LoadOnVisible>


         <LoadOnVisible skeleton={sk96} minHeightClass="min-h-96">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-white" />}>
         <div className=' bg-white'> <WhyChooseUs /></div>
        </Suspense>
      </LoadOnVisible>
      

       {/* <LoadOnVisible skeleton={sk96} minHeightClass="min-h-96">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-gray-100" />}>
          <div className='mx-10 bg-white'>   <CommunitySection /></div>
        </Suspense>
      </LoadOnVisible> */}


      {children}
      <LoadOnVisible skeleton={sk64} minHeightClass="min-h-64">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-gray-100" />}>
          <HelpSection />
          <FinalCTA/>
        </Suspense>
      </LoadOnVisible>


      
    </>
  );
}
