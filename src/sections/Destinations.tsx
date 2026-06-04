/**
 * src/sections/Destinations.tsx
 *
 * Masonry grid dokumentasi dengan TiltedCard 3D interior UTUH persis aslinya.
 * Ditambahkan: klik kartu → modal IOSAppStoreCard (shared-layout iOS animation).
 *
 * Strategi integrasi:
 *  - Masonry + renderItem + TiltedCard → TIDAK DIUBAH sama sekali
 *  - State `activeCard` ditambahkan di level Destinations
 *  - Modal IOSAppStoreCard di-render di luar Masonry (fixed overlay)
 *  - Kartu kecil (idle) menggunakan layoutId identik → framer-motion
 *    menghubungkan keduanya dengan shared layout animation
 *
 * [v2] Data source: Supabase — tabel `destinations`
 *  - Hardcoded array dihapus, diganti fetch dari Supabase Client
 *  - UI, layout, animasi, modal, dan pencegahan open-tab TIDAK DIUBAH
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { TiltedCard } from '../components/ui/ReactBits/TiltedCard';
import ScrollVelocity from '../components/ScrollVelocity';
import VariableProximity from '../components/VariableProximity';
import Masonry from '../components/Masonry';
import type { Item as MasonryItem } from '../components/Masonry';
import GradientText from '../components/GradientText';
import { createClient } from '@supabase/supabase-js';

// ── Spring config identik iOS UIKit ──────────────────────────────────────────
const spring = { type: 'spring', damping: 30, stiffness: 180 } as const;

// ── Type: baris dari tabel Supabase `destinations` ───────────────────────────
// Kolom `desc` dikutip karena reserved word di PostgreSQL → Supabase
// mengembalikannya sebagai key string biasa di JS.
type DestData = {
  id:    number;
  rank:  string;
  label: string;
  name:  string;
  image: string;
  desc:  string;
};

// ── Type helper untuk item yang di-cast dari Masonry rawItem ─────────────────
type DestItem = {
  id:     string;
  img:    string;
  url?:   string;
  height: number;
  rank:   string;
  label:  string;
  name:   string;
};

// ── Pola variasi tinggi asimetris portrait ───────────────────────────────────
const BASE_HEIGHTS = [400, 520, 450, 560];

// ── Komponen modal (IDENTIK asli — tidak ada perubahan) ──────────────────────
function DocModal({
  card,
  onClose,
}: {
  card: DestData;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Modal container — layoutId menyambung dari kartu kecil */}
      <motion.div
        layoutId={`card-container-${card.rank}`}
        transition={spring}
        className="relative z-10 h-full w-full max-w-2xl bg-[#1c1c1e] text-white shadow-2xl overflow-y-auto sm:h-[85vh] sm:rounded-3xl"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Hero area */}
        <div className="relative flex h-[45vh] w-full flex-col justify-end p-6" >
          <motion.img
            layoutId={`card-image-${card.rank}`}
            transition={spring}
            src={card.image}
            alt={card.name}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          />

          {/* Gradient legibility */}
          <div
            className="absolute inset-0 pointer-events-none"
          />

          {/* Close button */}

          {/* Judul mengambang di atas gambar */}
          <div className="relative z-10">
            <motion.span
              layoutId={`card-cat-${card.rank}`}
              transition={spring}
              className="block text-[11px] font-bold uppercase tracking-widest text-[#FF2E2E]"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              {card.rank} · {card.label}
            </motion.span>
            <motion.h2
              layoutId={`card-title-${card.rank}`}
              transition={spring}
              className="mt-1 text-3xl font-extrabold leading-tight text-white md:text-4xl [text-shadow:_0_2px_4px_rgba(0,0,0,0.8),_0_6px_12px_rgba(0,0,0,0.6)]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {card.name}
            </motion.h2>
          </div>
        </div>

        {/* Info bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#1c1c1e]">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#FF2E2E] font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
              AhsanTV
            </p>
            <p className="text-xs text-white/60 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
              Dokumentasi Program
            </p>
          </div>
        </div>

        {/* Deskripsi */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22 }}
          className="px-6 py-6 text-sm leading-relaxed text-white/70 space-y-4 bg-[#1c1c1e]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <p>{card.desc}</p>
          
        </motion.div>
        
      </motion.div>
    </div>
  );
}

