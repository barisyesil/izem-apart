import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import Figure from "@/components/ui/Figure";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { rooms } from "@/lib/content";

// =====================================================================
// ODALARIMIZ BÖLÜMÜ
// ---------------------------------------------------------------------
// Her oda tipi, görsel ve metnin dönüşümlü (bir sağ bir sol) dizildiği
// editoryal bir düzende sunulur. Mobilde alt alta gelir.
// =====================================================================
export default function Rooms() {
  return (
    <Section id="odalar" className="bg-cream">
      <Container>
        <SectionHeading eyebrow={rooms.eyebrow} title={rooms.title} />
        <p className="mt-4 max-w-xl text-base leading-relaxed text-taupe sm:text-lg">
          {rooms.intro}
        </p>

        <div className="mt-14 space-y-16 sm:space-y-24">
          {rooms.items.map((room, index) => {
            // Tek sıradaki odanın görselini sağa al (dönüşümlü düzen).
            const imageRight = index % 2 === 1;
            return (
              <Reveal key={room.id}>
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                  {/* Görsel (üzerine gelince hafifçe yakınlaşır) */}
                  <div
                    className={`group overflow-hidden rounded-2xl ${
                      imageRight ? "lg:order-last" : ""
                    }`}
                  >
                    <Figure
                      src={room.image}
                      alt={room.imageAlt}
                      label={room.name}
                      className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>

                  {/* Metin */}
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-serif text-3xl text-espresso sm:text-4xl">
                        {room.name}
                      </h3>
                      <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-medium text-sage-deep">
                        {room.capacity}
                      </span>
                    </div>
                    <p className="mt-4 text-base leading-relaxed text-taupe">
                      {room.description}
                    </p>
                    <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                      {room.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2.5 text-sm text-ink"
                        >
                          <Check
                            className="h-4 w-4 shrink-0 text-sage-deep"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
