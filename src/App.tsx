/**
 * src/App.tsx
 *
 * Global SPA root — mounts Lenis smooth scroll, CustomCursor, and all sections.
 * Import paths match the user's existing project structure (Navbar and Experience
 * live in ./sections/, CustomCursor lives in ./components/).
 */

import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Destinations from './sections/Destinations';
import Experience from './sections/Experience';
import { CustomCursor } from './components/ui/CustomCursor';
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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative bg-[#050505] min-h-screen">
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Destinations />
        <Experience />
      </main>
    </div>
  );
}