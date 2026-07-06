"use client";

import { useState, type MouseEvent } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ZoomIn } from "lucide-react";
import Container from "@/components/ui/Container";
import Figure from "@/components/ui/Figure";
import Lightbox from "@/components/ui/Lightbox";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { chapters, gallery } from "@/lib/content";
import { useFinePointer } from "@/lib/useFinePointer";
import type { GalleryImage } from "@/lib/types";

// =====================================================================
// GALERİ BÖLÜMÜ
// ---------------------------------------------------------------------
// TÜM fotoğrafları içeren, sürekli kayan tek satırlık bir şerit.
// Herhangi bir fotoğrafa tıklandığında, o fotoğraf açık şekilde TÜM
// galeriyi gezebileceğiniz paylaşılan Lightbox açılır. Masaüstünde her
// fotoğraf, imlecin pozisyonuna göre hafifçe eğilir (3B tilt).
//
// KAYDIRMA MEKANİZMASI — Embla Carousel (+ AutoScroll eklentisi):
// Önceki iki sürüm (CSS keyframe, sonra elle requestAnimationFrame)
// düşük performanslı cihazlarda / yavaş ağlarda "fotoğraflar ara ara
// kayboluyor" şikayetine yol açtı. Embla, shadcn/ui'nin Carousel'inin
// de altında yatan, savaşta test edilmiş kaydırma motorudur: sonsuz
// döngüyü DOM kopyalamadan (transform konumlandırmayla) çözer, parmakla
// sürükleme/fırlatma desteği hazır gelir ve görünürlük hesapları
// tarayıcı farklarına dayanıklıdır.
//  - loop: sonsuz şerit hissi
//  - dragFree: kaydırınca "kartlara oturmadan" serbest akış
//  - AutoScroll: kesintisiz, sabit hızlı kayma; üzerine gelince veya
//    içine klavye odağı girince durur, ayrılınca kaldığı yerden sürer.
// "Hareketi azalt" açıksa: otomatik kayma tamamen kapalıdır; şerit
// elle kaydırılabilir sade bir sıraya döner.
// =====================================================================
export default function Gallery() {
  const images = gallery.images;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const isFine = useFinePointer();

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      skipSnaps: true,
      align: "start",
      containScroll: false,
    },
    reduceMotion
      ? []
      : [
          AutoScroll({
            // px/kare (~60fps'te 1.1 ≈ saniyede ~66px — eski şeridin hızı).
            speed: 1.1,
            startDelay: 0,
            stopOnInteraction: false, // sürükleme bitince kaldığı yerden devam
            stopOnMouseEnter: isFine, // fotoğrafa bakmak/tıklamak için duraklat
            stopOnFocusIn: true, // klavye erişilebilirliği
          }),
        ],
  );

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
      <div ref={emblaRef} className="mt-12 overflow-hidden" aria-label="Fotoğraf şeridi">
        <div className="flex touch-pan-y">
          {images.map((image, index) => (
            <div
              key={image.src}
              className="min-w-0 flex-none pl-4 first:pl-5 sm:pl-5 sm:first:pl-8"
            >
              <GalleryPhoto image={image} onOpen={() => setActiveIndex(index)} />
            </div>
          ))}
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

// Tek bir galeri fotoğrafı. Masaüstünde imleç fotoğrafın üzerinde hangi
// noktadaysa karta o yöne hafifçe "eğilme" (3B tilt) hissi verir; bu
// hisle ÇAKIŞMASIN diye büyüme (scale) efekti de AYNI Framer Motion
// nesnesinde yönetilir — CSS "hover:scale" ile karışırsa ikisi birbirini
// bozar, bu yüzden burada sadece tek bir hareket mekanizması kullanılır.
// Figure'a loading="eager" veriyoruz: şerit gerçek scroll değil, Embla
// transform ile kaydırıyor; tarayıcının "görünürlüğe yakın" tembel-
// yükleme sezgisi kareleri geç tetikleyebilirdi. Fotoğraflar optimize
// WebP olduğu için hepsini baştan yüklemenin maliyeti düşük.
function GalleryPhoto({
  image,
  onOpen,
}: {
  image: GalleryImage;
  onOpen: () => void;
}) {
  const isFine = useFinePointer();
  const reduceMotion = useReducedMotion();
  const tiltEnabled = isFine && !reduceMotion;

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 220, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 220, damping: 20 });

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (!tiltEnabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(relX * 12);
    rotateX.set(relY * -12);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={`${image.alt} — büyüt`}
      className="group relative block w-[210px] shrink-0 cursor-pointer overflow-hidden rounded-xl sm:w-[260px]"
      style={
        tiltEnabled
          ? { rotateX: springRotateX, rotateY: springRotateY, transformPerspective: 600 }
          : undefined
      }
      whileHover={reduceMotion ? undefined : { scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Figure
        src={image.src}
        alt={image.alt}
        label="Foto"
        className="aspect-[4/5] w-full"
        sizes="260px"
        loading="eager"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/25 group-hover:opacity-100">
        <ZoomIn className="h-7 w-7 text-cream drop-shadow" aria-hidden="true" />
      </span>
    </motion.button>
  );
}
