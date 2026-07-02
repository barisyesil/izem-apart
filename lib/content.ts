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
  // Logo BEYAZ (şeffaf zeminli) çizilmiş; bu yüzden Header.tsx içinde
  // sayfa kaydırılıp zemin açık renge dönünce logoya "brightness-0" filtresi
  // uygulanır (beyaz -> siyah/koyu). Logoyu değiştirirseniz bu detayı unutmayın.
  logo: "/images/logo.png",
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

// --- Bölümler (sayfa "hikayesinin" bölüm/numaraları) ---
// Hem her bölümün başlığındaki küçük numaraya ("02" gibi) hem de sağdaki
// "Büyüyen İplik" rayına (ChapterRail) TEK kaynaktan besleme yapar; böylece
// iki yerde ayrı ayrı yazılan numaralar birbirinden kopmaz. Hero "kapak"
// sayıldığı için listede yoktur; Konum ise üst menüde yer almasa da (menü
// kısa tutulmak istendi) burada, sayfanın gerçek akışında bir bölümdür.
export const chapters: { id: string; number: string; label: string }[] = [
  { id: "hakkimizda", number: "02", label: "Hakkımızda" },
  { id: "odalar", number: "03", label: "Odalar" },
  { id: "olanaklar", number: "04", label: "Olanaklar" },
  { id: "konum", number: "05", label: "Konum" },
  { id: "galeri", number: "06", label: "Galeri" },
  { id: "iletisim", number: "07", label: "İletişim" },
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
  // Boş bırakılırsa (image: "") kendi çizdiğimiz "bina" çizgi-motifine
  // (HeroMotif, bkz. components/sections/Hero.tsx) otomatik geri düşülür.
  image: "/images/hero-arka-plan.png",
  // Atmosfer/mizansen fotoğrafı olduğu için (gerçek bir apart odasının
  // birebir fotoğrafı DEĞİL) alt metin de buna göre nötr/betimleyici —
  // spesifik bir oda iddiası içermiyor.
  imageAlt: "Sıcak tonlarda, davetkâr bir oturma alanı",
  // CTA butonlarının altında görünen küçük güven çipleri.
  chips: [
    { icon: ShieldCheck, title: "24 saat güvenlik" },
    { icon: ShowerHead, title: "7/24 sıcak su" },
    { icon: MapPin, title: "Merkezî konum" },
  ] as Feature[],
};

