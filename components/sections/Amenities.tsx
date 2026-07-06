"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { amenities, chapters } from "@/lib/content";
import type { Feature } from "@/lib/types";

// =====================================================================
// OLANAKLAR BÖLÜMÜ
// ---------------------------------------------------------------------
// Odalardaki ve aparttaki imkânları, kalabalık görünmeyen ferah bir
// ızgarada (mobilde 2, masaüstünde 4 sütun) ikonlarla listeler.
// Her kartın açıklaması, kart ekrana girdiğinde KENDİLİĞİNDEN (tıklama
// veya üzerine gelme gerekmeden) açılır; aynı anda ekrana giren kartlar
// (bir satır) sırayla, birer birer açılır (bkz. AmenityCard'taki gecikme
// hesabı). Bu davranış mobil ve masaüstünde AYNIDIR: mobilde kullanıcı
// aşağı kaydırdıkça her yeni satır ekrana girince kendi açıklamalarını
// sırayla açar.
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
// olur — kartın ızgaradaki konumuna (index % 4) göre küçük, kademeli bir
// gecikmeyle; böylece aynı satırdaki kartlar sırayla (soldan sağa)
// açılıyormuş hissi verir. Üzerine gelme/odaklanma da (masaüstü/klavye)
// açıklamayı erken göstermeye devam eder — otomatik açılışı beklemeden
// önizleme imkânı için.
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
    // Satırdaki konuma göre kademeli gecikme — "birer birer açılma" hissi.
    const timer = setTimeout(() => setRevealed(true), 250 + (index % 4) * 160);
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
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sage/15 text-sage-deep transition-transform duration-300 ${
          active ? "rotate-6 scale-110 bg-sage/25" : ""
        }`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>

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
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </svg>
          <p
            className={`text-xs leading-relaxed text-taupe transition-all duration-300 ${
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
