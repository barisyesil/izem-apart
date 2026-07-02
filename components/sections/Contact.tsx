import { Mail, Phone } from "lucide-react";
import ContactForm from "@/components/sections/ContactForm";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { chapters, contact, site, socials } from "@/lib/content";

// =====================================================================
// İLETİŞİM BÖLÜMÜ
// ---------------------------------------------------------------------
// Solda doğrudan iletişim yolları (WhatsApp, telefon, e-posta, sosyal
// medya), sağda iletişim formu.
// =====================================================================
export default function Contact() {
  // Doğrudan iletişim satırları (ikon + etiket + bağlantı).
  const directLinks = [
    { icon: WhatsappIcon, label: `WhatsApp · ${site.gsm}`, href: site.whatsappHref, external: true },
    { icon: Phone, label: site.gsm, href: site.gsmHref, external: false },
    { icon: Phone, label: site.phone, href: site.phoneHref, external: false },
    { icon: Mail, label: site.email, href: site.emailHref, external: false },
  ];

  return (
    <Section id="iletisim" className="bg-cream">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Sol: bilgiler */}
          <Reveal>
            <div>
              <SectionHeading
                eyebrow={contact.eyebrow}
                number={chapters.find((c) => c.id === "iletisim")?.number}
                title={contact.title}
              />
              <p className="mt-5 max-w-md text-base leading-relaxed text-taupe sm:text-lg">
                {contact.description}
              </p>

              <ul className="mt-8 space-y-3">
                {directLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        {...(item.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="group inline-flex items-center gap-3 text-ink transition-colors hover:text-terracotta-deep"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-sage-deep transition-colors group-hover:border-current">
                          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                        </span>
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* Sosyal medya */}
              <div className="mt-7 flex gap-3">
                {socials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-taupe transition-colors hover:border-ink hover:text-ink"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Sağ: form */}
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
