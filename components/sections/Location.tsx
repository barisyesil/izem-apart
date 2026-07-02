"use client";

import { ArrowUpRight, Bus, Footprints, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { chapters, location, site } from "@/lib/content";

// Yürüme mesafesi şemasındaki duraklar. Süreler UYDURULMAMIŞTIR — hepsi
// zaten Hakkımızda/Konum metninde geçen "5-10 dakikalık yürüyüş" ve
// "toplu taşımaya yakınlık" bilgisinin görselleştirilmiş hâlidir.
const NEARBY_STOPS = [
  { icon: Footprints, label: "Anadolu Üniversitesi", tag: "5-10 dk yürüme", tone: "sage" as const },
  { icon: Footprints, label: "Espark AVM", tag: "5-10 dk yürüme", tone: "sage" as const },
  { icon: Footprints, label: "Çarşı merkezi", tag: "5-10 dk yürüme", tone: "sage" as const },
  {
    icon: Bus,
    label: "ESTÜ ve Osmangazi Üniversitesi",
    tag: "Toplu taşıma ile yakın",
    tone: "brass" as const,
  },
];

// =====================================================================
// KONUM BÖLÜMÜ
// ---------------------------------------------------------------------
// Üstte adres ve orijinal, çizilmiş bir "yürüme mesafesi" şeması (gerçek
// bir harita DEĞİL — mevcut metindeki mesafe bilgisini editoryal bir
// diyagrama dönüştürür), altta gömülü gerçek Google haritası.
// Harita, API anahtarı GEREKTİRMEZ: adresi linke çevirip "&output=embed"
// ile iframe içine koyuyoruz.
// =====================================================================
export default function Location() {
  // Adresi güvenli biçimde URL'ye çevir (Türkçe karakterler için).
  const query = encodeURIComponent(site.address);
  const mapEmbed = `https://www.google.com/maps?q=${query}&z=15&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <Section id="konum" className="bg-cream">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Metin */}
          <Reveal>
            <div>
              <SectionHeading
                eyebrow={location.eyebrow}
                number={chapters.find((c) => c.id === "konum")?.number}
                title={location.title}
              />
              <p className="mt-5 max-w-md text-base leading-relaxed text-taupe sm:text-lg">
                {location.description}
              </p>
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-hairline bg-warmwhite p-4">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-sage-deep"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-taupe">
                    {location.addressLabel}
                  </p>
                  <p className="mt-1 text-ink">{site.address}</p>
                </div>
              </div>
              <ButtonLink
                href={mapLink}
                variant="secondary"
                className="mt-6"
                target="_blank"
                rel="noopener noreferrer"
              >
                Haritada Aç
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </Reveal>

          {/* Yürüme mesafesi şeması */}
          <Reveal delay={0.1}>
            <WalkingDiagram />
          </Reveal>
        </div>

        {/* Gerçek harita — tam genişlikte, şemanın altında */}
        <Reveal delay={0.15} className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-hairline">
            <iframe
              src={mapEmbed}
              title="İzem Bayan Apart konum haritası"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[320px] w-full sm:h-[380px]"
            />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

// Orijinal, çizilmiş bir "yürüme mesafesi" diyagramı: İzem'den başlayıp
// noktalı bir "yol" boyunca yakın duraklara uzanır. Kaydırdıkça yol
// yukarıdan aşağı çizilir, duraklar sırayla belirir.
function WalkingDiagram() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="rounded-2xl border border-hairline bg-warmwhite p-5 sm:p-6">
      <p className="mb-5 text-xs uppercase tracking-[0.15em] text-taupe">
        İzem&apos;den yürüme mesafeleri
      </p>

      <div className="relative">
        {/* Noktalı "yol" çizgisi — her ikon dairesinin ortasından geçer */}
        <svg
          className="absolute left-[13px] top-1 h-[calc(100%-8px)] w-0.5 text-hairline"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <motion.line
            x1="1"
            y1="0"
            x2="1"
            y2="100%"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="1 7"
            strokeLinecap="round"
            initial={reduceMotion ? false : { pathLength: 0 }}
            whileInView={reduceMotion ? undefined : { pathLength: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        </svg>

        <ul className="space-y-5">
          {NEARBY_STOPS.map((stop, index) => {
            const Icon = stop.icon;
            const isSage = stop.tone === "sage";
            return (
              <motion.li
                key={stop.label}
                className="flex items-center gap-3"
                initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.18 }}
              >
                <span
                  className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-4 ring-warmwhite ${
                    isSage ? "bg-sage/15 text-sage-deep" : "bg-brass/15 text-brass"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="text-sm text-ink">{stop.label}</span>
                <span
                  className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    isSage ? "bg-sage/15 text-sage-deep" : "bg-brass/15 text-brass"
                  }`}
                >
                  {stop.tag}
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
