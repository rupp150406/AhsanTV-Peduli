/**
 * src/components/ReactBits/BlurText.tsx
 *
 * Word-by-word blur-fade reveal component.
 *
 * Each word fades in from a blurred, slightly translated state to crisp
 * full opacity. Ideal for body copy and sub-headings where a letter-by-letter
 * split would be too granular. Uses a blur filter transition via
 * `filter: blur(Npx)` rather than CSS `backdrop-filter` — this targets the
 * element itself, not its background.
 *
 * Props:
 *   text       — the string to split by word
 *   className  — CSS classes for the outer wrapper
 *   style      — inline styles for the outer wrapper
 *   delay      — stagger delay between words (seconds, default 0.08)
 *   duration   — per-word animation duration (seconds, default 0.7)
 *   blurAmount — starting blur intensity in px (default 8)
 *   once       — only animate on first viewport intersection (default true)
 *   threshold  — viewport amount to trigger (default 0.25)
 */

import { motion, type Variants } from 'framer-motion';
import { useMemo } from 'react';

interface BlurTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
  blurAmount?: number;
  once?: boolean;
  threshold?: number;
}

const containerVariants = (stagger: number): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger },
  },
});

const wordVariants = (duration: number, blur: number): Variants => ({
  hidden: {
    opacity: 0,
    y: 12,
    filter: `blur(${blur}px)`,
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration,
      ease: [0.16, 1, 0.3, 1],
    },
  },
});

export function BlurText({
  text,
  className,
  style,
  delay = 0.08,
  duration = 0.7,
  blurAmount = 8,
  once = true,
  threshold = 0.25,
}: BlurTextProps) {
  const words = useMemo(() => text.split(' '), [text]);
  const cVars = useMemo(() => containerVariants(delay), [delay]);
  const wVars = useMemo(() => wordVariants(duration, blurAmount), [duration, blurAmount]);

  return (
    <motion.span
      className={className}
      style={{ display: 'inline', ...style }}
      variants={cVars}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wVars}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
          aria-hidden="true"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}