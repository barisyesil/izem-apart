import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/* ---------------------------------------------------------------------
   FONTLAR (next/font ile)
   next/font fontları projeye gömer; tarayıcı Google'a istek atmaz,
   sayfa yüklenirken kayma (layout shift) olmaz.
   ÖNEMLİ: "latin-ext" alt kümesi Türkçe harfler (ş, ğ, ı, İ, ç, ö, ü)
   için gereklidir. Onsuz bazı karakterler bozuk görünebilir.
   --------------------------------------------------------------------- */

// Başlıklar için zarif, yüksek kontrastlı serif font.
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

// Gövde metni ve arayüz için temiz, okunaklı sans-serif font.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

/* ---------------------------------------------------------------------
   SAYFA META VERİLERİ (SEO + sosyal paylaşım)
   --------------------------------------------------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL("https://www.izemapart.com"),
  title: {
    default: "İzem Bayan Apart — Eskişehir'de Kız Öğrenci Apartı",
    template: "%s · İzem Bayan Apart",
  },
  description:
    "Eskişehir'in merkezinde, üniversitelere yakın kız öğrenci apartı. 24 saat güvenlik, kamera sistemi, 7/24 sıcak su ve sıcacık aile ortamıyla konforlu, güvenli bir yuva.",
  keywords: [
    "Eskişehir kız öğrenci apartı",
    "İzem Apart",
    "İzem Bayan Apart",
    "kız öğrenci yurdu Eskişehir",
    "Tepebaşı öğrenci apartı",
    "üniversiteye yakın apart",
  ],
  authors: [{ name: "İzem Bayan Apart" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "İzem Bayan Apart",
    title: "İzem Bayan Apart — Eskişehir'de Kız Öğrenci Apartı",
    description:
      "Merkezi konum, 24 saat güvenlik, kamera sistemi ve sıcacık aile ortamı. Eskişehir'de güvenli ve konforlu kız öğrenci apartı.",
  },
  robots: { index: true, follow: true },
};

// Mobil tarayıcı çubuğunun rengi + görünüm ayarları.
export const viewport: Viewport = {
  themeColor: "#f6f1e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // lang="tr": ekran okuyucular ve tarayıcılar için sitenin dili Türkçe.
    // Font değişkenlerini <html>'e veriyoruz ki tüm sayfada kullanılabilsin.
    <html lang="tr" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col bg-cream text-ink antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
