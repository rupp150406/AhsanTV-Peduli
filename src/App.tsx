/**
 * src/App.tsx
 *
 * Global SPA root — mounts Lenis smooth scroll, CustomCursor, ClickSpark, and all sections.
 */

import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Destinations from './sections/Destinations';
import Experience from './sections/Experience';
import Footer from './sections/Footer';
import { CustomCursor } from './components/ui/CustomCursor';

// Import ClickSpark asli bawaan ReactBits kamu
import ClickSpark from './components/ui/ReactBits/ClickSpark'; 

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      duration: 1.2,
      smoothTouch: false,
    });

    lenisRef.current = lenis;

    // Pasang instance ke window global agar terbaca oleh Navbar
    window.__lenis = lenis;
    window.lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.__lenis = undefined;
      window.lenis = undefined;
    };
  }, []);

  return (
    <div className="relative bg-[#050505] min-h-screen text-white overflow-x-hidden">
      {/* CustomCursor tetap mandiri */}
      <CustomCursor />

      {/* SOLUSI BRUTALIST: 
        Kita bungkus seluruh layout (Navbar + main content) di dalam ClickSpark 
        AGAR PERCIKANNYA TETAP MUNCUL DI MANAPUN KAMU KLIK!
        
        Tapi, kita tambahkan utility class 'w-full min-h-screen block' pada ClickSpark 
        (atau di dalam styling komponen ClickSpark-nya jika bisa dipassing class)
        supaya dia tidak merusak susunan hierarki tinggi document HTML yang dibaca oleh Intersection Observer.
      */}
      <ClickSpark
        sparkColor="#ffffff"
        sparkSize={10}
        sparkRadius={20}
        sparkCount={8}
        duration={600}
      >
        {/* Navigasi Utama */}
        <Navbar />
        
        {/* Seluruh Seksi Konten Landing Page */}
        <main className="relative z-10 w-full">
          <Hero />
          <Destinations />
          <Experience />
          <Footer />
        </main>
      </ClickSpark>
    </div>
  );
}