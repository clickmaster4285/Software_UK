'use client';

import { useState, useEffect, useRef } from 'react';

// ─── Responsive Geometry ─────────────────────────────────────────────────────
const getSizes = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920;

  if (width < 768) { // Mobile
    return {
      WHEEL_W: 100,
      WHEEL_H: 180,
      R_OUTER: 78,
      R_INNER: 62,
      R_DASH: 70,
      R_LABEL: 45,
      R_TICK_O: 74,
      R_TICK_I: 66,
      FONT_PREV: '8px',
      FONT_CURR: '10px',
      FONT_NEXT: '8px',
      TRUNCATE_PREV: 8,
      TRUNCATE_CURR: 9,
      TRUNCATE_NEXT: 8,
    };
  } else if (width < 1024) { // Tablet
    return {
      WHEEL_W: 130,
      WHEEL_H: 230,
      R_OUTER: 100,
      R_INNER: 80,
      R_DASH: 90,
      R_LABEL: 58,
      R_TICK_O: 95,
      R_TICK_I: 85,
      FONT_PREV: '9px',
      FONT_CURR: '11px',
      FONT_NEXT: '9px',
      TRUNCATE_PREV: 10,
      TRUNCATE_CURR: 11,
      TRUNCATE_NEXT: 10,
    };
  } else { // Desktop - LARGER
    return {
      WHEEL_W: 200,
      WHEEL_H: 360,
      R_OUTER: 158,
      R_INNER: 124,
      R_DASH: 140,
      R_LABEL: 92,
      R_TICK_O: 150,
      R_TICK_I: 132,
      FONT_PREV: '12px',
      FONT_CURR: '16px',
      FONT_NEXT: '12px',
      TRUNCATE_PREV: 14,
      TRUNCATE_CURR: 16,
      TRUNCATE_NEXT: 14,
    };
  }
};

