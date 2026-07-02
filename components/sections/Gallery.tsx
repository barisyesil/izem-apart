"use client";

import { useState, type CSSProperties, type MouseEvent } from "react";
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
// Sabit bir ızgara yerine, TÜM fotoğrafları içeren, sürekli kayan
// ("marquee") tek satırlık bir şerit. Üzerine gelince/dokununca durur.
// Herhangi bir fotoğrafa tıklandığında, o fotoğraf açık şekilde TÜM
// galeriyi gezebileceğiniz paylaşılan Lightbox açılır. Masaüstünde her
// fotoğraf, imlecin pozisyonuna göre hafifçe eğilir (3B tilt).
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
          {track.map((image, trackIndex) => (
            <GalleryPhoto
              key={`${image.src}-${trackIndex}`}
              image={image}
              onOpen={() => setActiveIndex(trackIndex % images.length)}
            />
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
// Figure'a loading="eager" veriyoruz: şerit gerçek scroll değil, CSS
// translateX ile kayıyor, bu yüzden tarayıcının "görünürlüğe yakın"
// tembel-yükleme sezgisi döngü noktasındaki kareleri geç tetikliyordu —
// bir süre boş kalıp aniden beliriyorlardı. Fotoğraf sayısı az olduğu
// için hepsini baştan yüklemenin maliyeti düşük.
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
      className="group relative block w-[210px] shrink-0 overflow-hidden rounded-xl sm:w-[260px]"
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
