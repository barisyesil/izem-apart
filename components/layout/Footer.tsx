import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import Container from "@/components/ui/Container";
import { brand, footer, navLinks, site, socials } from "@/lib/content";

// =====================================================================
// ALT BİLGİ (FOOTER)
// ---------------------------------------------------------------------
// Tamamen sabit içerik olduğu için Sunucu Bileşeni (hook yok).
// Marka, kısa açıklama, sosyal medya, menü ve iletişim bilgilerini içerir.
// =====================================================================
export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-warmwhite">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marka + açıklama + sosyal medya */}
          <div className="max-w-sm lg:col-span-2">
            {/* Footer zemini her zaman açık renk olduğu için logoya
                sabit olarak "brightness-0" uygulanır (beyaz -> koyu). */}
            <Image
              src={brand.logo}
              alt={brand.name}
              width={345}
              height={198}
              className="h-11 w-auto brightness-0"
            />
            <p className="mt-4 text-sm leading-relaxed text-taupe">
              {footer.description}
            </p>
            <div className="mt-5 flex gap-3">
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

          {/* Menü */}
          <nav aria-label="Alt menü">
            <h3 className="text-xs uppercase tracking-[0.2em] text-taupe">Menü</h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-ink/80 transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* İletişim */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-taupe">
              İletişim
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-ink/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage-deep" />
                <span>{site.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-sage-deep" />
                <a href={site.gsmHref} className="transition-colors hover:text-ink">
                  {site.gsm}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-sage-deep" />
                <a href={site.phoneHref} className="transition-colors hover:text-ink">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-sage-deep" />
                <a
                  href={site.emailHref}
                  className="break-all transition-colors hover:text-ink"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-hairline pt-6 text-center text-xs text-taupe">
          {footer.copyright}
        </div>
      </Container>
    </footer>
  );
}
