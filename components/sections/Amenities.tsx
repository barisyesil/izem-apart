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
// =====================================================================
export default function Amenities() {
  return (
    <Section id="olanaklar" className="bg-sand">
      <Container>
        <SectionHeading
          eyebrow={amenities.eyebrow}
          title={amenities.title}
          align="center"
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {amenities.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={(index % 4) * 0.05}>
                <div className="flex h-full items-center gap-4 rounded-xl border border-hairline bg-warmwhite p-4 sm:flex-col sm:items-start sm:gap-3 sm:p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sage/15 text-sage-deep">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-sm font-medium text-ink sm:text-base">
                    {item.title}
                  </h3>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
