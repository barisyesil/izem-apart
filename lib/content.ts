// =====================================================================
// İÇERİK (SİTENİN TÜM YAZILARI VE VERİLERİ)
// ---------------------------------------------------------------------
// Sitedeki bütün metinler, telefon/adres bilgileri, oda ve olanak
// listeleri burada toplanmıştır. Bir şeyi değiştirmek isterseniz
// (örneğin telefon numarası, oda açıklaması, başlık) doğru yer BURASIDIR.
// Kodun derinlerine girmenize gerek yok.
//
// Not: "icon" alanlarındaki büyük harfli isimler (ShieldCheck gibi) ikon
// çizimleridir; onlara dokunmanıza gerek yok, sadece yazıları düzenleyin.
// =====================================================================
import {
  Archive,
  Bath,
  BedDouble,
  Cctv,
  HeartHandshake,
  MapPin,
  NotebookPen,
  ShieldCheck,
  ShowerHead,
  Sofa,
  Tv,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsappIcon,
} from "@/components/ui/brand-icons";
import type {
  CTA,
  Feature,
  GalleryImage,
  NavLink,
  Room,
  SocialLink,
} from "@/lib/types";

// --- Marka ---
export const brand = {
  name: "İzem Bayan Apart",
  shortName: "İzem Apart",
  tagline: "Eskişehir'de kız öğrenci apartı",
};

// --- İletişim bilgileri (tek yerden) ---
export const site = {
  phone: "0222 700 00 61",
  phoneHref: "tel:+902227000061",
  gsm: "0546 488 26 26",
  gsmHref: "tel:+905464882626",
  email: "izembayanapart@gmail.com",
  emailHref: "mailto:izembayanapart@gmail.com",
  whatsappNumber: "905464882626", // wa.me bağlantısı için (yalnız rakamlar)
  whatsappHref: "https://wa.me/905464882626",
  address: "Yenibağlar Mah. Çayır Sokak No:34, Tepebaşı / Eskişehir",
};

// --- Menü (üst bar) ---
export const navLinks: NavLink[] = [
  { label: "Anasayfa", href: "#anasayfa" },
  { label: "Hakkımızda", href: "#hakkimizda" },
  { label: "Odalar", href: "#odalar" },
  { label: "Olanaklar", href: "#olanaklar" },
  { label: "Galeri", href: "#galeri" },
  { label: "İletişim", href: "#iletisim" },
];

// --- Karşılama (Hero) ---
export const hero = {
  eyebrow: "Eskişehir · Kız Öğrenci Apartı",
  titleLines: ["Evinizden uzakta,", "ikinci bir yuva."],
  subtitle:
    "Şehrin merkezinde, üniversitelere yakın; güvenli, konforlu ve sıcacık bir aile ortamı. İzem Bayan Apart'ta huzurla okuyun, rahatça dinlenin.",
  primaryCta: { label: "Odaları Keşfet", href: "#odalar" } as CTA,
  secondaryCta: { label: "İletişime Geç", href: "#iletisim" } as CTA,
  scrollHint: "Keşfetmek için kaydırın",
  // Hero arka plan fotoğrafı eklemek için: image: "/images/hero.jpg"
  // Boş bırakılırsa şık koyu bir zemin gösterilir.
  image: "",
  imageAlt: "İzem Bayan Apart binası",
  // CTA butonlarının altında görünen küçük güven çipleri.
  chips: [
    { icon: ShieldCheck, title: "24 saat güvenlik" },
    { icon: ShowerHead, title: "7/24 sıcak su" },
    { icon: MapPin, title: "Merkezî konum" },
  ] as Feature[],
};

// --- Hakkımızda ---
export const about = {
  eyebrow: "Hakkımızda",
  title: "Kızlarımız için güvenli ve huzurlu bir yuva",
  paragraphs: [
    "İzem Bayan Apart; merkezi konumu, konforlu odaları ve keyifli sosyal alanlarıyla Eskişehir'de okuyan kız öğrencilere kurumsal ve kaliteli bir konaklama sunar.",
    "Deneyimli yönetimimiz ve sıcacık aile ortamımızla, ailelerin gönül rahatlığıyla emanet edebileceği; öğrencilerin ise kendini evinde hissedeceği bir ortam oluşturduk.",
  ],
  signature: "İzem Bayan Apart",
};

// --- Güven & Konfor (öne çıkanlar) ---
export const trust = {
  eyebrow: "Neden İzem?",
  title: "Güven ve konfor, en başta gelir",
  items: [
    {
      icon: ShieldCheck,
      title: "24 Saat Güvenlik",
      description: "Gün boyu görev başındaki güvenlik personeliyle huzurlu konaklama.",
    },
    {
      icon: Cctv,
      title: "Kamera Sistemi",
      description: "Ortak alanlar kesintisiz kamera (CCTV) sistemiyle izlenir.",
    },
    {
      icon: ShowerHead,
      title: "7/24 Sıcak Su",
      description: "Gece gündüz fark etmeksizin kesintisiz sıcak su imkânı.",
    },
    {
      icon: HeartHandshake,
      title: "Sıcak Aile Ortamı",
      description: "Kendinizi evinizde hissedeceğiniz samimi ve ilgili bir ortam.",
    },
  ] as Feature[],
};

