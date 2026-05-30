/**
 * src/sections/Navbar.tsx   (or src/components/Navbar.tsx — match your import)
 *
 * Lenis-compatible navbar driven entirely by Framer Motion MotionValues.
 *
 * The native window.scrollY listener is replaced by useScroll({ scrollY }),
 * whose values Framer syncs with the same rAF scheduler Lenis uses. All three
 * visual properties (background fill, blur, border opacity) are derived as
 * continuous useTransform pipelines — zero React re-renders during scroll.
 * Nav links are plain <a> tags so CustomCursor's INTERACTIVE_SELECTOR
 * (`a, button, .interactive-card`) matches them natively.
 */

import { useScroll, useTransform, motion, type MotionStyle } from 'framer-motion';

const NAV_LINKS = [
  { label: 'wide sea', href: '#wide-sea' },
  { label: 'mountains', href: '#mountains' },
  { label: 'island', href: '#island' },
] as const;

const THRESHOLD = 80; // px before navbar solidifies

export default function Navbar() {
  const { scrollY } = useScroll();

  const bgColor = useTransform(
    scrollY,
    [0, THRESHOLD],
    ['rgba(5,5,5,0)', 'rgba(5,5,5,0.92)'],
  );
  const backdropBlur = useTransform(
    scrollY,
    [0, THRESHOLD],
    ['blur(0px)', 'blur(12px)'],
  );
  const borderOpacity = useTransform(scrollY, [0, THRESHOLD], [0, 0.18]);

  const navStyle: MotionStyle = {
    backgroundColor: bgColor,
    backdropFilter: backdropBlur,
    WebkitBackdropFilter: backdropBlur,
    paddingLeft: 'clamp(20px, 4.5vw, 72px)',
    paddingRight: 'clamp(20px, 4.5vw, 72px)',
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between"
      style={navStyle}
    >
      {/* Animated hairline border */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-px pointer-events-none"
        style={{ backgroundColor: 'rgba(255,255,255,1)', opacity: borderOpacity }}
      />

      {/* Left — logo mark */}
      <div className="flex items-center gap-2.5">
        <motion.div
          className="w-2 h-2 rounded-full bg-[#FF2E2E]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.span
          className="text-white text-xs font-bold tracking-[0.12em] uppercase"
          style={{ fontFamily: 'Inter, sans-serif' }}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          TRAVEL
        </motion.span>
      </div>

      {/* Right — nav links */}
      <motion.div
        className="hidden sm:flex items-center gap-8"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="relative group text-white text-[13px] lowercase tracking-wide"
            style={{
              fontFamily: 'Inter, sans-serif',
              opacity: 0.80,
              transition: 'opacity 0.25s ease',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.80')
            }
          >
            {label}
            {/* Crimson underline on hover */}
            <span
              className="absolute left-0 -bottom-0.5 h-px w-full bg-[#FF2E2E] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
              aria-hidden="true"
            />
          </a>
        ))}
      </motion.div>
    </motion.nav>
  );
}