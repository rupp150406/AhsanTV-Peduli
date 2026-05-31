/**
 * src/sections/Destinations.tsx
 *
 * Destination cards in a fluid GSAP-driven Masonry layout with the full
 * TiltedCard 3D interior intact via Masonry's renderItem render prop.
 */

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { TiltedCard } from '../components/ui/ReactBits/TiltedCard';
import ScrollVelocity from '../components/ScrollVelocity';
import VariableProximity from '../components/VariableProximity';
import Masonry from '../components/Masonry';
import type { Item as MasonryItem } from '../components/Masonry';
import GradientText from '../components/GradientText'

// ── Source data ───────────────────────────────────────────────────────────────
const DESTINATIONS = [
  { rank: '01', label: '1st place', name: 'Barang Bekas Berkualitas',  image: 'https://ahsan.tv/wp-content/uploads/2026/05/docs-1.webp' },
  { rank: '02', label: '2nd place', name: 'Qurban AhsanTV', image: 'https://ahsan.tv/wp-content/uploads/2026/05/docs-2.webp' },
  { rank: '03', label: '3rd place', name: 'Qurban AhsanTV',   image: 'https://ahsan.tv/wp-content/uploads/2026/05/docs-3.webp' },
  { rank: '04', label: '4th place', name: 'Qurban AhsanTV',        image: 'https://ahsan.tv/wp-content/uploads/2026/05/docs-4.webp' },
  { rank: '05', label: '5th place', name: 'Armalah',                  image: 'https://ahsan.tv/wp-content/uploads/2026/05/docs-5.webp' },
  { rank: '06', label: '6th place', name: 'Armalah',                   image: 'https://ahsan.tv/wp-content/uploads/2026/05/docs-6.webp' },
  { rank: '07', label: '7th place', name: 'Armalah',                  image: 'https://ahsan.tv/wp-content/uploads/2026/05/docs-7.webp' },
  { rank: '08', label: '8th place', name: 'Armalah',                  image: 'https://ahsan.tv/wp-content/uploads/2026/05/docs-8.webp' },
  { rank: '09', label: '9th place', name: 'Armalah',                  image: 'https://ahsan.tv/wp-content/uploads/2026/05/docs-9.webp' },
  { rank: '10', label: '10th place', name: 'Armalah',                  image: 'https://ahsan.tv/wp-content/uploads/2026/05/docs-10.webp' },
  { rank: '11', label: '11th place', name: 'Armalah',                  image: 'https://ahsan.tv/wp-content/uploads/2026/05/docs-11.webp' },
  { rank: '12', label: '12th place', name: 'Armalah',                  image: 'https://ahsan.tv/wp-content/uploads/2026/05/docs-12.webp' },
] as const;

// ── Type helpers ──────────────────────────────────────────────────────────────

type DestItem = {
  id:     string;
  img:    string;
  url:    string;
  height: number;
  rank:   string;
  label:  string;
  name:   string;
};

export default function Destinations() {
  const containerRef = useRef<HTMLElement | null>(null);

  // Pola variasi tinggi asimetris murni portrait
  const BASE_HEIGHTS = [400, 520, 450, 560];

  const MASONRY_ITEMS: MasonryItem[] = DESTINATIONS.map((dest, idx) => ({
    id:     dest.rank,
    img:    dest.image,
    url:    '#',
    height: BASE_HEIGHTS[idx % BASE_HEIGHTS.length],
    rank:   dest.rank,
    label:  dest.label,
    name:   dest.name,
  }));

  return (
    <section
      ref={containerRef as React.RefObject<HTMLElement>}
      id="dokumentasi"
      className="relative w-full bg-[#050505]"
      style={{
        paddingTop:    '120px',
        paddingBottom: '100px',
        paddingLeft:   'clamp(20px, 4.5vw, 72px)',
        paddingRight:  'clamp(20px, 4.5vw, 72px)',
      }}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* ── Section header ────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col items-center mb-16"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <GradientText
            colors={["#1F4326","#46751C","#8FC325"]}
            animationSpeed={2}
            showBorder={false}
          >
            Bingung? Ini rekomendasinya
          </GradientText>

          <div className="mb-12 flex justify-center">
            <div
              role="heading"
              aria-level={2}
              className="text-white lowercase font-semibold tracking-[-0.01em] text-center"
              style={{
                fontSize:   'clamp(26px, 3.8vw, 66px)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <VariableProximity
                containerRef={containerRef}
                label="Dokumentasi Armalah"
                fromFontVariationSettings="'wght' 400, 'slnt' 0"
                toFontVariationSettings="'wght' 900, 'slnt' -10"
                radius={100}
                falloff="linear"
                className="cursor-default"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>

          <motion.div
            style={{ marginTop: 16, width: 48, height: 2, background: '#FF2E2E', originX: 0.5 }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>

        {/* ── Masonry card grid ─────────────────────────────────────────── */}
        {/* min-h-[700px] dilepas diganti h-auto/relative karena tinggi disuntik dinamis dari dalam */}
        <div className="w-full relative h-auto">
          <Masonry
            items={MASONRY_ITEMS}
            animateFrom="bottom"
            stagger={0.08}
            blurToFocus={true}
            scaleOnHover={true}
            renderItem={(rawItem) => {
              const item = rawItem as unknown as DestItem;

              return (
                <div className="w-full h-full overflow-hidden rounded group relative">
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
                      src={item.img}
                      alt={item.name}
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
                        fontFamily:    'Oswald, sans-serif',
                        fontSize:      '13px',
                        color:         '#FF2E2E',
                        letterSpacing: '0.10em',
                        fontWeight:    700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.rank}
                    </div>

                    {/* Text block */}
                    <div
                      className="absolute bottom-0 left-0 right-0 z-10 p-6"
                      style={{ transform: 'translateZ(16px)' }}
                    >
                      <p
                        className="text-white text-[13.5px] font-semibold mb-1"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="text-[12.5px] lowercase"
                        style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, sans-serif' }}
                      >
                        {item.name}
                      </p>

                      {/* Crimson accent bar */}
                      <div
                        className="mt-3 h-[2px] bg-[#FF2E2E] w-0 group-hover:w-full"
                        style={{ transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1)' }}
                      />
                    </div>

                    {/* Inset crimson glow border */}
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
                </div>
              );
            }}
          />
        </div>

        {/* Garis batas ini sekarang otomatis terdorong ke bawah dengan aman */}
        <div
          className="w-full mt-16 pb-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
        />
      </div>

      <ScrollVelocity
        texts={['AhsanTV', 'Peduli']}
        velocity={100}
        className="custom-scroll-text"
        numCopies={10}
        damping={50}
        stiffness={100}
      />
    </section>
  );
}