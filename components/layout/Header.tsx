"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { brand, navLinks, site } from "@/lib/content";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { useActiveSection } from "@/lib/useActiveSection";

// =====================================================================
// ÜST BAŞLIK (HEADER)
// ---------------------------------------------------------------------
// İstemci Bileşeni ("use client"). Dört işi var:
//  1) Sayfa kaydırılınca şeffaf zeminden krem zemine geçer.
//  2) Mobilde hamburger menü açıp kapatır (sağdan açılan panel).
//  3) En üstte ince bir "kaydırma ilerleme çubuğu" gösterir.
//  4) Scroll-spy: ekrandaki bölüme göre aktif menü linkini vurgular.
//
// ÖNEMLİ (hata düzeltmesi): Mobil menü (scrim + panel), <header>'ın
// İÇİNDE değil, DIŞINDA (kardeş öğe olarak) render edilir. Sebebi:
// CSS'te "backdrop-filter" (Tailwind'de backdrop-blur), üzerine
// uygulandığı öğeyi "position: fixed" torunları için YENİ bir referans
// noktası (containing block) yapar. Header kaydırılınca backdrop-blur
// aldığı için, içindeki "fixed" menü paneli artık tüm ekrana değil,
// SADECE header'ın küçük kutusuna göre konumlanıyor ve bu da mobil
// menünün ikinci bölümden sonra (yani header'ın zemini değişince)
// bozuk görünmesine sebep oluyordu.
// =====================================================================
export default function Header() {
  const [scrolled, setScrolled] = useState(false); // sayfa kaydırıldı mı?
  const [open, setOpen] = useState(false); // mobil menü açık mı?
  // Ekrandaki aktif bölüm — paylaşılan hook (bkz. lib/useActiveSection.ts).
  // Aynı hook, sağdaki "Büyüyen İplik" rayı (ChapterRail) tarafından da kullanılır.
  const activeId = useActiveSection(navLinks.map((link) => link.href.slice(1)));

  // Sayfanın en üstündeki ilerleme çubuğu için kaydırma oranı (0 → 1).
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  // Sayfa ~24px kaydırılınca başlığa krem zemin ver.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobil menü açıkken: arka plan kaymasını kilitle + Esc ile kapat.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "border-b border-hairline bg-cream/95 text-ink backdrop-blur"
            : "bg-transparent text-cream"
        }`}
      >
        {/* Kaydırma ilerleme çubuğu (en üstte ince şerit) */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progressScaleX }}
          className="absolute inset-x-0 top-0 h-0.5 origin-left bg-terracotta"
        />

        <div className="mx-auto flex h-[var(--header-h)] w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          {/* Marka logosu — logo beyaz çizildiği için krem zeminde
              "brightness-0" ile koyulaştırılır (beyaz -> siyah). */}
          <a
            href="#anasayfa"
            className="shrink-0"
            aria-label={`${brand.name} ana sayfa`}
          >
            <Image
              src={brand.logo}
              alt={brand.name}
              width={345}
              height={198}
              priority
              className={`h-10 w-auto transition-[filter] duration-300 sm:h-12 ${
                scrolled ? "brightness-0" : ""
              }`}
            />
          </a>

          {/* Masaüstü menü (md ve üzeri ekranlarda görünür) */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Ana menü">
            {navLinks.map((link) => {
              const isActive = activeId === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative text-sm tracking-wide transition-opacity ${
                    isActive ? "opacity-100" : "opacity-75 hover:opacity-100"
                  }`}
                >
                  {link.label}
                  {/* Aktif linkin altında büyüyen ince çizgi */}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-current transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Sağ taraf: masaüstü WhatsApp butonu + mobil hamburger */}
          <div className="flex items-center gap-1">
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-[44px] items-center gap-2 rounded-full border border-current px-5 text-sm transition-colors hover:bg-current/10 md:inline-flex"
            >
              <WhatsappIcon className="h-4 w-4" />
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden"
              aria-label="Menüyü aç"
              aria-expanded={open}
              aria-controls="mobil-menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBİL MENÜ (header'ın DIŞINDA, kardeş öğe) --- */}
      {/* Arka karartma (scrim): tıklayınca menüyü kapatır */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />
      {/* Sağdan açılan panel */}
      <aside
        id="mobil-menu"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-xs flex-col bg-cream text-ink shadow-xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <span className="font-serif text-xl text-espresso">İzem</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full"
            aria-label="Menüyü kapat"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col px-5" aria-label="Mobil menü">
          {navLinks.map((link) => {
            const isActive = activeId === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "true" : undefined}
                className={`border-b border-hairline py-4 font-serif text-2xl ${
                  isActive ? "text-terracotta-deep" : "text-espresso"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-3 p-5">
          <a
            href={site.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm text-cream"
          >
            <WhatsappIcon className="h-4 w-4" /> WhatsApp&apos;tan Yaz
          </a>
          <a
            href={site.gsmHref}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-hairline px-5 text-sm text-ink"
          >
            <Phone className="h-4 w-4" /> {site.gsm}
          </a>
        </div>
      </aside>
    </>
  );
}
