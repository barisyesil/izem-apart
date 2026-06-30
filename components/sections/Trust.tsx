import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { trust } from "@/lib/content";

// =====================================================================
// GÜVEN & KONFOR BÖLÜMÜ
// ---------------------------------------------------------------------
// Ailelerin en çok önem verdiği başlıkları (güvenlik, kamera, sıcak su,
// aile ortamı) ikonlu kartlarla öne çıkaran şerit.
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
          {trust.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-warmwhite text-sage-deep ring-1 ring-hairline">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-serif text-xl text-espresso">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-taupe">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
