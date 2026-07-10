"use client";

import { useState } from "react";
import Image from "next/image";
import { brand } from "@/lib/content";

export default function BrandLogo({
  className = "",
  preload = false,
}: {
  className?: string;
  preload?: boolean;
}) {
  const [attempt, setAttempt] = useState(0);
  const MAX_RETRIES = 2;

  if (attempt > MAX_RETRIES) {
    // className genelde <img> için verilen yükseklik sınıflarını (h-10 vb.)
    // içerir — bunlar metnin punto boyutunu etkilemez, bu yüzden görsel
    // hiyerarşi için "text-xl" burada AYRICA belirtiliyor (mobil menüdeki
    // "İzem" yedek metniyle aynı büyüklük, bkz. Header.tsx).
    //
    // RENK KASITLI OLARAK BELİRTİLMİYOR — metin, çevresinden (currentColor)
    // miras alsın diye. Logo BEYAZ çizildiği için Header, sayfa henüz
    // kaydırılmamışken (koyu Hero'nun üzerindeyken) KENDİ metin rengini
    // "text-cream" (açık) yapıyor, kaydırılınca "text-ink" (koyu) oluyor —
    // gerçek görsel de aynı mantıkla (beyaz logo + kaydırılınca brightness-0
    // filtresi) kararıyor. Buraya sabit bir renk ("text-espresso" gibi)
    // verilirse, Header henüz kaydırılmamışken koyu metin koyu Hero
    // zemininde kayboluyordu — miras alma bu iki durumu da otomatik
    // doğru çözer (Footer'da da <body>'nin "text-ink"ini miras alıp
    // açık zeminde okunaklı kalır).
    return (
      <span className={`font-serif text-xl ${className}`}>
        {brand.shortName}
      </span>
    );
  }

  // NOT: src'ye "?retry=N" gibi bir önbellek-atlatma sorgu eki EKLEMİYORUZ —
  // Next.js 16'da yerel (public/) görsellerde sorgu dizesi varsayılan olarak
  // YASAK (images.localPatterns yapılandırılmadıkça) ve böyle bir src
  // verilirse next/image çalışma zamanında hata fırlatıp TÜM sayfayı
  // çökertiyor (bkz. Figure.tsx'teki aynı not). Sadece "key" değişimi
  // (aynı src ile <img>'i sıfırdan yeniden kurdurmak) yeniden deneme için
  // yeterli — tarayıcı, başarısız bir isteği kalıcı olarak önbelleğe almaz.
  return (
    <Image
      key={attempt}
      src={brand.logo}
      alt={brand.name}
      // Gerçek dosya 345×198 ama ekranda ~84×48px (h-10/h-12 w-auto)
      // gösteriliyor. next/image, ÇÖZÜNÜRLÜK adaylarını (srcset 1x/2x)
      // bu width/height'a göre üretir — ham dosya boyutunu vermek,
      // yüksek-DPR ekranlarda bile gereğinden çok büyük bir kaynak
      // indirtiyordu (PSI: "Resim yayınlamayı kolaylaştırın", w=750
      // servis ediliyordu). Aynı en-boy oranını (345:198) koruyan,
      // gerçek görünür boyuta yakın bir çift, CSS'in belirlediği nihai
      // kutuyu (w-auto) DEĞİŞTİRMEDEN çok daha küçük ve yine keskin
      // (2x ≈ 230px) bir kaynak seçilmesini sağlar.
      width={70}
      height={40}
      onError={() => setAttempt((n) => n + 1)}
      className={className}
      {...(preload ? { preload: true } : {})}
    />
  );
}
