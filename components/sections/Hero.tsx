import Image from "next/image";
import { ChevronDown } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { hero } from "@/lib/content";

// =====================================================================
// KARŞILAMA (HERO) BÖLÜMÜ
// ---------------------------------------------------------------------
// Sayfanın ilk, sinematik ekranı. Tam yükseklikte (min-h-dvh), koyu ve
// atmosferik; başlık serif, butonlar açık renk. Üstte form YOK — sadece
// "Odaları Keşfet" ve "İletişime Geç" çağrıları.
// Fotoğraf eklemek için lib/content.ts içindeki hero.image alanını doldurun.
// =====================================================================
export default function Hero() {
  return (
    <section
      id="anasayfa"
      className="relative flex min-h-dvh items-center overflow-hidden bg-ink text-cream"
    >
      {/* --- Arka plan katmanları --- */}
      <div className="absolute inset-0">
        {hero.image ? (
          // Gerçek fotoğraf varsa tam ekran göster.
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          // Fotoğraf yokken: koyu zeminde soluk dev monogram (doku hissi).
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-[6%] bottom-[-12%] select-none font-serif text-[42vw] leading-none text-cream/[0.04] sm:text-[30vw]"
          >
            İzem
          </span>
        )}
        {/* Sıcak ışık parıltısı (terracotta) — premium derinlik için */}
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_75%_15%,rgba(177,106,76,0.16),transparent_60%)]" />
        {/* Metnin net okunması için yumuşak karartma */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/55" />
      </div>

      {/* --- İçerik --- */}
      <Container className="relative z-10 py-28">
        <div className="max-w-3xl">
          <Reveal>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-cream/70">
              {hero.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="font-serif text-[2.75rem] leading-[1.05] sm:text-6xl md:text-7xl">
              {hero.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={hero.primaryCta.href} variant="light">
                {hero.primaryCta.label}
              </ButtonLink>
              <ButtonLink href={hero.secondaryCta.href} variant="outline-light">
                {hero.secondaryCta.label}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>

      {/* --- Aşağı kaydır ipucu --- */}
      <a
        href="#hakkimizda"
        aria-label="Aşağı kaydır"
        className="absolute inset-x-0 bottom-6 z-10 mx-auto flex w-fit flex-col items-center gap-1.5 text-cream/60 transition-colors hover:text-cream"
      >
        <span className="text-[10px] uppercase tracking-[0.22em]">
          {hero.scrollHint}
        </span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  );
}
