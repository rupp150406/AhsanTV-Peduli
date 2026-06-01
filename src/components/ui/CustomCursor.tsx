/**
 * src/components/CustomCursor.tsx
 *
 * High-fidelity hardware-accelerated custom cursor.
 *
 * Two visual states:
 *   Default  — 8px solid white dot, mix-blend-mode: difference
 *   Expanded — 40px hollow ring with 1px crimson border
 *
 * Tracking uses Framer Motion useSpring on X/Y MotionValues for fluid lerp
 * without a manual rAF loop. Event delegation on document handles hover
 * detection cheaply (one closest() call per mouseover, not per mousemove).
 * Fully unmounts on touch/mobile viewports via pointer:coarse media query.
 */

import { useEffect, useState } from 'react';
import { motion, useSpring, type SpringOptions } from 'framer-motion';

const SPRING: SpringOptions = { stiffness: 300, damping: 28, mass: 0.5 };
const INTERACTIVE = 'a, button, .interactive-card, [data-cursor-expand]';

export function CustomCursor() {
  const [isMobile, setIsMobile]       = useState(false);
  const [isExpanded, setIsExpanded]   = useState(false);
  const [hasEntered, setHasEntered]   = useState(false);

  const springX = useSpring(0, SPRING);
  const springY = useSpring(0, SPRING);

  // Detect touch devices
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const check = () => setIsMobile(window.innerWidth < 768 || mq.matches);
    check();
    window.addEventListener('resize', check);
    mq.addEventListener('change', check);
    return () => {
      window.removeEventListener('resize', check);
      mq.removeEventListener('change', check);
    };
  }, []);

  // Mouse tracking + hover detection
  useEffect(() => {
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      springX.set(e.clientX);
      springY.set(e.clientY);
      if (!hasEntered) setHasEntered(true);
    };

    const onOver = (e: MouseEvent) => {
      setIsExpanded((e.target as HTMLElement).closest(INTERACTIVE) !== null);
    };

    const onOut = (e: MouseEvent) => {
      const to = e.relatedTarget as HTMLElement | null;
      if (!to || !to.closest(INTERACTIVE)) setIsExpanded(false);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [isMobile, hasEntered, springX, springY]);

  if (isMobile || !hasEntered) return null;

  return (
    <>
      {/* Base dot — mix-blend-mode: difference inverts the background */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      />

      {/* Expanded ring — crimson 1px border, scales in on interactive hover */}
      <motion.div
        aria-hidden="true"
        animate={{
          width:   isExpanded ? 40 : 0,
          height:  isExpanded ? 40 : 0,
          opacity: isExpanded ? 1  : 0,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          borderRadius: '50%',
          border: '1px solid #FF2E2E',
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform, width, height, opacity',
        }}
      />
    </>
  );
}