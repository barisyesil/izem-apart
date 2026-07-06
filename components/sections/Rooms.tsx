"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Expand } from "lucide-react";
import Container from "@/components/ui/Container";
import Figure from "@/components/ui/Figure";
import Lightbox from "@/components/ui/Lightbox";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { chapters, rooms, site } from "@/lib/content";
import type { Room } from "@/lib/types";

// Özellik çipleri için "sırayla belirme" (stagger) varyantları.
const chipList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const chipItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

// =====================================================================
// ODALARIMIZ BÖLÜMÜ — "Süit Kartları"
// ---------------------------------------------------------------------
// Her oda tipi; fotoğrafın KENDİSİNİN zemin olduğu, tam genişlikte,
// sinematik bir kart. Kartlar kaydırdıkça üst üste "desteleniyor"
// (position: sticky) — ikinci kart, birincinin üzerine bir kapak gibi
// kayar. Kartın içinde:
//   - Zemin: odanın kendi fotoğrafları arasında elle/parmakla gezilebilen
//     mini bir Embla kaydırıcısı (oklar + noktalar).
//   - Fotoğraf, kaydırma sırasında çok hafif bir parallax ile "nefes alır".
//   - Metin okunabilirliği için sol-alttan yükselen yönlü karartma.
//   - Büyüt düğmesi: aynı fotoğrafları paylaşılan Lightbox'ta açar.
// PDF revizesindeki "section boyutları yeniden tasarlanabilir" notuna
// cevaben: iki ayrı görsel+metin bloğu yerine, ekrana tam oturan iki
// kompakt sahne — bölümün toplam boyu kısalırken his büyür.
// "Hareketi azalt" açıksa: parallax ve stagger kapalı; kaydırıcı elle
// kullanılabilir, kartlar sabit akışta durur.
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

        {/* Deste: kartlar sticky ile aynı üst noktaya tutunur; sonraki
            kart öncekinin üzerine kayar. Her kartın "top" değeri bir tık
            farklı ki alttaki kartın üst kenarı ince bir şerit gibi görünüp
            "burada bir deste var" hissi versin. */}
        <div className="mt-12 space-y-8 sm:space-y-10">
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
  const cardRef = useRef<HTMLElement>(null);

  // Kart ekranda aşağıdan yukarı süzülürken fotoğraf zeminine çok hafif
  // bir dikey kayma (parallax) verilir. Fotoğraf %10 büyütüldüğü için
  // kayma kenarlarda boşluk açmaz.
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  // Kartın içindeki mini fotoğraf kaydırıcısı.
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
    <article
      ref={cardRef}
      className="sticky overflow-hidden rounded-3xl bg-ink text-cream shadow-[0_24px_60px_-24px_rgba(38,35,33,0.45)]"
      // Kart, sabit başlığın hemen altına tutunur; her kart bir öncekinden
      // 0.75rem daha aşağıda durur ki destelenme görünür olsun.
      style={{ top: `calc(var(--header-h) + ${0.75 + order * 0.75}rem)` }}
    >
      <div className="relative flex min-h-[76vh] flex-col justify-end sm:min-h-[70vh]">
        {/* --- Fotoğraf zemini: mini kaydırıcı + parallax --- */}
        <motion.div
          aria-hidden={false}
          style={reduceMotion ? undefined : { y: parallaxY }}
          className="absolute inset-0 scale-110"
        >
          <div ref={emblaRef} className="h-full overflow-hidden">
            <div className="flex h-full touch-pan-y">
              {room.gallery.map((image, photoIndex) => (
                <div key={image.src} className="relative min-w-0 flex-[0_0_100%]">
                  <Figure
                    src={image.src}
                    alt={image.alt}
                    label={room.name}
                    className="h-full w-full"
                    sizes="(max-width: 1024px) 100vw, 1152px"
                    loading={photoIndex === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Okunabilirlik karartması: alttan yukarı + soldan sağa */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/45 to-transparent"
        />

        {/* --- Sağ üst: fotoğraf kontrolleri --- */}
        <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">
          <span className="mr-1 rounded-full bg-ink/45 px-3 py-1.5 text-xs tabular-nums text-cream/90 backdrop-blur-sm">
            {selected + 1} / {room.gallery.length}
          </span>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Önceki fotoğraf"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-ink/45 text-cream backdrop-blur-sm transition-colors hover:bg-ink/70"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Sonraki fotoğraf"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-ink/45 text-cream backdrop-blur-sm transition-colors hover:bg-ink/70"
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onOpenGallery(selected)}
            aria-label={`${room.name} fotoğrafını büyüt`}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-ink/45 text-cream backdrop-blur-sm transition-colors hover:bg-ink/70"
          >
            <Expand className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* --- İçerik --- */}
        {/* Üst boşluk (pt-24), dar ekranda içerik kartı doldurduğunda
            başlığın sağ üstteki fotoğraf kontrolleriyle çakışmasını önler. */}
        <div className="relative z-10 p-6 pt-24 sm:p-10 sm:pt-24 lg:p-14">
          {/* Büyük, yarı saydam bölüm numarası — kart kimliği */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 right-6 hidden font-serif text-[9rem] leading-none text-cream/10 sm:block lg:right-14"
          >
            0{order + 1}
          </span>

          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-serif text-4xl text-cream sm:text-5xl">
                {room.name}
              </h3>
              <span className="rounded-full border border-cream/30 bg-cream/10 px-3 py-1 text-xs font-medium text-cream/90 backdrop-blur-sm">
                {room.capacity}
              </span>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-cream/80 sm:text-base">
              {room.description}
            </p>

            {/* Özellikler — küçük cam çipler, sırayla belirir */}
            <motion.ul
              className="mt-6 flex flex-wrap gap-2"
              variants={reduceMotion ? undefined : chipList}
              initial={reduceMotion ? undefined : "hidden"}
              whileInView={reduceMotion ? undefined : "show"}
              viewport={{ once: true, margin: "-60px" }}
            >
              {room.features.map((feature) => (
                <motion.li
                  key={feature}
                  variants={reduceMotion ? undefined : chipItem}
                  className="inline-flex items-center gap-1.5 rounded-full border border-cream/20 bg-cream/10 px-3 py-1.5 text-xs text-cream/90 backdrop-blur-sm sm:text-sm"
                >
                  <Check className="h-3.5 w-3.5 text-terracotta" aria-hidden="true" />
                  {feature}
                </motion.li>
              ))}
            </motion.ul>

            {/* Çağrılar */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => onOpenGallery(selected)}
                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-full bg-cream px-6 text-sm font-medium text-ink transition-colors hover:bg-warmwhite"
              >
                Fotoğrafları Gör ({room.gallery.length})
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-cream/40 px-6 text-sm text-cream transition-colors hover:bg-cream/10"
              >
                Bu Odayı Sor
              </a>
            </div>
          </div>

          {/* Noktalar (fotoğraf göstergesi) */}
          <div className="mt-7 flex items-center gap-2">
            {room.gallery.map((image, dotIndex) => (
              <button
                key={image.src}
                type="button"
                onClick={() => emblaApi?.scrollTo(dotIndex)}
                aria-label={`${dotIndex + 1}. fotoğrafa git`}
                aria-current={selected === dotIndex ? "true" : undefined}
                className="group inline-flex h-8 w-8 cursor-pointer items-center justify-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    selected === dotIndex
                      ? "w-6 bg-cream"
                      : "w-1.5 bg-cream/40 group-hover:bg-cream/70"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
