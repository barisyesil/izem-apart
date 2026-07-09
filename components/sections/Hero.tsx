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
import { ArrowDown, ArrowRight } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import MagneticWrap from "@/components/ui/MagneticWrap";
import { hero } from "@/lib/content";

// =====================================================================
// KARŞILAMA (HERO) BÖLÜMÜ — "Kapı Aralığı"
// ---------------------------------------------------------------------
// Önceki sürüm içeriği DİKEY ORTALIYORDU (items-center) — bu, büyük bir
// fotoğrafın üzerinde metnin "ortada asılı kalmış", kadrajla güçlü bir
// ilişkisi olmayan bir izlenim veriyordu. Bu sürüm içeriği bilinçli olarak
// EKRANIN ALTINA yaslıyor (justify-end): editoryal/awwwards tarzı
// kompozisyonlarda başlık genelde bir kenara "oturur", ortada yüzmez.
// Bu da metne kadrajla net, kasıtlı bir ilişki kurduruyor.
//
// TEK bir sahne-açılış anı: fotoğrafın önünde duran koyu bir "perde"
// (CurtainReveal) sayfa yüklenince sola doğru kayarak açılır — sanki
// eve giden kapı aralanıyormuş gibi. Önceki sürümdeki birbirinden
// bağımsız 5-6 ayrı animasyon (zoom+fade, dane grenli doku, çipler
// sırası, buton gecikmeleri...) yerine TEK, kasıtlı bir sahne kurulumu:
// perde açılır → başlık kalkar → alt metin ve çağrı belirir. Güven
// çipleri (24 saat güvenlik vb.) buradan kaldırıldı çünkü hemen altındaki
// Trust bölümü bunu zaten simgeleriyle birlikte, daha ayrıntılı anlatıyor
// — Hero'nun TEK işi artık markanın kimliğini net bir şekilde söylemek.
// "Hareketi azalt" açıksa: perde hiç render edilmez, içerik anında görünür.
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
// çerçevenin (overflow-hidden) altından yukarı doğru kayarak ortaya çıkar.
const wipe: Variants = {
  hidden: { y: "115%" },
  show: (delay = 0) => ({
    y: "0%",
    transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

// HeroMotif'teki 12 pencere (4 satır x 3 sütun) için sabit titreşim
// değerleri — sırayla değil, dağınık/organik hissettiren ama sabit
// (Math.random() DEĞİL — sunucu/tarayıcı ilk render'da aynı sonucu
// üretmeli, hydration uyumsuzluğu olmasın diye) gecikme/süre/duraklama.
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
      className="relative flex min-h-dvh flex-col justify-end overflow-hidden bg-ink text-cream"
    >
      {/* --- Arka plan (parallax) --- */}
      <motion.div aria-hidden="true" style={reduce ? undefined : { y: bgY }} className="absolute inset-0">
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
          <HeroMotif reduce={!!reduce} />
        )}

        {/* Sahne açılışı: koyu bir "perde" fotoğrafın önünü kapatır ve
            yüklenince sola doğru kayarak açılır (transform-origin: sol) —
            eve açılan bir kapı aralanıyormuş hissi. Tek, GPU dostu bir
            transform (scaleX) — layout'u hiç etkilemez. */}
        {!reduce && (
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 1.3, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
            style={{ transformOrigin: "left" }}
            className="absolute inset-0 bg-ink"
          />
        )}
      </motion.div>

      {/* Başlığın oturduğu alt bölge için: yukarıdan hafif, aşağıdan güçlü
          bir karartma — içerik artık ekranın ALTINDA yaşadığı için zemin
          orada en koyu, header'ın oturduğu üstte ise en açık. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-ink/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-ink/95 via-ink/60 to-transparent"
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

      {/* --- İçerik (ekranın altına yaslı) --- */}
      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full"
      >
        <Container className="pb-16 sm:pb-20 lg:pb-24">
          <div className="max-w-2xl">
            {/* Üst etiket */}
            <motion.p
              variants={rise}
              custom={0.9}
              initial={reduce ? false : "hidden"}
              animate={reduce ? false : "show"}
              className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-cream/70"
            >
              <span className="h-px w-8 bg-terracotta/70" />
              {hero.eyebrow}
            </motion.p>

            {/* Başlık — büyük, kendinden emin bir editoryal ölçek; satır
                satır "perde açılma" ile belirir. */}
            <h1 className="font-serif text-[3rem] leading-[0.98] [text-shadow:0_2px_28px_rgba(0,0,0,0.4)] sm:text-[4.25rem] md:text-[5.75rem] lg:text-[6.75rem] lg:leading-[0.94]">
              {hero.titleLines.map((line, index) => (
                // pb-[0.2em]: "perde açılma" efekti için gereken overflow-hidden,
                // sıkı leading ile birleşince alt kuyruklu (descender) harfleri
                // kırpıyordu. Bu alt boşluk kırpma sınırını aşağı iter.
                <span key={line} className="block overflow-hidden pb-[0.2em]">
                  <motion.span
                    className="block"
                    variants={wipe}
                    custom={1.0 + index * 0.12}
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
              custom={1.4}
              initial={reduce ? false : "hidden"}
              animate={reduce ? false : "show"}
              className="mt-6 max-w-md text-base leading-relaxed text-cream/80 sm:text-lg"
            >
              {hero.subtitle}
            </motion.p>

            {/* Çağrılar — TEK öne çıkan dolu buton + yanında sade, altı
                çizili bir metin bağlantısı. İkisi eşit ağırlıkta iki buton
                yerine tek bir net eylem sunar, ikincisi daha sakin durur. */}
            <motion.div
              variants={rise}
              custom={1.55}
              initial={reduce ? false : "hidden"}
              animate={reduce ? false : "show"}
              className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4"
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
              <a
                href={hero.secondaryCta.href}
                className="group inline-flex items-center gap-2 text-sm font-medium text-cream/85 transition-colors hover:text-cream"
              >
                <span className="border-b border-cream/40 pb-0.5 transition-colors group-hover:border-cream">
                  {hero.secondaryCta.label}
                </span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </motion.div>
          </div>
        </Container>
      </motion.div>

      {/* --- Aşağı kaydır ipucu: ince çizgi + içinde akan nokta --- */}
      {/* İçerik artık sol altta oturduğu için ipucu sağ alt köşeye taşındı
          — ikisi çakışıp kalabalıklaşmasın diye. */}
      <a
        href="#hakkimizda"
        aria-label="Aşağı kaydır"
        className="absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-2 text-cream/60 transition-colors hover:text-cream sm:right-8 lg:flex"
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
