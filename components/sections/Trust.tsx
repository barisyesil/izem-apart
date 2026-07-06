"use client";

import { Cctv, HeartHandshake, ShieldCheck, ShowerHead } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { trust } from "@/lib/content";
import type { IconType } from "@/lib/types";

// =====================================================================
// GÜVEN & KONFOR BÖLÜMÜ
// ---------------------------------------------------------------------
// Ailelerin en çok önem verdiği başlıkları (güvenlik, kamera, sıcak su,
// aile ortamı) ikonlu kartlarla öne çıkaran şerit. Her ikon, ANLAMINI
// pekiştiren, çok hafif ve sürekli tekrar eden bir hareketle "canlanır"
// (örn. kamera ikonunda küçük bir "kayıt" noktası yanıp söner) — süs
// için değil, ne olduğunu hatırlatmak için.
// "use client": sürekli tekrar eden ikon animasyonları için gerekli.
// =====================================================================
export default function Trust() {
  return (
    <Section className="bg-sand">
      <Container>
        <SectionHeading
          eyebrow={trust.eyebrow}
          title={trust.title}
          align="center"
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
          {trust.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              {/* PDF revizesi: ikon/logolar her ekran boyutunda ORTALI dursun
                  (eskiden masaüstünde sola yaslanıyordu). */}
              <div className="flex flex-col items-center text-center">
                <TrustIcon icon={item.icon} />
                <h3 className="mt-5 font-serif text-xl text-espresso">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-taupe">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// İkon dairesi + anlamlı, kısık sesli bir döngü hareketi.
// Hangi ikon olduğu (referans eşitliğiyle) belirlenir; her biri kendi
// hareketini taşır. Tanınmayan bir ikon gelirse animasyonsuz gösterilir.
function TrustIcon({ icon: Icon }: { icon: IconType }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-warmwhite text-sage-deep ring-1 ring-hairline">
      <motion.span
        className="flex items-center justify-center"
        animate={reduceMotion ? undefined : getLoop(Icon)}
        transition={reduceMotion ? undefined : getTransition(Icon)}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </motion.span>

      {/* Kamera ikonu için: küçük, yanıp sönen "kayıt" noktası */}
      {Icon === Cctv && (
        <motion.span
          aria-hidden="true"
          className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-terracotta"
          animate={reduceMotion ? undefined : { opacity: [1, 0.2, 1] }}
          transition={
            reduceMotion ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
          }
        />
      )}
    </span>
  );
}

// Her ikonun kendi anlamına uygun, çok hafif bir döngüsü.
function getLoop(icon: IconType) {
  if (icon === ShieldCheck) return { scale: [1, 1.08, 1] }; // sakin bir nöbet nabzı
  if (icon === ShowerHead) return { y: [0, 2, 0] }; // damlayan su hissi
  if (icon === HeartHandshake) return { scale: [1, 1.1, 1] }; // sıcak bir kalp atışı
  return undefined; // Cctv: hareketi kendi kayıt noktası taşıyor, ikon sabit kalır
}

function getTransition(icon: IconType) {
  const duration = icon === ShowerHead ? 2.4 : icon === HeartHandshake ? 2.2 : 3;
  return { duration, repeat: Infinity, ease: "easeInOut" as const };
}
