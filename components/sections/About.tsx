import Container from "@/components/ui/Container";
import CyclingWord from "@/components/ui/CyclingWord";
import Figure from "@/components/ui/Figure";
import Parallax from "@/components/ui/Parallax";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { about, chapters } from "@/lib/content";

// =====================================================================
// HAKKIMIZDA BÖLÜMÜ
// ---------------------------------------------------------------------
// Editoryal iki sütun: solda hikâye/metin, sağda görsel.
// Mobilde alt alta dizilir (önce metin, sonra görsel).
// =====================================================================
export default function About() {
  return (
    // id BİLİNÇLİ OLARAK YOK: "#hakkimizda" çapası app/page.tsx'teki
    // görünmez nöbetçi (sentinel) öğede — bu bölüm "garaj kapısı" geçişi
    // için sticky olduğundan, çapa/scroll-spy doğrudan buna bağlanamaz
    // (gerekçe için page.tsx'teki nota bakın).
    <Section className="bg-cream">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Metin */}
          <Reveal>
            <div>
              <SectionHeading
                eyebrow={about.eyebrow}
                number={chapters.find((c) => c.id === "hakkimizda")?.number}
                title={
                  <>
                    {about.titlePrefix}{" "}
                    <CyclingWord words={about.cyclingWords} /> {about.titleSuffix}
                  </>
                }
              />
              <div className="mt-6 space-y-4 text-base leading-relaxed text-taupe sm:text-lg">
                {about.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-8 font-serif text-2xl text-sage-deep">
                {about.signature}
              </p>
            </div>
          </Reveal>

          {/* Görsel: aparttan gerçek bir kare */}
          <Reveal delay={0.1}>
            <Parallax>
              <Figure
                src={about.image}
                alt={about.imageAlt}
                label="Apart'tan bir kare"
                className="aspect-[4/5] w-full rounded-2xl"
                // Masaüstünde 2 sütunlu grid (lg:grid-cols-2, gap-16) →
                // görsel sütunu max-w-6xl konteynerde en fazla ~512px olur;
                // "45vw" geniş ekranlarda bunu aşıp gereksiz büyük kaynak
                // seçtiriyordu. Sabit 512px daha isabetli. Altında tek sütun,
                // konteyner iç boşluğu düşülünce ~%90vw.
                sizes="(min-width: 1024px) 512px, 90vw"
              />
            </Parallax>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
