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
  priority = false,
}: {
  src: string;
  alt: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    return <Placeholder label={label} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
