import Hero from "@/components/sections/Hero";

// =====================================================================
// ANA SAYFA
// ---------------------------------------------------------------------
// Tek sayfalık site. Tüm bölümler sırayla burada birleştirilir.
// (Header ve Footer, app/layout.tsx içinde her sayfayı sarar.)
// Yeni bölümler ekledikçe buraya sırayla eklenecek.
// =====================================================================
export default function Home() {
  return (
    <>
      <Hero />
    </>
  );
}
