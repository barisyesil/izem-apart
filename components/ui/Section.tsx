import type { ReactNode } from "react";

// Her bölümü saran standart kabuk.
// - id: menüden çapa ile gelmek için (örn. "#odalar")
// - üst/alt boşluk (dikey ritim) her bölümde aynı olsun diye burada.
// Yatay genişliği <Container> ayrı olarak verir (esneklik için ayrıştırdık).
export default function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-20 py-20 sm:py-28 ${className}`}>
      {children}
    </section>
  );
}