// ─── WheelAnimation with FULL CIRCLE and CLIP PATH ───────────────────────────
export function WheelAnimation({ scrollDirection, scrollProgress, sizes, isAnimatingIn, isAnimatingOut }) {
  const upActive = scrollDirection === 'up';
  const downActive = scrollDirection === 'down';
  const CX = sizes.WHEEL_W;
  const CY = sizes.WHEEL_H / 2;

  // Full wheel rotation (full circle rotates)
  const rotationAngle = scrollProgress * 360;

  // Entrance/exit transforms
  const translateX = isAnimatingIn ? 80 : isAnimatingOut ? 120 : 0;
  const scale = isAnimatingIn ? 0.2 : isAnimatingOut ? 0.1 : 1;
  const rotateExtra = isAnimatingIn ? -30 : isAnimatingOut ? 30 : 0;
  const opacity = isAnimatingIn || isAnimatingOut ? 0 : 1;

  function polar(deg, r) {
    const rad = (deg * Math.PI) / 180;
    return {
      x: CX - r * Math.cos(rad),
      y: CY + r * Math.sin(rad)
    };
  }

  // Full circle path (0° to 360°)
  function fullCirclePath(r) {
    const right = polar(0, r);
    // Draw full circle using two arcs
    return `M ${right.x.toFixed(2)} ${right.y.toFixed(2)} A ${r} ${r} 0 1 1 ${right.x.toFixed(2)} ${right.y.toFixed(2)}`;
  }

  const chevTop = CY - sizes.R_OUTER + 14;
  const chevBot = CY + sizes.R_OUTER - 14;

  // Clip path that only shows the LEFT-FACING semicircle (bulging left)
  // This clip region is a rectangle that covers the left side of the wheel + the arc area
  const clipId = `wheel-clip-${sizes.WHEEL_W}`;

  return (
    <svg
      viewBox={`0 0 ${sizes.WHEEL_W} ${sizes.WHEEL_H}`}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'visible',
        transform: `translateX(${translateX}px) scale(${scale}) rotate(${rotateExtra}deg)`,
        transformOrigin: `${CX}px ${CY}px`,
        transition: isAnimatingIn || isAnimatingOut
          ? 'transform 0.5s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.4s ease'
          : 'none',
        opacity: opacity,
      }}
    >
      <defs>
        {/* Clip path: only keep the right half of the circle? No, we want left-facing semicircle.
            The visible part is everything to the LEFT of the vertical line at x = CX,
            but also including the arc area that bulges left. Actually we want to show 
            the full left side of the circle. Simplest: clip to a rectangle from x=0 to x=CX+R_OUTER.
            But to prevent showing the part that goes too far right, we clip to a shape that follows the arc.
            Better: clip to the full SVG width since the circle's left part is already limited. */}
        {/* Actually we want to hide the part of the circle that extends to the right of the flat edge.
            The flat edge is at x = CX. So we clip everything to the left of CX + small margin. */}
        <clipPath id={clipId}>
          <rect x={0} y={0} width={CX + sizes.R_OUTER} height={sizes.WHEEL_H} />
        </clipPath>
      </defs>

      {/* Fixed background fill - only semicircle area */}
      <path
        d={`M ${CX} ${CY - sizes.R_OUTER} A ${sizes.R_OUTER} ${sizes.R_OUTER} 0 0 0 ${CX} ${CY + sizes.R_OUTER} Z`}
        fill="rgba(255,255,255,0.06)"
      />

      {/* Fixed flat edge line */}
      <line
        x1={CX} y1={CY - sizes.R_OUTER}
        x2={CX} y2={CY + sizes.R_OUTER}
        stroke="#BFC5CC"
        strokeWidth={sizes.WHEEL_W > 150 ? 2.5 : 2}
      />

      {/* ROTATING WHEEL GROUP - full circle, clipped to show only left side */}
      <g
        style={{
          transform: `rotate(${rotationAngle}deg)`,
          transformOrigin: `${CX}px ${CY}px`,
        }}
        clipPath={`url(#${clipId})`}
      >
        {/* Outer full circle border */}
        <path
          d={fullCirclePath(sizes.R_OUTER)}
          fill="none"
          stroke="#BFC5CC"
          strokeWidth={sizes.WHEEL_W > 150 ? 3.5 : 2.5}
          strokeLinecap="round"
        />

        {/* Inner full circle border */}
        <path
          d={fullCirclePath(sizes.R_INNER)}
          fill="none"
          stroke="#BFC5CC"
          strokeWidth={sizes.WHEEL_W > 150 ? 2.5 : 2}
          strokeLinecap="round"
        />

        {/* Dashed texture ring (full circle) */}
        <path
          d={fullCirclePath(sizes.R_DASH)}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={sizes.WHEEL_W > 150 ? 3 : 2.5}
          strokeDasharray={sizes.WHEEL_W > 150 ? "10 16" : "8 14"}
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Tick marks - full circle (every 15°) */}
        {Array.from({ length: 24 }, (_, i) => i * 15 - 90).map((angle) => {
          const inner = polar(angle, sizes.R_TICK_I);
          const outer = polar(angle, sizes.R_TICK_O);
          return (
            <line
              key={angle}
              x1={inner.x.toFixed(2)} y1={inner.y.toFixed(2)}
              x2={outer.x.toFixed(2)} y2={outer.y.toFixed(2)}
              stroke="#C8CDD2"
              strokeWidth={sizes.WHEEL_W > 150 ? 2 : 1.5}
              strokeLinecap="round"
            />
          );
        })}

        {/* Spokes - full circle (every 15°) */}
        {Array.from({ length: 24 }, (_, i) => i * 15).map((angle) => {
          const tip = polar(angle, sizes.R_INNER - 2);
          return (
            <line
              key={angle}
              x1={CX} y1={CY}
              x2={tip.x.toFixed(2)} y2={tip.y.toFixed(2)}
              stroke="#D0D5DA"
              strokeWidth={sizes.WHEEL_W > 150 ? 1.2 : 1}
              opacity="0.4"
            />
          );
        })}
      </g>

      {/* Fixed chevron arrows - don't rotate */}
      <g transform={`translate(${CX - (sizes.WHEEL_W > 150 ? 26 : 18)}, ${chevTop})`}>
        <polyline
          points={sizes.WHEEL_W > 150 ? "-8,14  0,5  8,14" : "-6,11  0,4  6,11"}
          fill="none"
          stroke={upActive ? 'var(--accent)' : '#9CA3AF'}
          strokeWidth={upActive ? (sizes.WHEEL_W > 150 ? 3 : 2.5) : (sizes.WHEEL_W > 150 ? 2.5 : 2)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={sizes.WHEEL_W > 150 ? "-8,22  0,13  8,22" : "-6,19  0,12  6,19"}
          fill="none"
          stroke={upActive ? 'var(--accent)' : '#9CA3AF'}
          strokeWidth={upActive ? (sizes.WHEEL_W > 150 ? 2.5 : 2) : (sizes.WHEEL_W > 150 ? 2 : 1.5)}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={upActive ? 0.85 : 0.45}
        />
      </g>

      <g transform={`translate(${CX - (sizes.WHEEL_W > 150 ? 26 : 18)}, ${chevBot})`}>
        <polyline
          points={sizes.WHEEL_W > 150 ? "-8,-14  0,-5  8,-14" : "-6,-11  0,-4  6,-11"}
          fill="none"
          stroke={downActive ? 'var(--accent)' : '#9CA3AF'}
          strokeWidth={downActive ? (sizes.WHEEL_W > 150 ? 3 : 2.5) : (sizes.WHEEL_W > 150 ? 2.5 : 2)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={sizes.WHEEL_W > 150 ? "-8,-22  0,-13  8,-22" : "-6,-19  0,-12  6,-19"}
          fill="none"
          stroke={downActive ? 'var(--accent)' : '#9CA3AF'}
          strokeWidth={downActive ? (sizes.WHEEL_W > 150 ? 2.5 : 2) : (sizes.WHEEL_W > 150 ? 2 : 1.5)}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={downActive ? 0.85 : 0.45}
        />
      </g>

      {/* Hub dot */}
      <circle cx={CX} cy={CY} r={sizes.WHEEL_W > 150 ? 11 : 7} fill="var(--accent)" />
      <circle cx={CX} cy={CY} r={sizes.WHEEL_W > 150 ? 5 : 3} fill="white" opacity="0.9" />
    </svg>
  );
}

