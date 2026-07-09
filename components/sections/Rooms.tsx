"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Expand } from "lucide-react";
import Container from "@/components/ui/Container";
import Figure from "@/components/ui/Figure";
import Lightbox from "@/components/ui/Lightbox";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { chapters, rooms, site } from "@/lib/content";
import type { Room } from "@/lib/types";

// =====================================================================
// ODALARIMIZ BÖLÜMÜ — "Yan Yana Karşılaştırma"
// ---------------------------------------------------------------------
// İki oda tipi, masaüstünde YAN YANA iki eş kart olarak durur; ziyaretçi
// ikisini aynı anda görüp doğrudan karşılaştırabilir. Özellik listeleri
// iki kartta da AYNI SIRADA yazıldığı için satırlar hizalanır ve göz,
// farkları satır satır yakalar (içerik sırası lib/content.ts'te).
// Her kartın üstünde, odanın kendi fotoğrafları arasında gezilebilen
// mini bir Embla kaydırıcısı vardır (oklar + noktalar + büyütme).
// Büyütme, aynı fotoğrafları paylaşılan Lightbox'ta açar.
// Dar ekranlarda kartlar alt alta iner.
// "Hareketi azalt" açıksa: kartların belirme animasyonu kapalıdır,
// kaydırıcı elle kullanılabilir.
// =====================================================================
export default function Rooms() {
  // Hangi odanın galerisi Lightbox'ta açık ve hangi fotoğraftayız?
  const [openRoomId, setOpenRoomId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openRoom = rooms.items.find((room) => room.id === openRoomId);

  return (
    <Section id="odalar" className="bg-cream">
      <Container>
        <SectionHeading
          eyebrow={rooms.eyebrow}
          number={chapters.find((c) => c.id === "odalar")?.number}
          title={rooms.title}
        />
        <p className="mt-4 max-w-xl text-base leading-relaxed text-taupe sm:text-lg">
          {rooms.intro}
        </p>

        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2 lg:gap-8">
          {rooms.items.map((room, index) => (
            <RoomCard
              key={room.id}
              room={room}
              order={index}
              onOpenGallery={(photoIndex) => {
                setOpenRoomId(room.id);
                setActiveIndex(photoIndex);
              }}
            />
          ))}
        </div>
      </Container>

      {/* Sadece açık olan odanın kendi fotoğrafları gösterilir */}
      <Lightbox
        images={openRoom?.gallery ?? []}
        index={openRoom ? activeIndex : null}
        onClose={() => setOpenRoomId(null)}
        onIndexChange={setActiveIndex}
      />
    </Section>
  );
}

function RoomCard({
  room,
  order,
  onOpenGallery,
}: {
  room: Room;
  order: number;
  onOpenGallery: (photoIndex: number) => void;
}) {
  const reduceMotion = useReducedMotion();

  // Kartın üstündeki mini fotoğraf kaydırıcısı.
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const whatsappHref = `${site.whatsappHref}?text=${encodeURIComponent(
    `Merhaba, ${room.name} hakkında bilgi almak istiyorum.`,
  )}`;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: order * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full flex-col overflow-hidden rounded-3xl bg-warmwhite ring-1 ring-hairline shadow-[0_18px_50px_-30px_rgba(38,35,33,0.35)]"
    >
      {/* --- Fotoğraf kaydırıcısı --- */}
      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {room.gallery.map((image, photoIndex) => (
              <div key={image.src} className="relative min-w-0 flex-[0_0_100%]">
                <Figure
                  src={image.src}
                  alt={image.alt}
                  label={room.name}
                  className="aspect-[4/3] w-full"
                  sizes="(max-width: 768px) 100vw, 560px"
                  loading={photoIndex === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Fotoğraf sayacı (sol üst) + büyütme (sağ üst) */}
        <span className="absolute left-3 top-3 rounded-full bg-ink/50 px-3 py-1.5 text-xs tabular-nums text-cream/90 backdrop-blur-sm">
          {selected + 1} / {room.gallery.length}
        </span>
        <button
          type="button"
          onClick={() => onOpenGallery(selected)}
          aria-label={`${room.name} fotoğrafını büyüt`}
          className="absolute right-3 top-3 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-ink/50 text-cream backdrop-blur-sm transition-colors hover:bg-ink/75"
        >
          <Expand className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Oklar (sağ alt) */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Önceki fotoğraf"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-ink/50 text-cream backdrop-blur-sm transition-colors hover:bg-ink/75"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Sonraki fotoğraf"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-ink/50 text-cream backdrop-blur-sm transition-colors hover:bg-ink/75"
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Noktalar (sol alt) */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-ink/40 px-2.5 py-2 backdrop-blur-sm">
          {room.gallery.map((image, dotIndex) => (
            <button
              key={image.src}
              type="button"
              onClick={() => emblaApi?.scrollTo(dotIndex)}
              aria-label={`${dotIndex + 1}. fotoğrafa git`}
              aria-current={selected === dotIndex ? "true" : undefined}
              className="group inline-flex h-6 w-4 cursor-pointer items-center justify-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  selected === dotIndex
                    ? "w-4 bg-cream"
                    : "w-1.5 bg-cream/45 group-hover:bg-cream/75"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* --- İçerik --- */}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <span className="text-xs font-medium uppercase tracking-[0.24em] text-terracotta-deep">
         
        </span>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h3 className="font-serif text-3xl text-espresso sm:text-4xl">
            {room.name}
          </h3>
          <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-medium text-sage-deep">
            {room.capacity}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-taupe sm:text-base">
          {room.description}
        </p>

        {/* Özellikler — iki kartta da aynı sırada, tek sütun: yan yana
            duran kartlarda satırlar hizalanır ve karşılaştırma kolaylaşır. */}
        <ul className="mt-6 space-y-2.5 border-t border-hairline pt-5">
          {room.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm text-ink">
              <Check className="h-4 w-4 shrink-0 text-sage-deep" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Çağrılar — kart boyları farklı olsa da butonlar alta hizalanır */}
        <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => onOpenGallery(selected)}
            className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-cream transition-colors hover:bg-espresso"
          >
            Fotoğrafları Gör ({room.gallery.length})
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-hairline px-6 text-sm text-ink transition-colors hover:bg-sand/60"
          >
            Bu Odayı Sor
          </a>
        </div>
      </div>
    </motion.article>
  );
}
