"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play } from "lucide-react";

// ============================================================
// TYPES
// ============================================================
export interface IOSAppStoreCardItem {
  /** Unique identifier — harus unik per kartu */
  id: string;
  /** Label kecil di pojok atas, contoh: "FEATURED APP" */
  category: string;
  /** Judul utama kartu */
  title: string;
  /** Subtitle pendek */
  subtitle: string;
  /** URL gambar hero */
  image: string;
  /** Deskripsi panjang yang tampil di dalam modal */
  description: React.ReactNode;
  /** Konten tambahan opsional di bawah deskripsi utama */
  extraContent?: React.ReactNode;
  /** Label tombol aksi, default: "GET" */
  ctaLabel?: string;
  /** Callback saat tombol CTA diklik */
  onCta?: () => void;
  /** Warna aksen ikon app, default: "bg-blue-600" (Tailwind) */
  iconBg?: string;
  /** Icon custom untuk app icon, default: <Play /> */
  icon?: React.ReactNode;
}

export interface IOSAppStoreCardProps {
  /** Data kartu yang akan dirender */
  card: IOSAppStoreCardItem;
  /** Lebar maksimum kartu (CSS value), default: "28rem" */
  maxWidth?: string;
  /** Tinggi kartu list view, default: "24rem" */
  cardHeight?: string;
  /** Kelas tambahan pada wrapper terluar */
  className?: string;
}

// ============================================================
// SPRING CONFIG — identik dengan iOS UIKit spring
// ============================================================
const springTransition = { type: "spring", damping: 30, stiffness: 180 } as const;

// ============================================================
// KOMPONEN UTAMA
// ============================================================
export function IOSAppStoreCard({
  card,
  maxWidth = "28rem",
  cardHeight = "24rem",
  className = "",
}: IOSAppStoreCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock scroll body saat modal aktif
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const iconBg = card.iconBg ?? "bg-blue-600";
  const ctaLabel = card.ctaLabel ?? "GET";
  const icon = card.icon ?? <Play className="h-5 w-5 text-white fill-white" />;
  const iconLg = card.icon ?? <Play className="h-6 w-6 text-white fill-white" />;

  return (
    <div className={`relative flex w-full items-center justify-center font-sans ${className}`}>

      {/* ── 1. CARD LIST VIEW (IDLE) ─────────────────────────── */}
      <div style={{ width: "100%", maxWidth }}>
        <motion.div
          layoutId={`card-container-${card.id}`}
          transition={springTransition}
          onClick={() => setIsOpen(true)}
          style={{ height: cardHeight }}
          className="relative flex w-full cursor-pointer flex-col justify-between overflow-hidden rounded-3xl bg-[#1c1c1e] p-6 shadow-xl"
          whileTap={{ scale: 0.97 }}
        >
          {/* Hero Image — sedikit di-zoom agar ada efek zoom-out saat buka modal */}
          <motion.img
            layoutId={`card-image-${card.id}`}
            transition={springTransition}
            src={card.image}
            alt={card.title}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            style={{ scale: 1.3 }}
          />

          {/* Gradient readability overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Teks Atas */}
          <div className="relative z-10 flex flex-col pointer-events-none">
            <motion.span
              layoutId={`card-cat-${card.id}`}
              transition={springTransition}
              className="text-[11px] font-bold uppercase tracking-wider text-gray-400"
            >
              {card.category}
            </motion.span>
            <motion.h2
              layoutId={`card-title-${card.id}`}
              transition={springTransition}
              className="mt-1 text-2xl font-bold leading-tight text-white max-w-[280px]"
            >
              {card.title}
            </motion.h2>
          </div>

          {/* Row Bawah */}
          <div className="relative z-10 flex items-center justify-between w-full pointer-events-none">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} shadow-sm`}>
                {icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">
                  {card.title.split(":")[0]}
                </span>
                <motion.p
                  layoutId={`card-sub-${card.id}`}
                  transition={springTransition}
                  className="text-[11px] text-gray-300 max-w-[160px] truncate"
                >
                  {card.subtitle}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`card-btn-${card.id}`}
              transition={springTransition}
              className="rounded-full bg-white/20 px-5 py-1.5 text-xs font-bold text-white backdrop-blur-md"
            >
              {ctaLabel}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── 2. MODAL FULLVIEW ────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-0 sm:p-6">

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              layoutId={`card-container-${card.id}`}
              transition={springTransition}
              className="relative z-10 h-full w-full max-w-2xl bg-[#1c1c1e] text-white shadow-2xl overflow-y-auto sm:h-[85vh] sm:rounded-3xl scrollbar-none"
            >
              {/* Hero Area */}
              <div className="relative flex h-[40vh] w-full flex-col justify-end p-6 sm:h-[45vh]">
                <motion.img
                  layoutId={`card-image-${card.id}`}
                  transition={springTransition}
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                  style={{ scale: 1.0 }}
                />

                {/* Tombol Close */}
                <button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  className="absolute top-6 right-6 z-50 rounded-full bg-black/40 p-2 text-white backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Judul di atas hero */}
                <div className="relative z-10 flex flex-col">
                  <motion.span
                    layoutId={`card-cat-${card.id}`}
                    transition={springTransition}
                    className="text-[11px] font-bold uppercase tracking-wider text-gray-300 drop-shadow-sm"
                  >
                    {card.category}
                  </motion.span>
                  <motion.h2
                    layoutId={`card-title-${card.id}`}
                    transition={springTransition}
                    className="mt-1 text-3xl font-extrabold leading-tight text-white md:text-4xl drop-shadow-md"
                  >
                    {card.title}
                  </motion.h2>
                </div>
              </div>

              {/* Info Bar + CTA */}
              <div className="flex items-center justify-between border-b border-gray-800 p-6 bg-[#1c1c1e]">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} shadow-md`}>
                    {iconLg}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{card.title.split(":")[0]}</h4>
                    <motion.p
                      layoutId={`card-sub-${card.id}`}
                      transition={springTransition}
                      className="text-xs text-gray-400"
                    >
                      {card.subtitle}
                    </motion.p>
                  </div>
                </div>
                <motion.button
                  layoutId={`card-btn-${card.id}`}
                  transition={springTransition}
                  onClick={(e) => { e.stopPropagation(); card.onCta?.(); }}
                  className="rounded-full bg-blue-500 px-6 py-1.5 text-xs font-bold text-white"
                >
                  {ctaLabel}
                </motion.button>
              </div>

              {/* Body Konten */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                className="p-6 text-sm leading-relaxed text-gray-300 md:text-base space-y-4 bg-[#1c1c1e]"
              >
                {typeof card.description === "string"
                  ? <p>{card.description}</p>
                  : card.description}

                {card.extraContent}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default IOSAppStoreCard;