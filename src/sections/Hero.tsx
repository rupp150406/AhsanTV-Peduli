/**
 * src/sections/Hero.tsx
 *
 * Cinematic z-index sandwich hero with ReactBits SplitText integration.
 *
 * SplitText is mounted inside the z-10 typography plane and receives an
 * external `animate` prop derived from a one-shot state flag — this lets
 * the letter-by-letter reveal fire on mount while the wrapping motion.div
 * simultaneously handles the scroll-linked linear parallax via useTransform.
 * The two systems are fully decoupled: SplitText owns entrance timing,
 * Framer's useTransform owns scroll positioning. No springs on scroll.
 *
 * Z-Index planes:
 *   z-0   Background sky / landscape image   (translateY 0 → +25%)
 *   z-10  "VISIT INDONESIA" SplitText         (translateY 0 → -60%)
 *   z-20  Foreground volcanic PNG mask         (translateY 0 → -8%)
 *   z-30  UI chrome: slide indicators, columns, SWIPE CTA
 */

import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  type MotionStyle,
} from 'framer-motion';
import { SplitText } from '../components/ui/ReactBits/SplitText';

const COLUMNS = [
  'Siapa yang menyelesaikan kesulitan seorang mukmin dari berbagai kesulitan-kesulitan dunia, niscaya Allah akan memudahkan kesulitan-kesulitannya pada hari Kiamat.',
  'melalui program peduli armalah, setiap uluran tangan hadir untuk merajut kembali harapan mereka yang membutuhkan. bersama ahsan tv, mari menjadi jembatan kebaikan yang menghadirkan senyuman dan meringankan beban sesama di setiap langkah nyata.',
  "ahsan tv peduli bergerak bersama masyarakat untuk mengalirkan bantuan dan kepedulian kepada anak yatim serta kaum dhuafa. mari dukung aksi kemanusiaan ini demi menciptakan masa depan yang lebih baik dan penuh berkah.",
];


export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // One-shot flag: fires the SplitText entrance animation on mount
  const [titleAnimate, setTitleAnimate] = useState<'hidden' | 'visible'>('hidden');
  useEffect(() => {
    const t = setTimeout(() => setTitleAnimate('visible'), 200);
    return () => clearTimeout(t);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

const bgY   = useTransform(scrollYProgress, [0, 1], ['0%', '+25%']);
const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);
const fgY   = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
const uiOp  = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
const uiY   = useTransform(scrollYProgress, [0, 0.45], ['0%', '-18%']);

  const gpu: MotionStyle = { willChange: 'transform' };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ minHeight: '110vh', background: '#050505' }}
    >
      {/* PLANE 0 — Background Sky (z-0) */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY, ...gpu }}>
      <video
        src="https://ahsan.tv/wp-content/uploads/2026/06/ahsan.webm"
        poster="https://media.ahsan.tv/assets/AHSANTV.webp"
        className="w-full h-full object-cover"
        style={{ objectPosition: 'center 30%' }}
        autoPlay
        loop
        muted
        playsInline
      />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(5,5,5,0.05) 0%, rgba(5,5,5,0.18) 38%, rgba(5,5,5,0.62) 68%, #050505 100%)',
          }}
        />
      </motion.div>

      {/* PLANE 1 — "VISIT INDONESIA" SplitText Typography (z-10)
          The motion.div owns scroll parallax. SplitText owns its own entrance.
          overflow:visible on both wrapper and type divs prevents clipping of
          letters as they translate up from below during the entrance animation. */}
      <motion.div
        className="absolute z-10 pointer-events-none"
        style={{
          y: textY,
          ...gpu,
          left: 'clamp(20px, 4.5vw, 72px)',
          top: '16%',
          overflow: 'visible',
        }}
      >
        {(['AHSANTV', 'PEDULI'] as const).map((word, wi) => (
          <div
            key={word}
            className="block leading-[0.82]"
            style={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: 'clamp(76px, 13vw, 192px)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              textTransform: 'uppercase',
              color: '#ffffff',
              textShadow: '0 2px 60px rgba(0,0,0,0.55)',
              overflow: 'visible',
            }}
          >
            <SplitText
              text={word}
              delay={word === 'AHSANTV' ? 0.045 : 0.038}
              duration={0.7}
              animate={titleAnimate}
              style={{
                overflow: 'visible',
                // "INDONESIA" starts after "VISIT" letters have all landed
                transitionDelay: wi === 1 ? '0.32s' : undefined,
              }}
            />
          </div>
        ))}

        {/* Crimson bar entrance — fires after both words have revealed */}
        <motion.div
          className="mt-6"
          style={{
            width: 'clamp(60px, 8vw, 120px)',
            height: '3px',
            background: '#FF2E2E',
            originX: 0,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: titleAnimate === 'visible' ? 1 : 0 }}
          transition={{ duration: 1.0, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      {/* PLANE 2 — Foreground Volcanic PNG Mask (z-20) */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ y: fgY, ...gpu }}
      >
        <img
          src="/assets/hero-foreground.png"
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full"
          style={{ objectFit: 'contain', objectPosition: 'bottom center', minWidth: '100%' }}
          loading="eager"
        />
      </motion.div>

      {/* PLANE 3 — UI Chrome (z-30) */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{ opacity: uiOp, y: uiY, ...gpu }}
      >

        {/* Bottom text columns + SWIPE CTA */}
        <div
          className="absolute w-full"
          style={{
            bottom: '52px',
            paddingLeft: 'clamp(20px, 4.5vw, 72px)',
            paddingRight: 'clamp(20px, 4.5vw, 72px)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pointer-events-auto">
            {COLUMNS.map((text, i) => (
              <motion.p
                key={i}
                className="text-[12.5px] leading-[1.75] max-w-[300px]"
                style={{
                  color: 'rgba(255,255,255,0.80)',
                  fontFamily: 'Inter, sans-serif',
                  textShadow: '0 1px 10px rgba(0,0,0,0.7)',
                }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.75,
                  delay: 1.1 + i * 0.14,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {text}
              </motion.p>
            ))}

            <motion.div
              className="flex flex-col items-start self-end"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 1.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}