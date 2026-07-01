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
import { hero } from "@/lib/content";

// =====================================================================
// KARŞILAMA (HERO) BÖLÜMÜ
// ---------------------------------------------------------------------
// Sayfanın ilk, sinematik ekranı. Koyu ve atmosferik; başlık serif satır
// satır belirir, altında güven çipleri, sıcak bir parıltı ve ince film
// dokusu vardır. Kaydırdıkça arka plan hafifçe kayar (parallax).
// "use client": animasyon ve kaydırma tarayıcıda çalışır.
// "Hareketi azalt" açıksa tüm animasyonlar kapanır, içerik sabit kalır.
// Fotoğraf eklemek için lib/content.ts içindeki hero.image alanını doldurun.
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
            priority
            sizes="100vw"
            className="scale-110 object-cover"
          />
        ) : (
          <span className="pointer-events-none absolute -right-[6%] bottom-[-12%] select-none font-serif text-[42vw] leading-none text-cream/[0.045] sm:text-[30vw]">
            İzem
          </span>
        )}
      </motion.div>

      {/* Sıcak, yavaşça "nefes alan" terracotta parıltısı */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_75%_15%,rgba(177,106,76,0.20),transparent_60%)]"
        animate={reduce ? undefined : { opacity: [0.55, 0.9, 0.55] }}
        transition={
          reduce ? undefined : { duration: 9, repeat: Infinity, ease: "easeInOut" }
        }
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

            {/* Başlık — satır satır belirir */}
            <h1 className="font-serif text-[2.75rem] leading-[1.05] sm:text-6xl md:text-7xl">
              {hero.titleLines.map((line, index) => (
                <motion.span
                  key={line}
                  className="block"
                  variants={rise}
                  custom={0.2 + index * 0.12}
                  initial={reduce ? false : "hidden"}
                  animate={reduce ? false : "show"}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            {/* Alt metin */}
            <motion.p
              variants={rise}
              custom={0.5}
              initial={reduce ? false : "hidden"}
              animate={reduce ? false : "show"}
              className="mt-6 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg"
            >
              {hero.subtitle}
            </motion.p>

            {/* Çağrı butonları */}
            <motion.div
              variants={rise}
              custom={0.62}
              initial={reduce ? false : "hidden"}
              animate={reduce ? false : "show"}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <ButtonLink href={hero.primaryCta.href} variant="light" className="group">
                {hero.primaryCta.label}
                <ArrowDown
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </ButtonLink>
              <ButtonLink href={hero.secondaryCta.href} variant="outline-light">
                {hero.secondaryCta.label}
              </ButtonLink>
            </motion.div>

            {/* Güven çipleri */}
            <motion.ul
              variants={rise}
              custom={0.74}
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
