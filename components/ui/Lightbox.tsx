"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Figure from "@/components/ui/Figure";
import { useFinePointer } from "@/lib/useFinePointer";
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
// GEZİNME — cihaza göre iki ayrı yol:
//  - DOKUNMATİK ekranlarda: fotoğraf parmakla sağa/sola sürüklenerek
//    (swipe) gezilir; eşiği (mesafe VEYA hız) aşan sürükleme sonraki/
//    önceki fotoğrafa geçer, aşmayan yumuşak bir yayla ortasına döner.
//  - MASAÜSTÜNDE (hassas imleç): sürükleme KAPALI — fare imlecinin
//    fotoğrafı "taşımaya çalışması" hem alışılmadık hem hataya açıktı.
//    Onun yerine fotoğrafın ALTINDA minimal önceki/sonraki butonları
//    var (klavye ok tuşları da her cihazda çalışır).
// Üç giriş yolu da (swipe, buton, klavye) AYNI showNext/showPrev'i
// çağırdığı için geçiş animasyonu hepsinde tutarlı görünür.
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
  const isFine = useFinePointer();
  // Giriş/çıkış animasyonunun hangi yönden kayacağını belirler (bkz.
  // slideVariants) — sürükleme yönüyle veya ok tuşu/buton yönüyle aynı.
  const [direction, setDirection] = useState(1);

  // Sürükleme sadece dokunmatik cihazlarda ve birden çok fotoğraf varsa.
  const dragEnabled = !isFine && images.length > 1;

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
              drag={dragEnabled ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={dragEnabled ? handleDragEnd : undefined}
              className="absolute inset-0"
            >
              <Figure 
              src={active.src} 
              alt={active.alt} 
              label="Foto" 
              className="h-full w-full" 
              sizes="(max-width: 768px) 100vw, 768px" 
            />     
           </motion.div>
          </AnimatePresence>
        </div>

        {/* Fotoğrafın altındaki gezinme şeridi: önceki/sonraki butonları +
            sayaçlı başlık. Butonlar masaüstünde ANA gezinme yolu (sürükleme
            orada kapalı), dokunmatikte de swipe'a görünür bir alternatif
            (erişilebilirlik: sadece harekete dayalı etkileşim bırakılmaz). */}
        {images.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={showPrev}
              aria-label="Önceki görsel"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-cream/25 text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="max-w-[55vw] truncate text-center text-sm tabular-nums text-cream/70 sm:max-w-sm">
              {active.alt} · {index + 1}/{images.length}
            </p>
            <button
              type="button"
              onClick={showNext}
              aria-label="Sonraki görsel"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-cream/25 text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
