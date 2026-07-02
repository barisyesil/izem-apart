"use client";

import { useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import Container from "@/components/ui/Container";
import Figure from "@/components/ui/Figure";
import Lightbox from "@/components/ui/Lightbox";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { chapters, gallery } from "@/lib/content";

// =====================================================================
// GALERİ BÖLÜMÜ
// ---------------------------------------------------------------------
// Sabit bir ızgara yerine, TÜM fotoğrafları içeren, sürekli kayan
// ("marquee") tek satırlık bir şerit. Üzerine gelince/dokununca durur.
// Herhangi bir fotoğrafa tıklandığında, o fotoğraf açık şekilde TÜM
// galeriyi gezebileceğiniz paylaşılan Lightbox açılır.
//
// "Hareketi azalt" açıksa: şerit çoğaltılmaz ve otomatik KAYMAZ; bunun
// yerine elle sağa/sola kaydırabileceğiniz sade bir sıraya döner.
// =====================================================================
export default function Gallery() {
  const images = gallery.images;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  // Kesintisiz döngü için şeridi normal modda iki katına çıkarıyoruz
  // (translateX(-50%) tam olarak bir kopyanın genişliği kadar kayar).
  const track = reduceMotion ? images : [...images, ...images];

  // Fotoğraf sayısına göre hız — daha çok fotoğraf, biraz daha uzun tur.
  const trackStyle = {
    "--marquee-duration": `${images.length * 4}s`,
  } as CSSProperties;

  return (
    <Section id="galeri" className="bg-sand">
      <Container>
        <SectionHeading
          eyebrow={gallery.eyebrow}
          number={chapters.find((c) => c.id === "galeri")?.number}
          title={gallery.title}
          align="center"
        />
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-taupe">
          {gallery.intro}
        </p>
      </Container>

      {/* Şerit, sayfa genişliğini taşarak kenarlara kadar uzanır. */}
      <div className="mt-12 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          style={trackStyle}
          className={`flex w-max gap-4 px-5 sm:gap-5 sm:px-8 ${
            reduceMotion ? "" : "animate-marquee"
          }`}
        >
          {track.map((image, trackIndex) => {
            const originalIndex = trackIndex % images.length;
            return (
              <button
                key={`${image.src}-${trackIndex}`}
                type="button"
                onClick={() => setActiveIndex(originalIndex)}
                aria-label={`${image.alt} — büyüt`}
                className="group relative block w-[210px] shrink-0 overflow-hidden rounded-xl sm:w-[260px]"
              >
                <Figure
                  src={image.src}
                  alt={image.alt}
                  label="Foto"
                  className="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-105"
                  sizes="260px"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/25 group-hover:opacity-100">
                  <ZoomIn className="h-7 w-7 text-cream drop-shadow" aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Lightbox
        images={images}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
    </Section>
  );
}
