"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Figure from "@/components/ui/Figure";
import type { GalleryImage } from "@/lib/types";

// =====================================================================
// LIGHTBOX (tam ekran fotoğraf görüntüleyici) — PAYLAŞILAN bileşen
// ---------------------------------------------------------------------
// Hem Galeri bölümü hem de Odalar bölümündeki oda-özel galeriler bu
// bileşeni kullanır (kod tekrarını önlemek için buraya çıkarıldı).
// "Kontrollü" bir bileşendir: açık/kapalı durumunu ve hangi fotoğrafın
// gösterileceğini çağıran bileşen (Gallery/Rooms) yönetir.
//   - images: gösterilecek fotoğraf listesi (bir odanın SADECE kendi
//     fotoğrafları, ya da galerideki TÜM fotoğraflar olabilir)
//   - index: null ise Lightbox hiç görünmez; sayı ise o fotoğraf açılır
// =====================================================================
export default function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const showNext = () => {
    if (index === null) return;
    onIndexChange((index + 1) % images.length);
  };
  const showPrev = () => {
    if (index === null) return;
    onIndexChange((index - 1 + images.length) % images.length);
  };

  // Açıkken: arka plan kaymasını kilitle + klavye kısayolları (Esc, ok tuşları).
  useEffect(() => {
    if (index === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (index === null) return null;
  const active = images[index];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Fotoğraf görüntüleyici"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Kapat"
        className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full text-cream/80 transition-colors hover:text-cream"
      >
        <X className="h-6 w-6" />
      </button>

      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            showPrev();
          }}
          aria-label="Önceki görsel"
          className="absolute left-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-cream/80 transition-colors hover:text-cream sm:left-5"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      )}

      <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <Figure
          src={active.src}
          alt={active.alt}
          label="Foto"
          className="aspect-[4/3] w-full overflow-hidden rounded-xl"
          sizes="100vw"
        />
        {images.length > 1 && (
          <p className="mt-3 text-center text-sm text-cream/70">
            {active.alt} · {index + 1}/{images.length}
          </p>
        )}
      </div>

      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            showNext();
          }}
          aria-label="Sonraki görsel"
          className="absolute right-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-cream/80 transition-colors hover:text-cream sm:right-5"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      )}
    </div>
  );
}
