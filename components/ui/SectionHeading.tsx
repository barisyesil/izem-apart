import type { ReactNode } from "react";

// Bölüm başlığı kalıbı: küçük üst etiket (eyebrow) + büyük serif başlık.
// Sitedeki tüm bölümlerde aynı tipografik hiyerarşiyi korumak için tek yerde.
export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const isCenter = align === "center";
  return (
    <div
      className={`${isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-terracotta-deep">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-3xl leading-[1.08] text-espresso sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </div>
  );
}
