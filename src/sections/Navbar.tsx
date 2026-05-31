/**
 * src/sections/Navbar.tsx
 *
 * Lenis-compatible navbar — Framer Motion MotionValues for scroll-driven visuals,
 * Intersection Observer for auto active-state detection, dan smooth scroll
 * yang delegate ke instance Lenis global (window.__lenis).
 *
 * Fix summary vs. versi sebelumnya:
 *  - useState + useEffect diimport dan dipakai dengan benar
 *  - activeHash disimpan sebagai React state → komponen re-render hanya saat
 *    seksi berganti (bukan setiap pixel scroll)
 *  - Smooth scroll via Lenis.scrollTo() dengan offset -80px agar judul
 *    tidak tertutup navbar
 *  - Intersection Observer mengamati semua target seksi; seksi yang paling
 *    terlihat otomatis di-set aktif
 *  - Elemen fallback logo dibersihkan (tidak duplikat)
 *  - Semua tipe TypeScript eksplisit, zero implicit-any
 */

import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion, type MotionStyle } from 'framer-motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavLink {
  label: string;
  href: string; // harus berupa '#section-id'
}

// Tipe minimal untuk instance Lenis yang diekspos ke window
interface LenisInstance {
  scrollTo: (
    target: string | number | HTMLElement,
    options?: { offset?: number; duration?: number; easing?: (t: number) => number },
  ) => void;
}

declare global {
  interface Window {
    __lenis?: LenisInstance;
  }
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NAV_LINKS: NavLink[] = [
  { label: 'Home',        href: '#hero' },
  { label: 'Dokumentasi', href: '#dokumentasi' },
  { label: 'Tentang Kami', href: '#about' },
];

/** px scroll sebelum navbar berubah solid */
const SOLIDIFY_THRESHOLD = 80;

/** Tinggi navbar — dipakai sebagai offset scroll agar judul tidak tertutup */
const NAVBAR_HEIGHT = 80;

// ---------------------------------------------------------------------------
// Easing helper
// ---------------------------------------------------------------------------

const easeInOutQuart = (t: number): number =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Navbar() {
  // ── Scroll-driven visual styles (MotionValues — zero re-render) ──────────
  const { scrollY } = useScroll();

  const bgColor = useTransform(
    scrollY,
    [0, SOLIDIFY_THRESHOLD],
    ['rgba(5,5,5,0)', 'rgba(5,5,5,0.92)'],
  );
  const backdropBlur = useTransform(
    scrollY,
    [0, SOLIDIFY_THRESHOLD],
    ['blur(0px)', 'blur(12px)'],
  );
  const borderOpacity = useTransform(
    scrollY,
    [0, SOLIDIFY_THRESHOLD],
    [0, 0.18],
  );

  const navStyle: MotionStyle = {
    backgroundColor: bgColor,
    backdropFilter: backdropBlur,
    WebkitBackdropFilter: backdropBlur,
    paddingLeft:  'clamp(20px, 4.5vw, 72px)',
    paddingRight: 'clamp(20px, 4.5vw, 72px)',
  };

  // ── Active hash state (re-render hanya saat seksi berganti) ──────────────
  const [activeHash, setActiveHash] = useState<string>(() => {
    // Inisialisasi dari hash URL saat komponen mount (SSR-safe)
    if (typeof window !== 'undefined' && window.location.hash) {
      return window.location.hash;
    }
    return NAV_LINKS[0].href; // default: link pertama
  });

  // ── Intersection Observer — auto detect seksi aktif ───────────────────────
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Kumpulkan semua elemen target dari NAV_LINKS
    const sectionIds = NAV_LINKS.map((link) => link.href.replace('#', ''));
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Lacak ratio visibility per elemen
    const visibilityMap = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target.id, entry.intersectionRatio);
        });

        // Pilih elemen yang paling banyak terlihat
        let maxRatio = 0;
        let mostVisible = '';
        visibilityMap.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisible = id;
          }
        });

        if (mostVisible) {
          setActiveHash(`#${mostVisible}`);
        }
      },
      {
        // rootMargin negatif di atas agar navbar tidak ikut "menutupi" deteksi
        rootMargin: `-${NAVBAR_HEIGHT}px 0px -40% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observerRef.current!.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // ── Smooth scroll handler — delegate ke Lenis jika tersedia ──────────────
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ): void => {
    e.preventDefault();

    // Set aktif langsung saat klik (feedback instan sebelum IntersectionObserver update)
    setActiveHash(href);

    const targetId = href.replace('#', '');
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    if (window.__lenis) {
      // Lenis tersedia — pakai scrollTo bawaan Lenis
      window.__lenis.scrollTo(targetEl, {
        offset: -NAVBAR_HEIGHT,
        duration: 1.1,
        easing: easeInOutQuart,
      });
    } else {
      // Fallback: native smooth scroll dengan offset manual
      const top =
        targetEl.getBoundingClientRect().top +
        window.scrollY -
        NAVBAR_HEIGHT;

      window.scrollTo({ top, behavior: 'smooth' });
    }

    // Perbarui URL hash tanpa men-trigger lompatan browser
    history.pushState(null, '', href);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between"
      style={navStyle}
    >
      {/* Hairline border animasi */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-px pointer-events-none"
        style={{
          backgroundColor: 'rgba(255,255,255,1)',
          opacity: borderOpacity,
        }}
      />

      {/* Kiri — Logo */}
      <div className="flex items-center gap-2.5">
        <motion.img
          src="https://ahsan.tv/wp-content/uploads/2026/05/logo-2.webp"
          alt="Logo Ahsan TV"
          className="h-12 w-auto object-contain py-1"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 2.1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          onError={(e) => {
            // Sembunyikan img, tampilkan fallback dot
            e.currentTarget.style.display = 'none';
            const fallback = document.getElementById('navbar-logo-fallback');
            if (fallback) fallback.style.display = 'block';
          }}
        />
        {/* Fallback dot — satu elemen saja, hidden by default */}
        <div
          id="navbar-logo-fallback"
          className="hidden w-2.5 h-2.5 rounded-full bg-[#FF2E2E]"
        />
      </div>

      {/* Kanan — Nav links */}
      <motion.div
        className="hidden sm:flex items-center gap-8"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {NAV_LINKS.map(({ label, href }) => {
          const isActive = activeHash === href;

          return (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className={[
                'relative group',
                'text-white text-[17px] tracking-wide font-normal',
                'transition-opacity duration-200 ease-in-out',
                isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100',
              ].join(' ')}
              style={{ fontFamily: "'Inter', sans-serif" }}
              aria-current={isActive ? 'page' : undefined}
            >
              {label}

              {/* Garis bawah crimson — menetap saat aktif, muncul saat hover */}
              <span
                aria-hidden="true"
                className={[
                  'absolute left-0 -bottom-0.5 h-px w-full',
                  'bg-[#FF2E2E] origin-left',
                  'transition-transform duration-300 ease-out',
                  isActive
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100',
                ].join(' ')}
              />
            </a>
          );
        })}
      </motion.div>
    </motion.nav>
  );
}