/**
 * IOSAppStoreCard — Usage Examples
 * Taruh file ini di section/page mana pun dalam project Next.js / React kamu.
 *
 * Dependency:
 *   npm install motion lucide-react
 *   (atau: npm install framer-motion lucide-react)
 *
 * Jika pakai framer-motion, ganti import di IOSAppStoreCard.tsx:
 *   import { motion, AnimatePresence } from "framer-motion";
 */

"use client";

import { Star, Zap, Music } from "lucide-react";
import { IOSAppStoreCard } from "@/components/ui/IOSAppStoreCard"; // sesuaikan path

// ─────────────────────────────────────────────────────────────
// CONTOH 1 — Paling sederhana, hanya isi field wajib
// ─────────────────────────────────────────────────────────────
export function ExampleMinimal() {
  return (
    <section className="bg-black py-12">
      <IOSAppStoreCard
        card={{
          id: "minimal-card",
          category: "FEATURED",
          title: "My Awesome App",
          subtitle: "The simplest way to get started.",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
          description: "Deskripsi singkat tentang aplikasi ini.",
        }}
      />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// CONTOH 2 — Custom icon, warna aksen, tombol CTA dengan callback
// ─────────────────────────────────────────────────────────────
export function ExampleCustomIcon() {
  return (
    <section className="bg-black py-12">
      <IOSAppStoreCard
        card={{
          id: "custom-icon-card",
          category: "APP OF THE DAY",
          title: "Starfield: Explore",
          subtitle: "Journey through 1000 star systems.",
          image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800",
          description:
            "Starfield membawamu menjelajahi galaksi tanpa batas. Dengan rendering real-time dan fisika berbasis simulasi, setiap planet terasa unik.",
          iconBg: "bg-indigo-600",
          icon: <Star className="h-5 w-5 text-white fill-white" />,
          ctaLabel: "DOWNLOAD",
          onCta: () => alert("Terima kasih sudah mengunduh!"),
        }}
      />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// CONTOH 3 — Description & extraContent berupa JSX (rich content)
// ─────────────────────────────────────────────────────────────
export function ExampleRichContent() {
  return (
    <section className="bg-black py-12">
      <IOSAppStoreCard
        card={{
          id: "rich-content-card",
          category: "EDITOR'S CHOICE",
          title: "Wavify: Music Hub",
          subtitle: "Stream, remix, and share.",
          image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
          iconBg: "bg-rose-600",
          icon: <Music className="h-5 w-5 text-white fill-white" />,
          ctaLabel: "TRY FREE",
          // Description bisa JSX
          description: (
            <>
              <p>
                Wavify adalah platform musik generasi berikutnya. Akses jutaan lagu,
                buat remix langsung di browser, dan bagikan ke komunitas global.
              </p>
              <p>
                Didukung AI generatif yang membantu kamu menyusun chord, melodi,
                dan lirik hanya dengan satu klik.
              </p>
            </>
          ),
          // Konten tambahan di bawah deskripsi — bebas isi apa saja
          extraContent: (
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Lagu", value: "50M+" },
                { label: "Pengguna", value: "2M" },
                { label: "Rating", value: "4.9★" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-white/5 p-3"
                >
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-[11px] text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          ),
        }}
      />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// CONTOH 4 — Multiple cards dalam satu halaman (grid / list)
// ─────────────────────────────────────────────────────────────

const APPS = [
  {
    id: "app-zap",
    category: "NEW",
    title: "ZapTask: Focus Timer",
    subtitle: "Pomodoro redefined.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    description: "ZapTask membantumu tetap fokus dengan timer Pomodoro cerdas dan laporan produktivitas harian.",
    iconBg: "bg-amber-500",
    icon: <Zap className="h-5 w-5 text-white fill-white" />,
  },
  {
    id: "app-music",
    category: "TRENDING",
    title: "Wavify: Music Hub",
    subtitle: "Stream, remix, and share.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
    description: "Platform musik generasi berikutnya dengan fitur remix berbasis AI.",
    iconBg: "bg-rose-600",
    icon: <Music className="h-5 w-5 text-white fill-white" />,
  },
];

export function ExampleMultipleCards() {
  return (
    <section className="bg-black py-12 px-4">
      <h2 className="text-white text-xl font-bold mb-6 max-w-md mx-auto">
        Featured Apps
      </h2>
      <div className="flex flex-col gap-6 items-center">
        {APPS.map((app) => (
          <IOSAppStoreCard
            key={app.id}
            card={app}
            maxWidth="28rem"
            cardHeight="22rem"
          />
        ))}
      </div>
    </section>
  );
}