import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import DecayCard from '@/components/DecayCard';

export default function Experience() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden"
      style={{
        paddingTop: '80px',
        paddingBottom: '120px',
        paddingLeft: 'clamp(24px, 5vw, 80px)',
        paddingRight: 'clamp(24px, 5vw, 80px)',
        background: 'linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #050505 100%)',
      }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 relative">
          {/* Left Column */}
          <div className="flex flex-col justify-center">
            {/* Main Heading */}
        <motion.h2
          className="text-white uppercase font-display font-bold leading-[1.05] tracking-[-0.01em] mb-8"
          style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="block">
            <ScrollReveal
              baseOpacity={0.1}
              enableBlur
              baseRotation={3}
              blurStrength={4}
            >
              BERBAGI MANFAAT
            </ScrollReveal>
          </span>

          <span className="block">
            <ScrollReveal
              baseOpacity={0.1}
              enableBlur
              baseRotation={3}
              blurStrength={4}
            >
              JELAJAHI KEBAIKAN
            </ScrollReveal>
          </span>

        </motion.h2>

            {/* Play Button + Label */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <button className="w-12 h-12 rounded-full border border-white/80 flex items-center justify-center transition-colors duration-300 hover:border-[#FF2E2E] group">
                <a href="https://www.youtube.com/watch?v=SPQvhh7hVow" target="_blank" rel="noopener noreferrer">
                <Play
                  size={16}
                  className="text-white transition-colors duration-300 group-hover:text-[#FF2E2E] ml-0.5"
                  fill="currentColor"
                />
                </a>
              </button>
              <span
                className="text-[14px] lowercase"
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                lihat dokumentasi kegiatan
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-[14px] leading-[1.7] max-w-[420px]"
              style={{ color: '#A0A0A0', fontFamily: 'Inter, sans-serif' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              Amanah dari para muhsinin yang telah kami sampaikan langsung kepada yang berhak. 
              Bergerak menyusuri berbagai wilayah untuk menghadirkan senyum di tengah masyarakat.
            </motion.p>
          </div>

          {/* Right Column - Media Cluster */}
      {/* Right Column - Media Cluster */}
      <div className="relative flex items-center justify-center">
        
        {/* INDONESIAN FLAG MOTIF SEBELUMNYA DI SINI SUDAH DIAPUS PERMANEN, BERSIH! */}

<div className="flex gap-4 relative z-10 bg-transparent">
  {[
    {
      src: 'https://ahsan.tv/wp-content/uploads/2026/05/footer.webp',
      alt: 'Footer',
      seed: 10
    },
  ].map((media, i) => (
    <motion.div
      key={media.alt}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.7,
        delay: 0.15 * i,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <DecayCard 
        width={400} // Ukuran tampilan kotak di layar, silakan set sesuai kebutuhan layoutmu (misal 300, 400, dll.)
        height={400} // Dibikin sama dengan width biar 1:1 sesuai rasio gambar asli 960*960
        image={media.src}
        seed={media.seed}
        maxDisplacement={350}
        movementBound={40}
      >
        {/* Sisa Overlay Kegelapan tipis khas brutalist (Ikon play sudah dihapus total) */}
        <div className="absolute inset-0 transition-opacity duration-300 bg-black/20 group-hover:bg-black/10" />
      </DecayCard>
    </motion.div>
  ))}
</div>

      </div>
        </div>

        {/* Footer Credit */}
        <motion.div
          className="flex justify-end mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <a
            href="https://www.instagram.com/ahsantv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] transition-colors duration-200 hover:opacity-70"
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            http://www.instagram.com/ahsantv
          </a>
        </motion.div>
      </div>
    </section>
  );
}
