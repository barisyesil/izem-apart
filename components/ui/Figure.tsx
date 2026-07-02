import Image from "next/image";
import Placeholder from "./Placeholder";

// Akıllı görsel alanı:
//  - Gerçek bir görsel yolu verilirse (src dolu) -> next/image ile gösterir
//    (otomatik optimizasyon, tembel yükleme, kayma olmadan).
//  - src boşsa "" -> zarif yer tutucuyu gösterir.
// Böylece içerik dosyasında (lib/content.ts) sadece görsel yolunu doldurarak
// fotoğrafları kolayca ekleyebilirsiniz. Oran/köşe yuvarlatma className ile.
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
  if (!src) {
    return <Placeholder label={label} className={className} />;
  }

  // preload ve loading aynı anda verilmemeli (Next.js dokümantasyonunun
  // uyarısı) — preload isteniyorsa loading'i hiç geçmiyoruz.
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        {...(preload ? { preload: true } : { loading })}
      />
    </div>
  );
}
