/**
 * src/sections/Destinations.tsx
 *
 * Destination cards rebuilt with ReactBits TiltedCard for 3D tactile feedback.
 *
 * Each card is wrapped by TiltedCard which applies a cursor-driven perspective
 * tilt via useSpring. The Framer Motion stagger orchestration (parent variants
 * with staggerChildren: 0.15) is preserved on the outer motion.article —
 * TiltedCard sits inside that element so the viewport entry animation and
 * the interactive tilt compose without conflict. The crimson inset-border glow
 * and accent bar hover states are rendered as children inside TiltedCard's
 * preserve-3d space, giving them subtle Z-lift as part of the 3D scene.
 */

import { motion } from 'framer-motion';
import { TiltedCard } from '../components/ui/ReactBits/TiltedCard';
const DESTINATIONS = [
  { rank: '01', label: '1st place', name: 'Nusa Lembongan Island',   image: 'https://ahsan.tv/wp-content/uploads/2026/05/dest-nusa-lembongan.webp' },
  { rank: '02', label: '2nd place', name: 'Pura Ulun Bedugul Bali',  image: 'https://ahsan.tv/wp-content/uploads/2026/05/dest-pura-ulun.webp'      },
  { rank: '03', label: '3rd place', name: 'Piyaynemo Raja Ampat',    image: 'https://ahsan.tv/wp-content/uploads/2026/05/dest-piyaynemo.webp'      },
  { rank: '04', label: '4th place', name: 'Gunung Kelimutu',         image: 'https://ahsan.tv/wp-content/uploads/2026/05/dest-kelimutu.webp'       },
] as const;

// ── Stagger orchestration variants ───────────────────────────────────────────
const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Destinations() {
  return (
    <section
      id="destination-recommendations"
      className="relative w-full bg-[#050505]"
      style={{
        paddingTop: '120px',
        paddingBottom: '100px',
        paddingLeft: 'clamp(20px, 4.5vw, 72px)',
        paddingRight: 'clamp(20px, 4.5vw, 72px)',
      }}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Section header */}
        <motion.div
          className="flex flex-col items-center mb-16"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            className="text-[13px] lowercase mb-3 tracking-[0.06em]"
            style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif' }}
          >
            confusion? These recommendation
          </p>
          <h2
            className="text-white lowercase font-semibold tracking-[-0.01em] text-center"
            style={{ fontSize: 'clamp(26px, 3.8vw, 46px)', fontFamily: 'Inter, sans-serif' }}
          >
            destination recommendations
          </h2>
          <motion.div
            style={{ marginTop: 16, width: 48, height: 2, background: '#FF2E2E', originX: 0.5 }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>

        {/* Card grid — parent orchestrates stagger timing */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {DESTINATIONS.map((dest) => (
            /*
             * motion.article carries the viewport stagger variant.
             * TiltedCard sits inside it and owns the 3D tilt interaction.
             * This separation keeps the two animation systems independent.
             */
            <motion.article
              key={dest.rank}
              variants={cardVariants}
              style={{ aspectRatio: '3/4' }}
              className="interactive-card"
            >
              <TiltedCard
                className="w-full h-full rounded overflow-hidden"
                maxTilt={10}
                perspective={900}
                scale={1.03}
                glare={true}
                glareOpacity={0.10}
                springStiffness={240}
                springDamping={18}
              >
                {/* Background image */}
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Dark gradient for legibility */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.22) 45%, transparent 65%)',
                  }}
                />

                {/* Rank badge */}
                <div
                  className="absolute top-5 left-5 z-10"
                  style={{
                    fontFamily: 'Oswald, sans-serif',
                    fontSize: '13px',
                    color: '#FF2E2E',
                    letterSpacing: '0.10em',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {dest.rank}
                </div>

                {/* Text block — bottom-left, sits in 3D space */}
                <div
                  className="absolute bottom-0 left-0 right-0 z-10 p-6"
                  style={{ transform: 'translateZ(16px)' }}  // lifts text slightly in 3D space
                >
                  <p
                    className="text-white text-[13.5px] font-semibold mb-1"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {dest.label}
                  </p>
                  <p
                    className="text-[12.5px] lowercase"
                    style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, sans-serif' }}
                  >
                    {dest.name}
                  </p>

                  {/* Crimson accent bar — CSS hover via group */}
                  <div
                    className="mt-3 h-[2px] bg-[#FF2E2E] w-0 group-hover:w-full"
                    style={{ transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1)' }}
                  />
                </div>

                {/* Inset crimson glow border on hover — CSS transition */}
                <div
                  className="absolute inset-0 rounded pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 0 0px rgba(255,46,46,0)',
                    transition: 'box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      'inset 0 0 0 1px rgba(255,46,46,0.65)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      'inset 0 0 0 0px rgba(255,46,46,0)';
                  }}
                />
              </TiltedCard>
            </motion.article>
          ))}
        </motion.div>

        <div
          className="w-full mt-16"
          style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
        />
      </div>
    </section>
  );
}