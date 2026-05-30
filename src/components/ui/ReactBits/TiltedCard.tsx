/**
 * src/components/ReactBits/TiltedCard.tsx
 *
 * 3D perspective tilt card driven by cursor-relative mouse position.
 *
 * Architecture:
 *   - Uses a `useRef` on the card container to compute the cursor's position
 *     relative to the card's bounding box on `onMouseMove`.
 *   - Normalised cursor coordinates (−1 → +1 in both axes) are mapped to
 *     `rotateX` / `rotateY` degree values via linear interpolation.
 *   - `useSpring` applies gentle damping so the tilt follows the cursor
 *     with a slight physical lag — not instant snapping, not slow lerp.
 *   - On `onMouseLeave`, the springs reset to 0 (flat card).
 *   - A subtle specular highlight overlay (radial gradient) follows the
 *     cursor inside the card to reinforce the 3D depth illusion.
 *   - `transformStyle: 'preserve-3d'` is required on the outer container
 *     for child elements to participate in the 3D space (e.g. floating badges).
 *
 * Props:
 *   children       — card inner content
 *   className      — CSS classes for the outer wrapper
 *   style          — inline styles for the outer wrapper
 *   maxTilt        — maximum tilt angle in degrees (default 12)
 *   perspective    — CSS perspective distance in px (default 800)
 *   scale          — scale factor on hover (default 1.02)
 *   glare          — show specular highlight overlay (default true)
 *   glareOpacity   — max opacity of the glare overlay (default 0.12)
 *   springStiffness / springDamping — spring physics config
 */

import {
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
  type MouseEvent,
} from 'react';
import { motion, useSpring } from 'framer-motion';

interface TiltedCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  glare?: boolean;
  glareOpacity?: number;
  springStiffness?: number;
  springDamping?: number;
}

export function TiltedCard({
  children,
  className = '',
  style,
  maxTilt = 12,
  perspective = 800,
  scale = 1.03,
  glare = true,
  glareOpacity = 0.12,
  springStiffness = 260,
  springDamping = 20,
}: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Spring MotionValues for rotateX / rotateY / scale
  const rotX = useSpring(0, { stiffness: springStiffness, damping: springDamping });
  const rotY = useSpring(0, { stiffness: springStiffness, damping: springDamping });
  const scaleVal = useSpring(1, { stiffness: springStiffness, damping: springDamping });

  // Glare position (percentage strings for the radial gradient center)
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [glareVisible, setGlareVisible] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    // Normalise cursor to −1 … +1 within the card bounds
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    // rotateX: cursor at top → tilt top toward viewer (positive X rotation)
    // rotateY: cursor at right → tilt right toward viewer (positive Y rotation)
    rotX.set(-ny * maxTilt);
    rotY.set(nx * maxTilt);

    // Update glare center (0–100%)
    setGlarePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    scaleVal.set(scale);
    setGlareVisible(true);
  };

  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    scaleVal.set(1);
    setGlareVisible(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        perspective,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card inner — carries the 3D transform */}
      <motion.div
        style={{
          rotateX: rotX,
          rotateY: rotY,
          scale: scaleVal,
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%',
          position: 'relative',
          willChange: 'transform',
        }}
      >
        {children}

        {/* Specular glare overlay */}
        {glare && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              pointerEvents: 'none',
              opacity: glareVisible ? 1 : 0,
              transition: 'opacity 0.3s ease',
              background: `radial-gradient(
                circle at ${glarePos.x}% ${glarePos.y}%,
                rgba(255,255,255,${glareOpacity}) 0%,
                transparent 65%
              )`,
              zIndex: 20,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}