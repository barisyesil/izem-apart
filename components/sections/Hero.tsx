"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { hero } from "@/lib/content";

// =====================================================================
// KARŞILAMA (HERO) BÖLÜMÜ — "Yükselen Perde"
// ---------------------------------------------------------------------
// Sahne efekti: Hero, kendi yüksekliğinin İKİ KATI bir kaydırma
// alanına (wrapper, 200vh) "sabitlenmiş" (position: sticky) olarak
// oturur. Kullanıcı aşağı kaydırdıkça Hero, ekranın üstüne YAPIŞIK
// kalırken KENDİSİ yukarı doğru kayar (translateY 0% → -100%) — sanki
// bir tiyatro perdesi yukarı açılıyormuş gibi Hakkımızda bölümünü
// ortaya çıkarır. Kaydırma çift yönlü olduğu için yukarı kaydırınca
// bu doğal olarak TERSİNE döner (perde tekrar iner). Bu tek, kasıtlı
// "sahne" hareketi haricinde Hero'da başka bir yüklenme animasyonu
// yok — içerik (Reveal ile) sade bir şekilde belirir.
//
// NEDEN 200vh'lik bir sarmalayıcı gerekiyor: "position: sticky" bir
// öğenin "yapışık" kalabilmesi için kendi kapsayıcısının ondan DAHA
// UZUN olması gerekir — kapsayıcı tam olarak öğeyle aynı yükseklikte
// olsaydı yapışacak hiç "fazladan" kaydırma mesafesi olmazdı.
//
// "Hareketi azalt" açıksa: bu sahne efekti TAMAMEN devre dışı kalır
// (sarmalayıcı da, sticky/transform da render edilmez) — Hero sade,
// tek ekranlık, hareketsiz bir bölüm olarak görünür.
// =====================================================================

export default function Hero() {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // NOT: offset ["start start", "end end"] KASITLI — bu, ilerlemenin (0→1)
  // tam olarak "position: sticky"nin doğal bırakma aralığıyla (wrapperHeight
  // - viewportHeight) örtüşmesini sağlıyor. ["start start","end start"]
  // kullanılsaydı ilerleme tam wrapperHeight'a kadar sürerdi ama sticky çok
  // daha erken (yarısında) kendiliğinden çözülüp normal kaymaya geçerdi —
  // bu da transform + doğal kayma üst üste binip Hero'nun olması gerekenden
  // çok daha erken (ve fazla) ekran dışına çıkmasına yol açıyordu.
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  const curtainY = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  if (reduce) {
    return (
      <section id="anasayfa" className="relative flex h-dvh flex-col justify-end overflow-hidden bg-ink text-cream">
        <HeroScene />
      </section>
    );
  }

  return (
    // NOT: marginBottom: "-100dvh" KASITLI. Sticky çözüldükten sonra Hero
    // kendi 100dvh'lik doğal kutusunu sarmalayıcının GERİ KALAN kısmında
    // (son 100dvh'lik dilimde) dolduruyor — yani bu dilim, ekranda GÖRÜNEN
    // hiçbir şeyin olmadığı "boş" bir kaydırma aralığı. Negatif kenar
    // boşluğu, bir sonraki bölümü (Hakkımızda) tam o boşluğun başladığı
    // yere çekerek bu boş kaydırmayı ortadan kaldırıyor — perde tam
    // kalktığı anda bir sonraki bölüm hemen ardından geliyor.
    <div
      ref={wrapperRef}
      className="relative"
      style={{ height: "200dvh", marginBottom: "-100dvh" }}
    >
      <motion.section
        id="anasayfa"
        style={{ y: curtainY }}
        className="sticky top-0 z-10 flex h-dvh flex-col justify-end overflow-hidden bg-ink text-cream"
      >
        <HeroScene />
      </motion.section>
    </div>
  );
}

