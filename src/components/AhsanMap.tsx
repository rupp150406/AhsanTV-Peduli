"use client";

import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
} from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import { Navigation, Lock,} from "lucide-react";
import { TiltedCard } from '../components/ui/ReactBits/TiltedCard';
// import BorderGlow from '../components/BorderGlow';

// ==================== TYPES ====================
type PlaceStatus = "unlocked" | "locked" | "canceled";

interface Place {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  hours: string;
  image: string;
  lng: number;
  lat: number;
  profitPercentage?: number;
  collectedPercentage?: number;
  status: PlaceStatus;
  buildingDate?: string;
  badgeValue?: number;
  address?: string;
  opportunityDate?: string;
}

// ==================== DATA ====================
const places: Place[] = [
  // --- ACTIVE INVESTMENTS (Marker Biru) ---
  {
    id: 1,
    name: "Lapangan Ahsan TV",
    category: "Residential",
    rating: 4.9,
    reviews: 128,
    hours: "Investment active",
    image:
      "https://ahsan.tv/wp-content/uploads/2026/05/lapangan.webp?w=300&h=200&fit=crop",
      lat: -6.26188,
      lng: 107.11845,
    status: "unlocked",
    buildingDate: "27.12.24",
    address: "Telagamurni, Kabupaten Bekasi, Jawa Barat",
  },
];
// -6.26188, 107.11845

// ==================== COMPONENT ====================
export function AhsanMap() {
  // Ambil data utama untuk kartu panel kiri
  const featuredPlace = places[0];

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl bg-gray-100">
      {/* ---------- MAP ENGINE (TIDAK DIUBAH) ---------- */}
      <Map center={[107.11845, -6.26188]} zoom={17} className="h-full w-full">
        {places.map((place) => (
          <MapMarker
            key={place.id}
            longitude={place.lng}
            latitude={place.lat}
          >
            <MarkerContent>
              {/* PIN LINGKARAN: Biru (aktif) atau Merah (terkunci) */}
              <div
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110 ${
                  place.status === "unlocked"
                    ? "bg-blue-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {place.status === "unlocked" ? (
                  <span className="text-xs font-bold">{place.badgeValue}</span>
                ) : (
                  <Lock className="h-3.5 w-3.5" />
                )}
              </div>
              <MarkerLabel position="bottom">{place.name}</MarkerLabel>
            </MarkerContent>

            {/* ---------- MARKER POPUP: MINIMALIS FULL IMAGE ---------- */}
            
            <MarkerPopup className="w-64 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
              <div className="relative h-48 w-full">
                {/* Gambar latar penuh */}
                <img
                  src={featuredPlace.image}
                  alt={place.name}
                  className="h-full w-full object-cover"
                />

                {/* Overlay gradasi gelap dari bawah */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Konten absolut di bagian bawah */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  {/* Kiri: Nama Tempat & Lokasi */}
                  <div className="min-w-0 pr-2">
                    <h3 className="text-base font-bold leading-tight text-white">
                      {place.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-300">
                      {place.address || place.category}
                    </p>
                  </div>

                  {/* Kanan: Tombol Directions */}
                  <Button
                    size="sm"
                    className="h-8 shrink-0 gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 text-xs text-white backdrop-blur-md transition-colors hover:bg-black/60"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    Lihat
                  </Button>
                </div>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>

      {/* ---------- MAIN CARD: PANEL KIRI ATAS (Sesuai card.png) ---------- */}
      <div className="absolute left-4 top-4 h-64 w-80 overflow-hidden rounded-3xl shadow-2xl">
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
        {/* Gambar latar penuh */}
        <img
          src={featuredPlace.image}
          alt={featuredPlace.name}
          className="h-full w-full object-cover"
        />

        {/* Overlay gradasi gelap dari bawah */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Konten absolut di bagian bawah */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          {/* Kiri: Nama Tempat & Lokasi */}
          <div className="min-w-0 pr-2">
            <h3 className="text-base font-bold leading-tight text-white">
              {featuredPlace.name}
            </h3>
            <p className="mt-0.5 text-xs text-gray-300">
              {featuredPlace.address || featuredPlace.category}
            </p>
          </div>

          {/* Kanan: Tombol Directions */}
          <Button
            size="sm"
            className="h-8 shrink-0 gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 text-xs text-white backdrop-blur-md transition-colors hover:bg-black/60"
          >
            <Navigation className="h-3.5 w-3.5" />
            <a 
              href="https://www.google.com/maps/place/Lapangan+Ahsan+TV/@-6.2620501,107.1188092,90m/data=!3m1!1e3!4m6!3m5!1s0x2e69856e9b38a2bf:0x35c55b64d33875a!8m2!3d-6.2619026!4d107.1184501!16s%2Fg%2F11c0vwn1k7?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Lihat
            </a>
          </Button>
        </div>
        </TiltedCard>
      </div>
    </div>
  );
}