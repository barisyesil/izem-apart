"use client";

import { useState } from "react";
import Image from "next/image";
import { brand } from "@/lib/content";

// Marka logosu — Header VE Footer'da kullanılan, iç-boyutlu (width/height
// verilen, Figure.tsx'in aksine "fill" OLMAYAN) tek görsel.
//
// NEDEN AYRI BİR BİLEŞEN: logo daha önce her iki yerde de ÇIPLAK next/image
// ile gösteriliyordu — Figure.tsx'e (galeri/oda fotoğrafları için) eklediğimiz
// "yüklenemezse birkaç kez yeniden dene, sonra zarif bir yedeğe düş"
// telafisi buraya hiç uygulanmamıştı. Logo HER sayfada göründüğü için, bir
// ziyaretçinin oturumunda tek seferlik bir ağ hatası bile logonun kalıcı
// olarak boş kalmasına yol açabiliyordu. Bu bileşen Figure'daki AYNI deseni
// (cache atlatan yeniden deneme) uygular; son çare olarak da tamamen boş
// kalmak yerine marka adını yazıyla gösterir.
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
    return (
      <span className={`font-serif text-xl text-espresso ${className}`}>
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
      width={345}
      height={198}
      onError={() => setAttempt((n) => n + 1)}
      className={className}
      {...(preload ? { preload: true } : {})}
    />
  );
}