// Fotoğraf/motif + karartma katmanları + içerik — hem sade (hareket
// azaltılmış) hem de sahne-efektli sürümde AYNI görsel içerik.
function HeroScene() {
  return (
    <>
      {/* --- Arka plan --- */}
      <div aria-hidden="true" className="absolute inset-0">
        {hero.image ? (
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            preload
            sizes="100vw"
            // Mobilde (dar/uzun ekran) object-cover fotoğrafın çoğunu yandan
            // kırpıyor; sabit tek bir kırpma yerine yavaş, ileri-geri bir
            // yatay kaydırmayla (animate-hero-pan) zamanla daha fazlası
            // görünsün diye. Bu sınıf kendi @media sorgusuyla yalnızca dar
            // ekranlarda animasyonu açar, masaüstünde sabit kadraja döner
            // (bkz. globals.css → hero-pan; neden Tailwind sm: varyantı
            // yerine kendi @media sorgusu kullanıldığı orada açıklanıyor).
            className="animate-hero-pan object-cover object-[30%_38%]"
          />
        ) : (
          <HeroMotif />
        )}
      </div>

      {/* İçeriğin oturduğu alt bölge için: yukarıdan hafif, aşağıdan güçlü
          bir karartma — header'ın oturduğu üstte en açık, metnin okunduğu
          altta en koyu. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-ink/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ink/95 via-ink/55 to-transparent"
      />

      {/* --- İçerik — ekranın alt-orta bölgesine yaslı, üstünde ve
          altında nefes alacak boşluk bırakılarak (ne tam ortada asılı,
          ne de alt kenara yapışık). --- */}
      <div className="relative z-10 w-full pb-24 sm:pb-32 lg:pb-40">
        <Container>
          <div className="max-w-2xl">
            <Reveal delay={0.05}>
              <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-cream/70">
                <span className="h-px w-8 bg-terracotta/70" />
                {hero.eyebrow}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <h1 className="font-serif text-4xl leading-[1.08] text-cream [text-shadow:0_2px_28px_rgba(0,0,0,0.4)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                {hero.titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </Reveal>

            <Reveal delay={0.28}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-cream/80 sm:text-lg">
                {hero.subtitle}
              </p>
            </Reveal>

            {/* Tek, bitişik bir "kapsül" içinde iki eylem: solda öne çıkan
                dolu yarı, sağda ince bir çizgiyle ayrılmış sakin yarı —
                iki ayrı, eşit ağırlıkta buton yerine tek bir bütün kontrol. */}
            <Reveal delay={0.4} className="mt-9 inline-block">
              <div className="inline-flex overflow-hidden rounded-full border border-cream/25">
                <a
                  href={hero.primaryCta.href}
                  className="inline-flex min-h-[48px] items-center gap-2 bg-cream px-5 text-sm font-medium text-ink transition-colors hover:bg-warmwhite sm:px-7"
                >
                  {hero.primaryCta.label}
                </a>
                <a
                  href={hero.secondaryCta.href}
                  className="group inline-flex min-h-[48px] items-center gap-2 border-l border-cream/25 px-5 text-sm font-medium text-cream transition-colors hover:bg-cream/10 sm:px-7"
                >
                  {hero.secondaryCta.label}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>

      {/* --- Aşağı kaydır ipucu --- */}
      <a
        href="#hakkimizda"
        aria-label="Aşağı kaydır"
        className="absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-2 text-cream/60 transition-colors hover:text-cream sm:right-8 lg:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.22em]">{hero.scrollHint}</span>
        <span className="relative block h-10 w-px overflow-hidden bg-cream/20">
          <motion.span
            className="absolute left-0 top-0 block h-4 w-px bg-cream/80"
            animate={{ y: ["-120%", "260%"] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </a>
    </>
  );
}

// =====================================================================
// HERO ÇİZGİ-MOTİFİ (HeroMotif)
// ---------------------------------------------------------------------
// Fotoğraf yerine kullanılan, kendi çizdiğimiz soyut "bina" motifi: dış
// hat + pencere ızgarası + bir kapı. Sayfa açıldığında ince bir çizgi
// gibi "kendini çizer" (pathLength 0 → 1), gerçek apartın pencere
// ritmine gevşek şekilde gönderme yapar. Tamamen dekoratif (aria-hidden).
// =====================================================================
const WINDOW_GLOW = [
  { delay: 0.4, duration: 2.6, pause: 3.5, peak: 0.55 },
  { delay: 2.1, duration: 3.2, pause: 5.0, peak: 0.4 },
  { delay: 4.6, duration: 2.2, pause: 2.8, peak: 0.6 },
  { delay: 1.2, duration: 3.6, pause: 4.2, peak: 0.45 },
  { delay: 5.4, duration: 2.4, pause: 3.0, peak: 0.5 },
  { delay: 0.8, duration: 3.0, pause: 6.0, peak: 0.55 },
  { delay: 3.6, duration: 2.8, pause: 3.6, peak: 0.4 },
  { delay: 2.8, duration: 2.2, pause: 4.8, peak: 0.6 },
  { delay: 6.2, duration: 3.4, pause: 2.6, peak: 0.5 },
  { delay: 1.6, duration: 2.6, pause: 5.4, peak: 0.45 },
  { delay: 4.0, duration: 3.2, pause: 3.2, peak: 0.55 },
  { delay: 3.0, duration: 2.4, pause: 4.4, peak: 0.4 },
];

function HeroMotif() {
  // 3 sütun x 4 satırlık pencere ızgarası için koordinatlar.
  const windowCols = [44, 92, 140];
  const windowRows = [44, 98, 152, 206];
  const reduce = useReducedMotion();

  return (
    <div className="absolute -right-[8%] bottom-[-8%] w-[78vw] max-w-[420px] text-brass opacity-[0.16] sm:max-w-[480px]">
      <svg viewBox="0 0 240 320" fill="none" className="h-auto w-full">
        {/* Bina dış hattı */}
        <motion.rect
          x="20"
          y="16"
          width="200"
          height="288"
          rx="6"
          stroke="currentColor"
          strokeWidth="1.5"
          initial={reduce ? false : { pathLength: 0 }}
          animate={reduce ? undefined : { pathLength: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
        {/* Pencereler — dış çerçeve çizilir, içine de sırayla parlayıp
            sönen sıcak bir "ışık" dolgusu yerleşir (bkz. WINDOW_GLOW). */}
        {windowRows.map((y, rowIndex) =>
          windowCols.map((x, colIndex) => {
            const glow = WINDOW_GLOW[rowIndex * 3 + colIndex];
            return (
              <g key={`${x}-${y}`}>
                <motion.rect
                  x={x}
                  y={y}
                  width="32"
                  height="36"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1"
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  animate={reduce ? undefined : { pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.6 + (rowIndex * 3 + colIndex) * 0.05,
                    ease: "easeOut",
                  }}
                />
                <motion.rect
                  x={x + 5}
                  y={y + 5}
                  width="22"
                  height="26"
                  rx="1"
                  fill="var(--color-cream)"
                  opacity={reduce ? 0.3 : undefined}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={reduce ? undefined : { opacity: [0, glow.peak, 0] }}
                  transition={
                    reduce
                      ? undefined
                      : {
                          duration: glow.duration,
                          repeat: Infinity,
                          repeatDelay: glow.pause,
                          delay: 1.6 + glow.delay,
                          ease: "easeInOut",
                        }
                  }
                />
              </g>
            );
          }),
        )}
        {/* Kapı */}
        <motion.rect
          x="104"
          y="254"
          width="32"
          height="50"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
          initial={reduce ? false : { pathLength: 0 }}
          animate={reduce ? undefined : { pathLength: 1 }}
          transition={{ duration: 0.7, delay: 1.5, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}
