"use client";

import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { amenities } from "@/lib/content";

// =====================================================================
// OLANAKLAR BÖLÜMÜ
// ---------------------------------------------------------------------
// Odalardaki ve aparttaki imkânları, kalabalık görünmeyen ferah bir
// ızgarada (mobilde 2, masaüstünde 4 sütun) ikonlarla listeler.
// Kartlar üzerine gelince (veya dokununca) hafifçe yükselir ve ikon
// döner/büyür — ince bir etkileşim hissi katar.
// "use client": hover/tap animasyonları için Framer Motion kullanılıyor.
// =====================================================================
export default function Amenities() {
  const reduceMotion = useReducedMotion();

  return (
    <Section id="olanaklar" className="bg-sand">
      <Container>
        <SectionHeading
          eyebrow={amenities.eyebrow}
          title={amenities.title}
          align="center"
        />
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-taupe sm:text-base">
          {amenities.intro}
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {amenities.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={(index % 4) * 0.05}>
                <motion.div
                  className="group flex h-full items-center gap-4 rounded-xl border border-hairline bg-warmwhite p-4 transition-colors duration-300 hover:border-sage/50 hover:bg-cream sm:flex-col sm:items-start sm:gap-3 sm:p-6"
                  whileHover={reduceMotion ? undefined : { y: -6 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sage/15 text-sage-deep transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-sage/25">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-sm font-medium text-ink sm:text-base">
                    {item.title}
                  </h3>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
