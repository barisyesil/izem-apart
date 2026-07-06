"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { amenities, chapters } from "@/lib/content";
import type { Feature } from "@/lib/types";

// Kart ikonunun "canlanma" hareketi: kısa bir sallanma + nabız gibi
// büyüyüp küçülme, ama son karede DAİMA düz (rotate 0) ve normal boyutta
// (scale 1) biter — ikon asla eğik/yamuk durmaz, sadece değiştiğini
// belli eden geçici bir hareket yapar. "active" adı değişmediği sürece
// (yani zaten aktifken yeniden render olunca) Framer Motion animasyonu
// TEKRARLAMAZ — sadece "idle" -> "active" geçişinde bir kez oynar.
const iconPop: Variants = {
  idle: { rotate: 0, scale: 1 },
  active: {
    rotate: [0, -14, 11, -6, 3, 0],
    scale: [1, 1.22, 0.92, 1.08, 0.97, 1],
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

// =====================================================================
// OLANAKLAR BÖLÜMÜ
// ---------------------------------------------------------------------
// Odalardaki ve aparttaki imkânları, kalabalık görünmeyen ferah bir
// ızgarada (mobilde 2, masaüstünde 4 sütun) ikonlarla listeler.
// Her kartın açıklaması, kart ekrana girdiğinde KENDİLİĞİNDEN (tıklama
// veya üzerine gelme gerekmeden) açılır. Kartlar IZGARADAKİ MUTLAK
// SIRAYA göre (satır satır, her satırda soldan sağa) tek tek açılır:
// önce ilk satırdaki tüm kartlar bitene kadar sırayla açılır, ANCAK
// SONRA bir alttaki satıra geçilir (bkz. AmenityCard'taki gecikme
// hesabı — index % 4 DEĞİL, ham "index" kullanılıyor). Bu davranış
// mobil ve masaüstünde AYNIDIR: mobilde kullanıcı aşağı kaydırdıkça
// her yeni satır ekrana girince kendi açıklamalarını sırayla açar.
// =====================================================================
export default function Amenities() {
  return (
    <Section id="olanaklar" className="bg-sand">
      <Container>
        <SectionHeading
          eyebrow={amenities.eyebrow}
          number={chapters.find((c) => c.id === "olanaklar")?.number}
          title={amenities.title}
          align="center"
        />
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-taupe sm:text-base">
          {amenities.intro}
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {amenities.items.map((item, index) => (
            <Reveal key={item.title} delay={(index % 4) * 0.05}>
              <AmenityCard item={item} index={index} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// Tek bir olanak kartı.
// Açıklama için gereken yer BAŞTAN ayrılır (min-h ile); böylece açılınca
// ızgaradaki diğer kartlar aşağı kaymaz — sadece görünürlüğü değişir.
// "revealed" durumu, kart görünüme girdiğinde (useInView) OTOMATİK true
// olur — ızgaradaki MUTLAK sırasına (index) göre kademeli bir gecikmeyle;
// böylece satır satır, soldan sağa "birer birer açılma" hissi verir ve
// bir sonraki satır ancak öncekinin tamamı açıldıktan sonra başlar.
// Üzerine gelme/odaklanma da (masaüstü/klavye) açıklamayı erken
// göstermeye devam eder — otomatik açılışı beklemeden önizleme imkânı için.
function AmenityCard({ item, index }: { item: Feature; index: number }) {
  const Icon = item.icon;
  const reduceMotion = useReducedMotion();
  const [hoverOrFocus, setHoverOrFocus] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, amount: 0.5 });

  useEffect(() => {
    // "Hareketi azalt" açıksa zaten aşağıdaki render'da "active || reduceMotion"
    // ile anında gösteriliyor — burada ayrıca state güncellemeye gerek yok.
    if (!inView || reduceMotion) return;
    // Mutlak sıraya göre kademeli gecikme (satır atlamadan, tek tek).
    const timer = setTimeout(() => setRevealed(true), 350 + index * 220);
    return () => clearTimeout(timer);
  }, [inView, index, reduceMotion]);

  const active = revealed || hoverOrFocus;

  return (
    <motion.div
      ref={cardRef}
      tabIndex={0}
      onMouseEnter={() => setHoverOrFocus(true)}
      onMouseLeave={() => setHoverOrFocus(false)}
      onFocus={() => setHoverOrFocus(true)}
      onBlur={() => setHoverOrFocus(false)}
      className="flex h-full min-h-[188px] flex-col items-start gap-3 rounded-xl border border-hairline bg-warmwhite p-4 transition-colors duration-300 hover:border-sage/50 hover:bg-cream sm:p-6"
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.span
        variants={reduceMotion ? undefined : iconPop}
        animate={reduceMotion ? undefined : active ? "active" : "idle"}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sage-deep transition-colors duration-300 ${
          active ? "bg-sage/25" : "bg-sage/15"
        }`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </motion.span>

      <h3 className="text-sm font-medium text-ink sm:text-base">{item.title}</h3>

      {item.description && (
        <div className="flex flex-col gap-2">
          {/* İnce fırça darbesi çizgisi — açıklama açılırken çizilir */}
          <svg width="32" height="4" viewBox="0 0 32 4" aria-hidden="true">
            <motion.path
              d="M1 2 Q 8 0.5, 16 2 T 31 2"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              className="text-terracotta"
              initial={false}
              animate={{ pathLength: reduceMotion ? 1 : active ? 1 : 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </svg>
          <p
            className={`text-xs leading-relaxed text-taupe transition-all duration-500 ${
              active || reduceMotion
                ? "translate-y-0 opacity-100"
                : "-translate-y-1 opacity-0"
            }`}
          >
            {item.description}
          </p>
        </div>
      )}
    </motion.div>
  );
}
