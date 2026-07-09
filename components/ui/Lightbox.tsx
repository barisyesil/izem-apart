"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
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
//
// MOBİL SWIPE: fotoğraf, ok butonlarına muhtaç kalmadan parmakla sağa/sola
// sürüklenerek gezilebilir (Framer Motion'ın "drag" özelliği — projede
// zaten bir bağımlılık, ayrı bir kütüphane eklemeye gerek kalmadı).
// Eşiği (mesafe VEYA hız) aşan bir sürükleme bir sonraki/önceki fotoğrafa
// geçer; aşmayan bir sürükleme parmak bırakılınca yumuşak bir yayla
// (spring) ortasına geri döner. Fotoğraf değişince (butonla, ok tuşuyla
// veya sürükleyerek — hepsi AYNI showNext/showPrev'i çağırır) sürüklemenin
// yönünde kayan bir geçiş oynar; böylece üç giriş yolu da tutarlı görünür.
// =====================================================================
const SWIPE_DISTANCE_THRESHOLD = 60; // px
const SWIPE_VELOCITY_THRESHOLD = 500; // px/sn

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "14%" : "-14%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-14%" : "14%", opacity: 0 }),
};

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
  const reduceMotion = useReducedMotion();
  // Giriş/çıkış animasyonunun hangi yönden kayacağını belirler (bkz.
  // slideVariants) — sürükleme yönüyle veya ok tuşu/buton yönüyle aynı.
  const [direction, setDirection] = useState(1);

  const showNext = () => {
    if (index === null) return;
    setDirection(1);
    onIndexChange((index + 1) % images.length);
  };
  const showPrev = () => {
    if (index === null) return;
    setDirection(-1);
    onIndexChange((index - 1 + images.length) % images.length);
  };

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (images.length <= 1) return;
    const { offset, velocity } = info;
    if (offset.x < -SWIPE_DISTANCE_THRESHOLD || velocity.x < -SWIPE_VELOCITY_THRESHOLD) {
      showNext();
    } else if (offset.x > SWIPE_DISTANCE_THRESHOLD || velocity.x > SWIPE_VELOCITY_THRESHOLD) {
      showPrev();
    }
    // Eşiği aşmadıysa: dragConstraints={left:0,right:0} zaten parmak
    // bırakılınca elementi ortasına (x:0) yaylandırıyor, ekstra kod gerekmiyor.
  }

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
          className="absolute left-1 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full text-cream/80 transition-colors hover:text-cream sm:left-5"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      )}

      <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial={reduceMotion ? false : "enter"}
              animate="center"
              exit={reduceMotion ? undefined : "exit"}
              transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
              drag={images.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              className={`absolute inset-0 ${images.length > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
            >
              <Figure src={active.src} alt={active.alt} label="Foto" className="h-full w-full" sizes="100vw" />
            </motion.div>
          </AnimatePresence>
        </div>
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
          className="absolute right-1 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full text-cream/80 transition-colors hover:text-cream sm:right-5"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      )}
    </div>
  );
}