// ─── NavigationWheel ──────────────────────────────────────────────────────────
export function NavigationWheel({ sections, activeSection, scrollDirection, wheelTop, lenisRef, scrollProgress, isVisible }) {
  const [sizes, setSizes] = useState(null);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const prevVisibleRef = useRef(false);

  useEffect(() => {
    const handleResize = () => setSizes(getSizes());
    const raf = requestAnimationFrame(handleResize);
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle entrance and exit animations
  useEffect(() => {
    if (!sizes) return;

    if (isVisible && !prevVisibleRef.current) {
      // Becoming visible - animate in
      setIsAnimatingOut(false);
      setIsAnimatingIn(true);
      setShouldRender(true);

      const timer = setTimeout(() => {
        setIsAnimatingIn(false);
      }, 500);

      return () => clearTimeout(timer);
    }
    else if (!isVisible && prevVisibleRef.current) {
      // Becoming hidden - animate out
      setIsAnimatingIn(false);
      setIsAnimatingOut(true);

      const timer = setTimeout(() => {
        setIsAnimatingOut(false);
        setShouldRender(false);
      }, 500);

      return () => clearTimeout(timer);
    }

    prevVisibleRef.current = isVisible;
  }, [isVisible, sizes]);

  // Initial render check
  useEffect(() => {
    if (isVisible && !shouldRender) {
      const initTimer = setTimeout(() => {
        setShouldRender(true);
        setIsAnimatingIn(true);
      }, 0);
      const timer = setTimeout(() => setIsAnimatingIn(false), 500);
      return () => {
        clearTimeout(initTimer);
        clearTimeout(timer);
      };
    }
  }, [isVisible, shouldRender]);

  if (!sizes) return null;
  if (!shouldRender && !isVisible && !isAnimatingIn) return null;

  const activeIdx = sections.findIndex((s) => s.id === activeSection);
  const prevSection = activeIdx > 0 ? sections[activeIdx - 1] : null;
  const currSection = activeIdx >= 0 ? sections[activeIdx] : null;
  const nextSection = activeIdx < sections.length - 1 ? sections[activeIdx + 1] : null;

  const CX = sizes.WHEEL_W;
  const CY = sizes.WHEEL_H / 2;

  function polar(deg, r) {
    const rad = (deg * Math.PI) / 180;
    return {
      x: CX - r * Math.cos(rad),
      y: CY + r * Math.sin(rad)
    };
  }

  const truncate = (str, n) => str && str.length > n ? str.slice(0, n) + '…' : str;

  const prevPx = polar(-55, sizes.R_LABEL);
  const currPx = polar(0, sizes.R_LABEL);
  const nextPx = polar(55, sizes.R_LABEL);

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef?.current) {
      lenisRef.current.scrollTo(el, { offset: -80, duration: 0.6 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const labelOpacity = isAnimatingIn || isAnimatingOut ? 0 : 1;

  return (
    <div
      className="fixed right-0 z-50"
      style={{
        top: wheelTop,
        width: sizes.WHEEL_W,
        height: sizes.WHEEL_H,
        pointerEvents: isVisible && !isAnimatingIn && !isAnimatingOut ? 'auto' : 'none',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <WheelAnimation
          scrollDirection={scrollDirection}
          scrollProgress={scrollProgress}
          sizes={sizes}
          isAnimatingIn={isAnimatingIn}
          isAnimatingOut={isAnimatingOut}
        />
      </div>

      <div style={{
        opacity: labelOpacity,
        transition: 'opacity 0.2s ease',
      }}>
        {prevSection && (
          <button
            onClick={() => scrollTo(prevSection.id)}
            style={{
              position: 'absolute',
              left: prevPx.x,
              top: prevPx.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <span style={{
              display: 'block',
              whiteSpace: 'nowrap',
              fontSize: sizes.FONT_PREV,
              fontWeight: 500,
              lineHeight: 1.2,
              color: '#8A9099',
            }}>
              {truncate(prevSection.label, sizes.TRUNCATE_PREV)}
            </span>
          </button>
        )}

        {currSection && (
          <div
            style={{
              position: 'absolute',
              left: currPx.x,
              top: currPx.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              pointerEvents: 'none',
            }}
          >
            <span style={{
              display: 'block',
              whiteSpace: 'nowrap',
              fontSize: sizes.FONT_CURR,
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'var(--accent)',
            }}>
              {truncate(currSection.label, sizes.TRUNCATE_CURR)}
            </span>
          </div>
        )}

        {nextSection && (
          <button
            onClick={() => scrollTo(nextSection.id)}
            style={{
              position: 'absolute',
              left: nextPx.x,
              top: nextPx.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <span style={{
              display: 'block',
              whiteSpace: 'nowrap',
              fontSize: sizes.FONT_NEXT,
              fontWeight: 500,
              lineHeight: 1.2,
              color: '#8A9099',
            }}>
              {truncate(nextSection.label, sizes.TRUNCATE_NEXT)}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}