// --- Hakkımızda ---
// Metinler orijinal İzem Bayan Apart web sitesindeki "Hakkımızda" yazısına
// sadık kalınarak (mesafeler, güvenlik, dezenfeksiyon dâhil) hazırlandı.
export const about = {
  eyebrow: "Hakkımızda",
  // Başlıktaki tek kelime CyclingWord ile döner (bkz. components/sections/About.tsx).
  // Buradaki kelimeler sayfada zaten anlatılan gerçeklerdir, yeni bir iddia değildir.
  titlePrefix: "Kızlarımız için",
  titleSuffix: "bir yuva",
  cyclingWords: ["güvenli", "huzurlu", "hijyenik", "konforlu ", "merkezi"],
  paragraphs: [
    "İzem Bayan Apart; merkezi konumu, konforlu odaları ve sıcak aile ortamıyla öğrencilere huzurla konaklayabilecekleri bir yaşam alanı sunar. 7/24 görev yapan güvenlik personelimiz ve kesintisiz kamera sistemimiz sayesinde güvenliğiniz her zaman güvence altındadır.",
    "Apartımızdan Anadolu Üniversitesi'ne, Espark AVM'ye ve çarşı merkezine 5-10 dakikalık kısa bir yürüyüşle ulaşabilirsiniz. Ayrıca ESTÜ ve Osmangazi Üniversitesi güzergahındaki tüm toplu taşıma duraklarına da oldukça yakınız. Öğrencilerimiz, etüt ve dinlenme alanlarımızda hem derslerine odaklanabilir hem de keyifli vakit geçirebilirler.",
     ],
  signature: "İzem Bayan Apart",
  image: "/images/apart-hakkimizda.jpg",
  imageAlt: "İzem Bayan Apart bina dışından görünüm",
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
        "Tek kişilik odalarımızda konuklarımıza keyifli bir konaklama ayrıcalığı sunuyoruz. Tamamen size özel; kaliteli, konforlu ve güvenli bir oda sizi bekliyor.",
      features: [
        "Tek kişilik kullanım",
        "Odaya özel banyo ve WC",
        "Çalışma masası ve sandalye",
        "Geniş eşya dolabı",
        "LCD TV",
        "Kaliteli yatak ve baza",
      ],
      // Ana küçük resim (kapak fotoğrafı). Tıklanınca aşağıdaki "gallery"
      // listesindeki TÜM fotoğraflar galeri olarak açılır.
      image: "/images/tek-kisilik-odalar_1.jpg",
      imageAlt: "İzem Bayan Apart tek kişilik oda",
      gallery: [
        { src: "/images/tek-kisilik-odalar_1.jpg", alt: "Tek kişilik oda — görünüm 1" },
        { src: "/images/tek-kisilik-odalar_2.jpg", alt: "Tek kişilik oda — görünüm 2" },
        { src: "/images/tek-kisilik-odalar_3.jpg", alt: "Tek kişilik oda — görünüm 3" },
        { src: "/images/tek-kisilik-odalar_4.jpg", alt: "Tek kişilik oda — görünüm 4" },
      ] as GalleryImage[],
    },
    {
      id: "cift-kisilik",
      name: "Çift Kişilik Oda",
      capacity: "2 kişilik",
      description:
        "İki kişi konaklayabileceğiniz odalarımız geniş ve ferah yapısıyla kendi alanınızı yaratmanıza imkân tanır. Üst düzeyde güvenlik sağlanan apartımızda aile sıcaklığında, keyifle yaşayabilirsiniz.",
      features: [
        "İki kişilik kullanım",
        "Odaya özel banyo ve WC",
        "Kişisel çalışma alanları",
        "Geniş eşya dolabı",
        "LCD TV",
        "Kaliteli yatak ve baza",
      ],
      image: "/images/cift-kisilik-odalar_1.jpg",
      imageAlt: "İzem Bayan Apart çift kişilik oda",
      gallery: [
        { src: "/images/cift-kisilik-odalar_1.jpg", alt: "Çift kişilik oda — görünüm 1" },
        { src: "/images/cift-kisilik-odalar_2.jpg", alt: "Çift kişilik oda — görünüm 2" },
        { src: "/images/cift-kisilik-odalar_3.jpg", alt: "Çift kişilik oda — görünüm 3" },
        { src: "/images/cift-kisilik-odalar_4.jpg", alt: "Çift kişilik oda — görünüm 4" },
        { src: "/images/cift-kisilik-odalar_5.jpg", alt: "Çift kişilik oda — görünüm 5" },
      ] as GalleryImage[],
    },
  ] as Room[],
};

