"use client";

import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { brand, navLinks, site } from "@/lib/content";
import { WhatsappIcon } from "@/components/ui/brand-icons";

// =====================================================================
// ÜST BAŞLIK (HEADER)
// ---------------------------------------------------------------------
// İki davranışı olduğu için İstemci Bileşeni ("use client"):
//  1) Sayfa kaydırılınca şeffaf zeminden krem zemine geçer.
//  2) Mobilde hamburger menü açıp kapatır (sağdan açılan panel).
// =====================================================================
export default function Header() {
  const [scrolled, setScrolled] = useState(false); // sayfa kaydırıldı mı?
  const [open, setOpen] = useState(false); // mobil menü açık mı?

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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-hairline bg-cream/95 text-ink backdrop-blur"
          : "bg-transparent text-cream"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
        {/* Marka adı (logo) */}
        <a
          href="#anasayfa"
          className="flex items-baseline gap-2"
          aria-label={`${brand.name} ana sayfa`}
        >
          <span className="font-serif text-2xl leading-none">İzem</span>
          <span className="text-[10px] uppercase tracking-[0.28em] opacity-80">
            Bayan Apart
          </span>
        </a>

        {/* Masaüstü menü (md ve üzeri ekranlarda görünür) */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Ana menü">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide opacity-90 transition-opacity hover:opacity-60"
            >
              {link.label}
            </a>
          ))}
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

      {/* --- MOBİL MENÜ --- */}
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
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-hairline py-4 font-serif text-2xl text-espresso"
            >
              {link.label}
            </a>
          ))}
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
    </header>
  );
}
