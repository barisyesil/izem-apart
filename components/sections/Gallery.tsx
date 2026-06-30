"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Container from "@/components/ui/Container";
import Figure from "@/components/ui/Figure";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { gallery } from "@/lib/content";

// =====================================================================
// GALERİ BÖLÜMÜ
// ---------------------------------------------------------------------
// Görselleri bir ızgarada gösterir; birine tıklanınca tam ekran
// "lightbox" açılır (ok tuşları/ileri-geri ile gezilir, Esc ile kapanır).
// Tıklama/klavye gerektirdiği için İstemci Bileşeni ("use client").
// =====================================================================
export default function Gallery() {
  const images = gallery.images;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const showNext = () =>
    setActiveIndex((i) => (i === null ? i : (i + 1) % images.length));
  const showPrev = () =>
    setActiveIndex((i) =>
      i === null ? i : (i - 1 + images.length) % images.length,
    );

  // Lightbox açıkken: arka plan kaymasını kilitle + klavye kısayolları.
  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const active = activeIndex === null ? null : images[activeIndex];

  return (
    <Section id="galeri" className="bg-sand">
      <Container>
        <SectionHeading
          eyebrow={gallery.eyebrow}
          title={gallery.title}
          align="center"
        />
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-taupe">
          {gallery.intro}
        </p>

        {/* Izgara */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {images.map((image, index) => (
            <button
              key={image.alt}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${image.alt} — büyüt`}
              className="group block overflow-hidden rounded-xl"
            >
              <Figure
                src={image.src}
                alt={image.alt}
                label="Foto"
                className="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </button>
          ))}
        </div>
      </Container>

      {/* --- LIGHTBOX (tam ekran görüntüleyici) --- */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Galeri görüntüleyici"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Kapat"
            className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full text-cream/80 transition-colors hover:text-cream"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Önceki görsel"
            className="absolute left-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-cream/80 transition-colors hover:text-cream sm:left-5"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <Figure
              src={active.src}
              alt={active.alt}
              label="Foto"
              className="aspect-[4/3] w-full overflow-hidden rounded-xl"
              sizes="100vw"
            />
            <p className="mt-3 text-center text-sm text-cream/70">
              {active.alt} · {(activeIndex ?? 0) + 1}/{images.length}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Sonraki görsel"
            className="absolute right-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-cream/80 transition-colors hover:text-cream sm:right-5"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      )}
    </Section>
  );
}
