"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { chapters } from "@/lib/content";
import { useActiveSection } from "@/lib/useActiveSection";

// =====================================================================
// BÜYÜYEN İPLİK (ChapterRail)
// ---------------------------------------------------------------------
// Masaüstünde sağ kenarda duran, sayfayı kaydırdıkça büyüyen ince bir
// çizgi + her "bölüm" (chapter) için küçük bir nokta. Aktif bölümün
// noktası vurgulanır; noktalara tıklayınca o bölüme atlanır. Sayfanın
// "hikaye" hissini pekiştiren bir gezinme aracı — mobilde yer olmadığı
// için sadece masaüstünde (lg ve üzeri ekranlarda) görünür.
// =====================================================================
export default function ChapterRail() {
  const activeId = useActiveSection(chapters.map((chapter) => chapter.id));

  // Sayfa boyunca kaydırma oranı (0 → 1) — çizginin ne kadar "büyüdüğünü" belirler.
  const { scrollYProgress } = useScroll();
  const growth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <nav
      aria-label="Bölümler"
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative flex flex-col">
        {/* Arka plan çizgisi (sabit, soluk) */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-hairline"
        />
        {/* Kaydırma oranıyla büyüyen çizgi */}
        <motion.div
          aria-hidden="true"
          style={{ scaleY: growth }}
          className="absolute inset-y-0 left-1/2 w-px origin-top -translate-x-1/2 bg-terracotta"
        />

        {chapters.map((chapter) => {
          const isActive = activeId === chapter.id;
          return (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              aria-label={`${chapter.number} — ${chapter.label}`}
              aria-current={isActive ? "true" : undefined}
              className="group relative flex h-12 w-6 items-center justify-center"
            >
              <span
                className={`relative z-10 block rounded-full transition-all duration-300 ${
                  isActive
                    ? "h-2.5 w-2.5 bg-terracotta"
                    : "h-1.5 w-1.5 bg-hairline group-hover:bg-brass"
                }`}
              />
              {/* Üzerine gelince görünen küçük etiket */}
              <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-ink px-2.5 py-1 text-xs text-cream opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {chapter.number} · {chapter.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
