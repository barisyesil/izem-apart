import type { ReactNode } from "react";

// Sayfa içeriğini yatayda ortalayan ve maksimum genişlik veren sarmalayıcı.
// Tüm bölümlerde aynı kenar boşluklarını (mobilde dar, masaüstünde geniş)
// kullanmak için buradan geçeriz.
export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
