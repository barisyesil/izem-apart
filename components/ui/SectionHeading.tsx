import type { ReactNode } from "react";

// Bölüm başlığı kalıbı: küçük üst etiket (eyebrow) + büyük serif başlık.
// Sitedeki tüm bölümlerde aynı tipografik hiyerarşiyi korumak için tek yerde.
// "number": sağdaki "Büyüyen İplik" rayıyla eşleşen bölüm numarası ("02" gibi);
// verilmezse hiç gösterilmez (örn. Hero'da numara yok, o "kapak" sayılır).
export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
  number,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  align?: "left" | "center";
  number?: string;
  className?: string;
}) {
  const isCenter = align === "center";
  return (
    <div
      className={`${isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {(eyebrow || number) && (
        <p
          className={`mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-terracotta-deep ${
            isCenter ? "justify-center" : ""
          }`}
        >
          {number && <span className="text-brass">{number}</span>}
          {number && eyebrow && <span className="text-hairline">·</span>}
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-3xl leading-[1.08] text-espresso sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </div>
  );
}