// --- Odalarımız ---
export const rooms = {
  eyebrow: "Odalarımız",
  title: "Size en uygun odayı seçin",
  intro:
    "Her oda; özel banyosu, çalışma alanı ve konforlu eşyalarıyla rahat bir öğrencilik için hazırlandı.",
  items: [
    {
      id: "tek-kisilik",
      name: "Tek Kişilik Oda",
      capacity: "1 kişilik",
      description:
        "Kendinize ait, sakin ve güvenli bir çalışma ve dinlenme alanı. Mahremiyet ve huzur ön planda.",
      features: [
        "Tek kişilik kullanım",
        "Odaya özel banyo ve WC",
        "Çalışma masası ve sandalye",
        "Geniş eşya dolabı",
        "LCD TV",
        "Kaliteli yatak ve baza",
      ],
      image: "",
      imageAlt: "İzem Bayan Apart tek kişilik oda",
    },
    {
      id: "cift-kisilik",
      name: "Çift Kişilik Oda",
      capacity: "2 kişilik",
      description:
        "Arkadaşınızla paylaşabileceğiniz ferah ve aydınlık bir oda. Herkese ait kişisel alanlarla tasarlandı.",
      features: [
        "İki kişilik kullanım",
        "Odaya özel banyo ve WC",
        "Kişisel çalışma alanları",
        "Geniş eşya dolabı",
        "LCD TV",
        "Kaliteli yatak ve baza",
      ],
      image: "",
      imageAlt: "İzem Bayan Apart çift kişilik oda",
    },
  ] as Room[],
};

// --- Olanaklar ---
export const amenities = {
  eyebrow: "Olanaklar",
  title: "Konforunuz için her detay düşünüldü",
  items: [
    { icon: ShowerHead, title: "7/24 Sıcak Su" },
    { icon: NotebookPen, title: "Çalışma Masası ve Sandalye" },
    { icon: Tv, title: "LCD TV" },
    { icon: BedDouble, title: "Kaliteli Yatak ve Baza" },
    { icon: Archive, title: "Geniş Eşya Dolabı" },
    { icon: Bath, title: "Her Odada Banyo ve WC" },
    { icon: Sofa, title: "Ortak Sosyal Alanlar" },
    { icon: ShieldCheck, title: "24 Saat Güvenlik" },
  ] as Feature[],
};

// --- Konum ---
export const location = {
  eyebrow: "Konum",
  title: "Şehrin tam merkezinde",
  description:
    "İzem Bayan Apart, Eskişehir Tepebaşı'nda yer alır; üniversitelere, ulaşım hatlarına ve şehir merkezine kolay ulaşım sunar.",
  addressLabel: "Adres",
};

// --- Galeri ---
export const gallery = {
  eyebrow: "Galeri",
  title: "İzem'den kareler",
  intro:
    "Odalarımızdan ve ortak alanlarımızdan görüntüler. (Gerçek fotoğraflar yakında eklenecek.)",
  images: [
    { src: "", alt: "İzem Bayan Apart bina girişi" },
    { src: "", alt: "Tek kişilik oda" },
    { src: "", alt: "Çift kişilik oda" },
    { src: "", alt: "Ortak çalışma alanı" },
    { src: "", alt: "Ortak oturma alanı" },
    { src: "", alt: "Odaya özel banyo" },
  ] as GalleryImage[],
};

// --- İletişim ---
export const contact = {
  eyebrow: "İletişim",
  title: "Bize ulaşın",
  description:
    "Müsaitlik ve detaylı bilgi için bizimle iletişime geçin; size en kısa sürede dönüş yapalım.",
  form: {
    nameLabel: "Ad Soyad",
    namePlaceholder: "Adınız ve soyadınız",
    phoneLabel: "Telefon",
    phonePlaceholder: "05XX XXX XX XX",
    roomTypeLabel: "Oda Tipi",
    roomTypeOptions: ["Fark etmez", "Tek Kişilik Oda", "Çift Kişilik Oda"],
    messageLabel: "Mesajınız",
    messagePlaceholder: "İletmek istedikleriniz...",
    submitWhatsapp: "WhatsApp ile Gönder",
    submitEmail: "E-posta ile Gönder",
    note: "Form göndermek için bir hesap oluşturmanıza gerek yok; mesajınız doğrudan WhatsApp veya e-posta uygulamanızda açılır.",
  },
};

// --- Sosyal medya ---
// Telegram eklemek isterseniz: { label: "Telegram", href: "https://t.me/KULLANICI", icon: TelegramIcon }
export const socials: SocialLink[] = [
  {
    label: "WhatsApp",
    href: "https://wa.me/905464882626",
    icon: WhatsappIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/izembayanapart",
    icon: InstagramIcon,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100012572927369",
    icon: FacebookIcon,
  },
];

// --- Footer ---
export const footer = {
  description:
    "Eskişehir'in merkezinde, güvenli ve konforlu kız öğrenci apartı. Evinizden uzakta, ikinci bir yuva.",
  copyright: `© ${new Date().getFullYear()} İzem Bayan Apart. Tüm hakları saklıdır.`,
};
