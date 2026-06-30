import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Trust from "@/components/sections/Trust";
import Rooms from "@/components/sections/Rooms";
import Amenities from "@/components/sections/Amenities";
import Location from "@/components/sections/Location";
import Gallery from "@/components/sections/Gallery";

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
      <About />
      <Trust />
      <Rooms />
      <Amenities />
      <Location />
      <Gallery />
    </>
  );
}
