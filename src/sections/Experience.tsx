import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function Experience() {
  return (
    <section
      id="experience-showcase"
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
              <span className="block">TRAVEL AND</span>
              <span className="block">ENJOY YOUR</span>
              <span className="block">HOLIDAY</span>
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
                <Play
                  size={16}
                  className="text-white transition-colors duration-300 group-hover:text-[#FF2E2E] ml-0.5"
                  fill="currentColor"
                />
              </button>
              <span
                className="text-[14px] lowercase"
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                choose your fun holiday
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
              The Raja Ampat Islands are a group of islands located in the western
              part of the Bird's Head Peninsula on the island of New Guinea.
              Administratively, this cluster is under Raja Ampat Regency and Soron
              City
            </motion.p>
          </div>

          {/* Right Column - Media Cluster */}
          <div className="relative flex items-center justify-center">
            {/* Indonesian Flag Motif (behind cards) */}
            <motion.div
              className="absolute z-0 hidden lg:block"
              style={{
                width: '300px',
                height: '160px',
                transform: 'rotate(-15deg)',
                top: '50%',
                left: '10%',
                marginTop: '-80px',
              }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <div
                className="w-full h-1/2"
                style={{ backgroundColor: 'rgba(255,46,46,0.15)' }}
              />
              <div
                className="w-full h-1/2"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              />
            </motion.div>

            {/* Media Cards */}
            <div className="flex gap-4 relative z-10">
              {[
                {
                  src: 'https://ahsan.tv/wp-content/uploads/2026/05/media-raja-ampat-aerial.webp',
                  alt: 'Raja Ampat aerial view',
                },
                {
                  src: 'https://ahsan.tv/wp-content/uploads/2026/05/media-beach-traveler.webp',
                  alt: 'Traveler on beach',
                },
              ].map((media, i) => (
                <motion.div
                  key={media.alt}
                  className="relative overflow-hidden rounded cursor-pointer group"
                  style={{ width: '280px', aspectRatio: '16/10' }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15 * i,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <img
                    src={media.src}
                    alt={media.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{ backgroundColor: 'rgba(5,5,5,0.3)' }}
                  />
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border-[1.5px] border-white/80 flex items-center justify-center transition-all duration-300 group-hover:border-white group-hover:bg-white/10">
                      <Play
                        size={20}
                        className="text-white ml-0.5"
                        fill="currentColor"
                      />
                    </div>
                  </div>
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
            href="https://instagram.com/algyspace_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] transition-colors duration-200 hover:opacity-70"
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            http://instagram.com/algyspace_
          </a>
        </motion.div>
      </div>
    </section>
  );
}