// ── Loading skeleton — ditampilkan saat data Supabase belum tiba ──────────────
function MasonrySkeleton() {
  const heights = [400, 520, 450, 560, 400, 520];
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
      {heights.map((h, i) => (
        <div
          key={i}
          className="mb-4 w-full rounded-xl bg-white/5 animate-pulse break-inside-avoid"
          style={{ height: h }}
        />
      ))}
    </div>
  );
}

// ── Section utama ─────────────────────────────────────────────────────────────
export default function Destinations() {
  const containerRef = useRef<HTMLElement | null>(null);
  const [activeCard, setActiveCard]       = useState<DestData | null>(null);

  // ── State Supabase ──────────────────────────────────────────────────────────
  const [destinations, setDestinations]   = useState<DestData[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);

  // ── Fetch data saat mount ───────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchDestinations() {
      try {
        const { data, error: sbError } = await createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
          .from('destinations')
          .select('id, rank, label, name, image, desc')
          .order('rank', { ascending: true });

        if (cancelled) return;

        if (sbError) throw sbError;

        setDestinations(data as DestData[]);
      } catch (err) {
        if (!cancelled) {
          console.error('[Destinations] Supabase fetch error:', err);
          setError('Gagal memuat data dokumentasi.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDestinations();
    return () => { cancelled = true; };
  }, []);

  // ── Bangun MASONRY_ITEMS dari data Supabase (identik pola asli) ─────────────
  const MASONRY_ITEMS: MasonryItem[] = destinations.map((dest, idx) => ({
    id:     dest.rank,
    img:    dest.image,
    url:    '',                                       // '' → mencegah open-tab bawaan Masonry
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

        {/* ── Section header — TIDAK DIUBAH ──────────────────────────────── */}
        <motion.div
          className="flex flex-col items-center mb-16"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <GradientText
            colors={["#1F4326","#46751C","#8FC325"]}
            animationSpeed={1}
            showBorder={false}
          >
            Karena Peduli Adalah Solusi
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
                label="AHSANTV PEDULI NEWS"
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
        <div className="w-full relative h-auto">

          {/* Loading state */}
          {loading && <MasonrySkeleton />}

          {/* Error state */}
          {!loading && error && (
            <p className="text-center text-white/40 py-20" style={{ fontFamily: 'Inter, sans-serif' }}>
              {error}
            </p>
          )}

          {/* Data siap — Masonry + renderItem IDENTIK asli ─────────────── */}
          {!loading && !error && destinations.length > 0 && (
            <Masonry
              items={MASONRY_ITEMS}
              animateFrom="bottom"
              stagger={0.08}
              blurToFocus={true}
              scaleOnHover={true}
              renderItem={(rawItem) => {
                const item     = rawItem as unknown as DestItem;
                // Lookup data lengkap (termasuk `desc`) dari state Supabase
                const destData = destinations.find((d) => d.rank === item.rank)!;

                return (
                  <motion.div
                    layoutId={`card-container-${item.rank}`}
                    transition={spring}
                    className="w-full h-full overflow-hidden rounded group relative cursor-pointer"
                    onClick={(e) => {
                      // ── KUNCI FIX: mencegah open-tab bawaan Masonry ──────
                      e.preventDefault();
                      e.stopPropagation();
                      // ─────────────────────────────────────────────────────
                      setActiveCard(destData);
                    }}
                    whileTap={{ scale: 0.98 }}
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
                      <motion.img
                        layoutId={`card-image-${item.rank}`}
                        transition={spring}
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
                      <motion.div
                        layoutId={`card-cat-${item.rank}`}
                        transition={spring}
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
                      </motion.div>

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
                        <motion.p
                          layoutId={`card-title-${item.rank}`}
                          transition={spring}
                          className="text-[12.5px] lowercase"
                          style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, sans-serif' }}
                        >
                          {item.name}
                        </motion.p>

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

                      {/* CTA badge */}
                    </TiltedCard>
                  </motion.div>
                );
              }}
            />
          )}
        </div>

        {/* Divider bawah */}
        <div
          className="w-full mt-16 pb-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
        />
      </div>

      <ScrollVelocity
        texts={['AhsanTV', 'Peduli']}
        velocity={100}
        className="custom-scroll-text"
        numCopies={12}
        damping={50}
        stiffness={100}
      />

      {/* ── Modal — di-render di luar Masonry ─────────────────────────── */}
      <AnimatePresence>
        {activeCard && (
          <DocModal
            card={activeCard}
            onClose={() => setActiveCard(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}