// --- Olanaklar ---
export const amenities = {
  eyebrow: "Olanaklar",
  title: "Konforunuz için her detay düşünüldü",
  intro:
    "Üniversite hayatınız boyunca en güvenli ve en konforlu alanda konaklamanız için uzun yıllardır aynı kalitede hizmet veriyoruz. Odalarımızdaki tüm eşyalar son derece ergonomiktir.",
  // "description": karta üzerine gelince (veya dokununca) açılan kısa metin.
  items: [
    {
      icon: ShowerHead,
      title: "7/24 Sıcak Su",
      description: "Günün her saati, mevsim fark etmeksizin kesintisiz sıcak su.",
    },
    {
      icon: NotebookPen,
      title: "Çalışma Masası ve Sandalye",
      description: "Odanızda size özel, ders çalışmaya hazır ergonomik bir köşe.",
    },
    {
      icon: Tv,
      title: "LCD TV",
      description: "Ders arası molalarda keyifli vakit geçirebileceğiniz kişisel ekran.",
    },
    {
      icon: BedDouble,
      title: "Kaliteli Yatak ve Baza",
      description: "Dinlendirici bir uyku için özenle seçilmiş yatak ve baza.",
    },
    {
      icon: Archive,
      title: "Geniş Eşya Dolabı",
      description: "Tüm eşyalarınızı düzenli tutabileceğiniz ferah bir alan.",
    },
    {
      icon: Bath,
      title: "Her Odada Banyo ve WC",
      description: "Paylaşımsız, size özel banyo ve WC ile tam mahremiyet.",
    },
    {
      icon: Sofa,
      title: "Ortak Sosyal Alanlar",
      description: "Arkadaşlarınızla vakit geçirebileceğiniz sıcak, samimi alanlar.",
    },
    {
      icon: ShieldCheck,
      title: "24 Saat Güvenlik",
      description: "Gün boyu görev başındaki güvenlik personeliyle içiniz rahat.",
    },
  ] as Feature[],
};

// --- Konum ---
export const location = {
  eyebrow: "Konum",
  title: "Şehrin tam merkezinde",
  description:
    "İzem Bayan Apart, Eskişehir Tepebaşı'nda yer alır. Anadolu Üniversitesi, Espark AVM ve çarşı merkezine 5-10 dakikalık yürüme mesafesindeyiz; Eskişehir Teknik Üniversitesi ve Osmangazi Üniversitesi'ne giden otobüs, dolmuş ve tramvay duraklarına da çok yakınız.",
  addressLabel: "Adres",
};

// --- Galeri ---
// Buradaki TÜM fotoğraflar en alttaki galeri şeridinde sürekli kayar.
// Yeni fotoğraf eklemek için: dosyayı public/images/ içine koyup buraya
// { src: "/images/dosya-adi.jpg", alt: "..." } olarak bir satır ekleyin.
export const gallery = {
  eyebrow: "Galeri",
  title: "İzem'den kareler",
  intro:
    "Odalarımızdan ve ortak alanlarımızdan gerçek kareler. Bir fotoğrafa tıklayarak tüm galeriyi gezebilirsiniz.",
  images: [
    { src: "/images/bina-girisi-1.jpg", alt: "İzem Bayan Apart bina girişi 1" },
    { src: "/images/bina-girisi-2.jpg", alt: "İzem Bayan Apart bina girişi 2" },
    { src: "/images/ortak-alan-1.jpg", alt: "İzem Bayan Apart ortak yaşam alanı" },
    { src: "/images/tek-kisilik-odalar_1.jpg", alt: "Tek kişilik oda — görünüm 1" },
    { src: "/images/tek-kisilik-odalar_2.jpg", alt: "Tek kişilik oda — görünüm 2" },
    { src: "/images/tek-kisilik-odalar_3.jpg", alt: "Tek kişilik oda — görünüm 3" },
    { src: "/images/tek-kisilik-odalar_4.jpg", alt: "Tek kişilik oda — görünüm 4" },
    { src: "/images/cift-kisilik-odalar_1.jpg", alt: "Çift kişilik oda — görünüm 1" },
    { src: "/images/cift-kisilik-odalar_2.jpg", alt: "Çift kişilik oda — görünüm 2" },
    { src: "/images/cift-kisilik-odalar_3.jpg", alt: "Çift kişilik oda — görünüm 3" },
    { src: "/images/cift-kisilik-odalar_4.jpg", alt: "Çift kişilik oda — görünüm 4" },
    { src: "/images/cift-kisilik-odalar_5.jpg", alt: "Çift kişilik oda — görünüm 5" },
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
    // Butona basılınca kısa süreliğine görünen onay metinleri.
    confirmWhatsapp: "WhatsApp açılıyor",
    confirmEmail: "E-posta açılıyor",
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
