"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { hero } from "@/lib/content";

// =====================================================================
// KARŞILAMA (HERO) BÖLÜMÜ — "Garaj Kapısı"
// =====================================================================

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="anasayfa"
      className="relative z-10 flex min-h-dvh flex-col overflow-hidden bg-ink text-cream"
    >
      {/* --- Arka plan --- */}
      <div aria-hidden="true" className="absolute inset-0">
        {hero.image && (
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            preload
            sizes="100vw"
            className="animate-hero-pan object-cover object-[30%_38%]"
          />
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-ink/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ink/95 via-ink/55 to-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* --- İçerik --- 
          my-auto ile dikeyde ortalandı. */}
      <div className="relative z-10 my-auto w-full pt-[calc(var(--header-h)_+_2rem)] pb-12 sm:pb-16 lg:pb-20">
        <Container>
          {/* Sola yaklaştırıldı ve max-w genişletildi */}
          <div className="max-w-2xl md:ml-4 lg:ml-8">
            <Reveal delay={0.05}>
              <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-cream/70 sm:text-sm">
                <span className="h-px w-8 bg-terracotta/70" />
                {hero.eyebrow}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              {/* Boyutlar bir tık büyütüldü */}
              <h1 className="font-serif text-4xl leading-[1.08] text-cream [text-shadow:0_2px_28px_rgba(0,0,0,0.4)] sm:text-5xl md:text-6xl lg:text-7xl">
                {hero.titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </Reveal>

            <Reveal delay={0.28}>
              {/* Alt metin biraz daha okunaklı yapıldı */}
              <p className="mt-6 max-w-md text-base leading-relaxed text-cream/80 sm:text-lg">
                {hero.subtitle}
              </p>
            </Reveal>

            <Reveal delay={0.4} className="mt-9 inline-block">
              {/* Butonlar eski doyurucu boyutuna (48px) geri getirildi */}
              <div className="inline-flex overflow-hidden rounded-full border border-cream/25">
                <a
                  href={hero.primaryCta.href}
                  className="inline-flex min-h-[48px] items-center gap-2 bg-cream px-5 text-base font-medium text-ink transition-colors hover:bg-warmwhite sm:px-7"
                >
                  {hero.primaryCta.label}
                </a>
                <a
                  href={hero.secondaryCta.href}
                  className="group inline-flex min-h-[48px] items-center gap-2 border-l border-cream/25 px-5 text-base font-medium text-cream transition-colors hover:bg-cream/10 sm:px-7"
                >
                  {hero.secondaryCta.label}
                  <ArrowRight
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
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