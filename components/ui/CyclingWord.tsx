"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

// =====================================================================
// DÖNEN KELİME (CyclingWord)
// ---------------------------------------------------------------------
// Verilen kelime listesini sırayla, yumuşak bir "yukarı kayma" animasyonuyla
// değiştirir (örn. Hakkımızda başlığındaki "güvenli / huzurlu / ...").
//   - Sadece ekranda görünürken döner (useInView); görünmezken durur.
//   - Üzerine gelince (hover) durur.
//   - "Hareketi azalt" açıksa hiç dönmez; kelimeler tek satırda,
//     nokta (·) ile ayrılmış sabit bir liste olarak gösterilir.
// En uzun kelime kadar görünmez bir alan ayrılır ki kelimeler değişirken
// çevresindeki başlık metni sağa-sola kaymasın (kayma = "layout shift").
// =====================================================================
export default function CyclingWord({
  words,
  interval = 2200,
  className = "",
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused || reduceMotion) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [inView, paused, reduceMotion, interval, words.length]);

  // Görünmez ölçüm kutusu için en uzun kelimeyi bul.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  if (reduceMotion) {
    return (
      <span className={`italic text-terracotta-deep ${className}`}>
        {words.join(" · ")}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`relative inline-block align-baseline italic text-terracotta-deep ${className}`}
    >
      {/* Görünmez ölçüm kutusu: en uzun kelime kadar yer ayırır, başlığın
          genişliği kelime değiştikçe zıplamasın diye. */}
      <span className="invisible" aria-hidden="true">
        {longest}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
