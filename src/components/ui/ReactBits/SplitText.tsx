/**
 * src/components/ReactBits/SplitText.tsx
 *
 * Letter-by-letter staggered reveal component built on Framer Motion variants.
 *
 * Design contract:
 *   - Splits the input text into individual <motion.span> characters.
 *   - Parent <motion.span> acts as a headless stagger conductor — it fires
 *     `animate` when it enters the viewport (`whileInView`) or when the
 *     `animate` prop is driven externally (for scroll-linked contexts).
 *   - Each character transitions from hidden → visible using a custom
 *     cinematic ease-out [0.16, 1, 0.3, 1] — steep deceleration, no bounce.
 *   - The component is a pure presentational primitive: it has no knowledge
 *     of scroll position. Parallax transforms are applied by the parent via
 *     a wrapping `motion.div` with `style={{ y: motionValue }}`.
 *
 * Props:
 *   text        — the string to split
 *   className   — CSS classes forwarded to the outer wrapper span
 *   style       — inline styles forwarded to the outer wrapper span
 *   delay       — stagger delay between each character (seconds, default 0.04)
 *   duration    — per-character animation duration (seconds, default 0.65)
 *   once        — only animate in once on viewport entry (default true)
 *   threshold   — viewport intersection amount to trigger (default 0.3)
 *   animate     — override animate state externally ('hidden' | 'visible')
 */

import { motion, type Variants, type HTMLMotionProps } from 'framer-motion';
import { useMemo } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  /** Pass an external animate string to drive the animation from a parent */
  animate?: 'hidden' | 'visible';
  /** Tag to render each line wrapper as — defaults to 'span' */
  as?: keyof JSX.IntrinsicElements;
}

// ─── Variant definitions ──────────────────────────────────────────────────────

const containerVariants = (stagger: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
    },
  },
});

const charVariants = (duration: number): Variants => ({
  hidden: {
    opacity: 0,
    y: '0.35em',
    rotateX: -20,
  },
  visible: {
    opacity: 1,
    y: '0em',
    rotateX: 0,
    transition: {
      duration,
      ease: [0.16, 1, 0.3, 1],
    },
  },
});

// ─── Component ────────────────────────────────────────────────────────────────

export function SplitText({
  text,
  className,
  style,
  delay = 0.04,
  duration = 0.65,
  once = true,
  threshold = 0.3,
  animate: externalAnimate,
}: SplitTextProps) {
  // Split on every character, keeping spaces as explicit non-breaking entities
  const chars = useMemo(() => Array.from(text), [text]);

  const cVars = useMemo(() => containerVariants(delay), [delay]);
  const letterVars = useMemo(() => charVariants(duration), [duration]);

  // When an external animate prop is provided, use it; otherwise use whileInView
  const animateProps = externalAnimate
    ? {
        initial: 'hidden' as const,
        animate: externalAnimate,
      }
    : {
        initial: 'hidden' as const,
        whileInView: 'visible' as const,
        viewport: { once, amount: threshold },
      };

  return (
    <motion.span
      className={className}
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        ...style,
      }}
      variants={cVars}
      {...animateProps}
      aria-label={text}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={letterVars}
          style={{
            display: 'inline-block',
            // Preserve white-space characters visually
            whiteSpace: char === ' ' ? 'pre' : undefined,
          }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}