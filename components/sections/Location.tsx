import { ArrowUpRight, MapPin } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { location, site } from "@/lib/content";

// =====================================================================
// KONUM BÖLÜMÜ
// ---------------------------------------------------------------------
// Solda adres ve kısa açıklama, sağda gömülü Google harita.
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
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Metin */}
          <Reveal>
            <div>
              <SectionHeading eyebrow={location.eyebrow} title={location.title} />
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

          {/* Harita */}
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-hairline">
              <iframe
                src={mapEmbed}
                title="İzem Bayan Apart konum haritası"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[320px] w-full sm:h-[420px]"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
