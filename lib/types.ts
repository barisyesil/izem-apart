// =====================================================================
// TİPLER (TypeScript)
// ---------------------------------------------------------------------
// İçerik verilerinin "şeklini" burada tanımlıyoruz. Bu sayede yanlış
// veri girince editör/derleyici bizi uyarır. (Yeni başlayanlar için:
// burayı değiştirmenize gerek yok; sadece içerik girerken yardımcı olur.)
// =====================================================================
import type { LucideIcon } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

// Bir ikon ya Lucide ikonudur ya da kendi yazdığımız marka (logo) SVG'sidir.
export type IconType = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

// Menü bağlantısı (sayfa içi çapa: "#hakkimizda" gibi)
export type NavLink = {
  label: string;
  href: string;
};

// İkonlu küçük özellik kartı (güven maddeleri, olanaklar)
export type Feature = {
  icon: IconType;
  title: string;
  description?: string;
};

// Galeri görseli
export type GalleryImage = {
  src: string; // boş "" bırakılırsa yer tutucu görünür
  alt: string;
};

// Bir oda tipi
export type Room = {
  id: string;
  name: string; // "Tek Kişilik Oda"
  capacity: string; // "1 kişilik"
  description: string;
  features: string[];
  image: string; // ana kapak fotoğrafı; boş "" bırakılırsa yer tutucu görünür
  imageAlt: string;
  // Bu odaya ait TÜM fotoğraflar. Kapak fotoğrafına tıklanınca sadece
  // bu listedeki fotoğraflar galeri (Lightbox) olarak açılır.
  gallery: GalleryImage[];
};

// Sosyal medya bağlantısı
export type SocialLink = {
  label: string;
  href: string;
  icon: IconType;
};

// Buton / çağrı (Call To Action)
export type CTA = {
  label: string;
  href: string;
};
