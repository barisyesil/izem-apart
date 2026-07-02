"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import MagneticWrap from "@/components/ui/MagneticWrap";
import { hero } from "@/lib/content";

// =====================================================================
// KARŞILAMA (HERO) BÖLÜMÜ — "Canlı Kapak"
// ---------------------------------------------------------------------
// Sayfanın ilk, sinematik ekranı. Bilinçli olarak TAMAMEN soyut/grafik:
// gerçek fotoğraf yerine kendi çizdiğimiz ince bir "bina" çizgi-motifi
// (HeroMotif) kullanılır — apartın gerçek fotoğrafları (telefonla
// çekilmiş) bu kadar büyük kullanım için yeterince "premium" değil.
// Başlık satır satır bir "perde açılma" (wipe) efektiyle belirir, altında
// güven çipleri, sıcak bir parıltı, ince bir yaprak (taç yaprağı) katmanı
// ve mıknatıs gibi imleci takip eden butonlar vardır.
// "use client": animasyon ve kaydırma tarayıcıda çalışır.
// "Hareketi azalt" açıksa: tüm animasyonlar kapanır, içerik sabit kalır.
// =====================================================================

// Öğelerin yumuşakça yükselerek belirmesi. custom = gecikme (saniye).
const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Başlık satırları için "perde açılma" (wipe) efekti: satır, görünmez bir
// çerçevenin (overflow-hidden) altından yukarı doğru kayarak ortaya çıkar —
// sade bir soluklaşmadan çok daha sinematik bir "ortaya çıkış" hissi verir.
const wipe: Variants = {
  hidden: { y: "115%" },
  show: (delay = 0) => ({
    y: "0%",
    transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

// Taç yaprağı konumları sabittir (Math.random() DEĞİL) — sunucu ve
// tarayıcı ilk render'da aynı sonucu üretmeli (hydration uyumsuzluğu
// olmasın diye). Her biri farklı gecikme/süre ile düşer.
const PETALS = [
  { left: "8%", delay: "0s", duration: "13s", size: 7 },
  { left: "22%", delay: "3s", duration: "16s", size: 5 },
  { left: "48%", delay: "6s", duration: "14s", size: 6 },
  { left: "67%", delay: "1.5s", duration: "17s", size: 8 },
  { left: "83%", delay: "4.5s", duration: "12s", size: 5 },
  { left: "92%", delay: "8s", duration: "15s", size: 6 },
];

// HeroMotif'teki 12 pencere (4 satır x 3 sütun) için sabit titreşim
// değerleri — sırayla değil, dağınık/organik hissettiren ama sabit
// (Math.random() DEĞİL, PETALS ile aynı gerekçe) gecikme/süre/duraklama.
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

export default function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Bölüm ekrandan yukarı kaydıkça 0 → 1 arası ilerler.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Arka plan biraz daha yavaş kayar (derinlik hissi); içerik hafifçe solar.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      id="anasayfa"
      className="relative flex min-h-dvh items-center overflow-hidden bg-ink text-cream"
    >
      {/* --- Arka plan (parallax) --- */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: bgY }}
        className="absolute inset-0"
      >
        {hero.image ? (
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            preload
            sizes="100vw"
            className="scale-110 object-cover"
          />
        ) : (
          <HeroMotif reduce={!!reduce} />
        )}
      </motion.div>

      {/* İnce, süzülerek düşen taç yaprakları (yalnızca dekoratif) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {PETALS.map((petal) => (
          <span
            key={petal.left}
            className="animate-petal-fall absolute -top-[10%] rounded-[60%_0_60%_0] bg-terracotta/30"
            style={{
              left: petal.left,
              width: petal.size,
              height: petal.size,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
            }}
          />
        ))}
      </div>

      {/* Sıcak ışık huzmeleri: terracotta/brass/adaçayı tonlarında, aynı
          nokta (75% 15%) etrafından yayılan, yavaşça kayan bir "beaming
          lights" katmanı. Her "tepe" rengi iki yanından şeffaflığa yumuşakça
          erir ve döngü şeffaflıktan şeffaflığa kapandığı için dikişsizdir
          (sert kesim yok). Saf CSS (bkz. globals.css → animate-beam-drift).
          background-size'ın yatay bileşeni (300%) keyframe'deki 300%'lik
          kaymayla eşleşmeli — yoksa döngü sıçrar. */}
      <div
        aria-hidden="true"
        className="animate-beam-drift pointer-events-none absolute -inset-10 opacity-55 mix-blend-screen blur-[28px] [background-size:300%_240%]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(100deg, transparent 0%, var(--color-terracotta) 15%, transparent 33%, var(--color-brass) 48%, transparent 66%, var(--color-sage-deep) 81%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 85% 75% at 75% 15%, black 25%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 75% 15%, black 25%, transparent 80%)",
        }}
      />

      {/* Metnin net okunması için karartma */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/55"
      />

      {/* İnce film greni (premium doku) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* --- İçerik --- */}
      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full"
      >
        <Container className="py-28">
          <div className="max-w-3xl">
            {/* Üst etiket */}
            <motion.p
              variants={rise}
              custom={0.1}
              initial={reduce ? false : "hidden"}
              animate={reduce ? false : "show"}
              className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-cream/70"
            >
              <span className="h-px w-8 bg-terracotta/70" />
              {hero.eyebrow}
            </motion.p>

            {/* Başlık — satır satır "perde açılma" ile belirir */}
            <h1 className="font-serif text-[2.75rem] leading-[1.05] sm:text-6xl md:text-7xl">
              {hero.titleLines.map((line, index) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    variants={wipe}
                    custom={0.2 + index * 0.15}
                    initial={reduce ? false : "hidden"}
                    animate={reduce ? false : "show"}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Alt metin */}
            <motion.p
              variants={rise}
              custom={0.55}
              initial={reduce ? false : "hidden"}
              animate={reduce ? false : "show"}
              className="mt-6 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg"
            >
              {hero.subtitle}
            </motion.p>

            {/* Çağrı butonları — masaüstünde imleci hafifçe takip eder */}
            <motion.div
              variants={rise}
              custom={0.68}
              initial={reduce ? false : "hidden"}
              animate={reduce ? false : "show"}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <MagneticWrap>
                <ButtonLink href={hero.primaryCta.href} variant="light" className="group">
                  {hero.primaryCta.label}
                  <ArrowDown
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </ButtonLink>
              </MagneticWrap>
              <MagneticWrap>
                <ButtonLink href={hero.secondaryCta.href} variant="outline-light">
                  {hero.secondaryCta.label}
                </ButtonLink>
              </MagneticWrap>
            </motion.div>

            {/* Güven çipleri */}
            <motion.ul
              variants={rise}
              custom={0.8}
              initial={reduce ? false : "hidden"}
              animate={reduce ? false : "show"}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
            >
              {hero.chips.map((chip) => {
                const Icon = chip.icon;
                return (
                  <li
                    key={chip.title}
                    className="inline-flex items-center gap-2 text-sm text-cream/75"
                  >
                    <Icon className="h-4 w-4 text-terracotta" aria-hidden="true" />
                    {chip.title}
                  </li>
                );
              })}
            </motion.ul>
          </div>
        </Container>
      </motion.div>

      {/* --- Aşağı kaydır ipucu: ince çizgi + içinde akan nokta --- */}
      <a
        href="#hakkimizda"
        aria-label="Aşağı kaydır"
        className="absolute inset-x-0 bottom-6 z-10 mx-auto flex w-fit flex-col items-center gap-2 text-cream/60 transition-colors hover:text-cream"
      >
        <span className="text-[10px] uppercase tracking-[0.22em]">
          {hero.scrollHint}
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-cream/20">
          <motion.span
            className="absolute left-0 top-0 block h-4 w-px bg-cream/80"
            animate={reduce ? undefined : { y: ["-120%", "260%"] }}
            transition={
              reduce
                ? undefined
                : { duration: 1.9, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </span>
      </a>
    </section>
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
function HeroMotif({ reduce }: { reduce: boolean }) {
  // 3 sütun x 4 satırlık pencere ızgarası için koordinatlar.
  const windowCols = [44, 92, 140];
  const windowRows = [44, 98, 152, 206];

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
