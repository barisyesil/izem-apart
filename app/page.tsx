import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Trust from "@/components/sections/Trust";
import Rooms from "@/components/sections/Rooms";
import Amenities from "@/components/sections/Amenities";
import Gallery from "@/components/sections/Gallery";
import Location from "@/components/sections/Location";
import Contact from "@/components/sections/Contact";

// =====================================================================
// ANA SAYFA
// ---------------------------------------------------------------------
// Tek sayfalık site. Tüm bölümler sırayla burada birleştirilir.
// (Header ve Footer, app/layout.tsx içinde her sayfayı sarar.)
//
// "GARAJ KAPISI" GEÇİŞİ (Hero → Hakkımızda) — tamamen CSS, JS yok:
// Hero (z-10, opak) normal akışta kaydırınca kendiliğinden yukarı kayar;
// kapı hareketi budur. Hakkımızda ise aşağıdaki sarmalayıcıyla Hero'nun
// ARKASINA çekilir ve kapı tam kalkana kadar ekranda SABİT tutulur:
//
//  - "-mt-[100dvh]": sarmalayıcıyı bir ekran boyu yukarı, Hero'nun
//    arkasına (z-0) çeker — sayfa açıkken Hakkımızda, kapının ardında
//    görünmez şekilde hazır bekler.
//  - "sticky top-0": Hakkımızda, kaydırma sırasında ekranın tepesine
//    yapışıp SABİT kalır (kapı üzerinden kalkarken altındaki oda
//    kıpırdamaz) — spacer bittiğinde, yani kapı TAM kalktığı anda
//    çözülür ve sayfa normal akışına döner.
//  - h-dvh "spacer": sticky'nin tam bir ekran boyu (kapının kalkma
//    mesafesi kadar) yapışık kalabilmesi için gereken kaydırma payı.
//    Negatif kenar boşluğunun sayfadan çaldığı yüksekliği de birebir
//    geri koyar; toplam sayfa/scroll uzunluğu değişmez.
//  - "#hakkimizda" çapası GÖRÜNMEZ bir nöbetçiye (sentinel) taşındı:
//    sticky öğenin kendisi çapa hedefi olsaydı, tarayıcı onun "yapışık"
//    konumuna (ekranın tepesi = kaydırma 0) bakıp menüdeki Hakkımızda
//    tıklamasını sayfanın EN BAŞINA götürürdü; scroll-spy de sayfa
//    açılır açılmaz Hakkımızda'yı aktif sanırdı. Nöbetçi, Hakkımızda'nın
//    kapı açıldıktan SONRA oturacağı gerçek belge konumunu (sarmalayıcı
//    başından tam 100dvh aşağısı; Hero uzasa bile doğru — sarmalayıcı
//    Hero'nun bitiminden 100dvh önce başlar) kaplar; menü/çapa/spy üçü
//    de ona bakar.
//
// Hero yakınlaştırmada 100dvh'den uzun olabilir (min-h-dvh) — matematik
// yine tutar: sarmalayıcı Hero bitiminin 100dvh üstünde başladığı için
// yapışma tam kapının alt kenarı ekranın altından kalkmaya başladığı
// anda devreye girer, kapı tam çıktığı anda çözülür.
// =====================================================================
export default function Home() {
  return (
    <>
      <Hero />
      <div className="relative z-0 -mt-[100dvh]">
        <div className="sticky top-0 flex min-h-dvh flex-col justify-center bg-cream">
          <About />
        </div>
        <div aria-hidden="true" className="h-dvh" />
        <div
          id="hakkimizda"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 top-[100dvh] -z-10"
        />
      </div>
      <Trust />
      <Rooms />
      <Amenities />
      <Gallery />
      <Location />
      <Contact />
    </>
  );
}
