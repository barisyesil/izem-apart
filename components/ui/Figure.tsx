"use client";

import { useState } from "react";
import Image from "next/image";
import Placeholder from "./Placeholder";
import { imageMeta } from "@/lib/image-manifest";

// Akıllı görsel alanı:
//  - Gerçek bir görsel yolu verilirse (src dolu) -> next/image ile gösterir.
//  - src boşsa "" -> zarif yer tutucuyu gösterir.
//  - Görsel, optimize hattından geçtiyse (lib/image-manifest.ts içinde
//    kaydı varsa) yüklenene kadar minik bulanık bir ön izleme gösterilir
//    (yavaş bağlantılarda boş gri kutu yerine fotoğrafın "hayaleti").
//  - YÜKLEME HATASI TELAFİSİ: kısıtlı ağlarda (ör. Fast 3G) bir istek
//    yarıda kesilirse aynı görsel, önbelleği atlatan bir parametreyle
//    2 kez daha denenir; yine olmazsa zarif yer tutucuya düşülür. Böylece
//    "fotoğraf hiç gelmedi ve boş kaldı" durumu kalıcı olamaz.
export default function Figure({
  src,
  alt,
  label,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  preload = false,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  label?: string;
  className?: string;
  sizes?: string;
  // Next.js 16'da eski "priority" prop'u kaldırıldı, yerine "preload" geldi
  // (bkz. node_modules/next/dist/docs/.../image.md). LCP/üst katman
  // görseller için preload; görünürlükten bağımsız hemen yüklenmesi
  // gereken (örn. sürekli kayan galeri şeridi) görseller için loading="eager".
  preload?: boolean;
  loading?: "lazy" | "eager";
}) {
  // Kaçıncı denemedeyiz? 0 = ilk deneme. Sınıra ulaşınca pes edilir.
  const [attempt, setAttempt] = useState(0);
  const MAX_RETRIES = 2;

  if (!src || attempt > MAX_RETRIES) {
    return <Placeholder label={label} className={className} />;
  }

  const meta = imageMeta[src];
  // Yeniden denemede tarayıcının "başarısız oldu" önbelleğini atlatmak
  // için URL'e zararsız bir sorgu eki konur.
  const effectiveSrc = attempt === 0 ? src : `${src}?retry=${attempt}`;

  // preload ve loading aynı anda verilmemeli (Next.js dokümantasyonunun
  // uyarısı) — preload isteniyorsa loading'i hiç geçmiyoruz.
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        key={effectiveSrc}
        src={effectiveSrc}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        onError={() => setAttempt((n) => n + 1)}
        {...(meta
          ? { placeholder: "blur" as const, blurDataURL: meta.blurDataURL }
          : {})}
        {...(preload ? { preload: true } : { loading })}
      />
    </div>
  );
}
