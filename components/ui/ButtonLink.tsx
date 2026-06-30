import type { AnchorHTMLAttributes, ReactNode } from "react";

// Bağlantı görünümlü buton. Sitedeki tüm çağrı (CTA) butonları bunu kullanır.
// İki çeşit (variant):
//  - primary:   dolu koyu zemin (ana eylem)
//  - secondary: ince çerçeveli, şeffaf (ikincil eylem)
// min-h-[48px]: mobilde rahat dokunulabilir hedef (erişilebilirlik kuralı).
type Variant = "primary" | "secondary";

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const base =
    "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 text-sm font-medium tracking-wide transition-colors duration-200";
  const styles =
    variant === "primary"
      ? "bg-ink text-cream hover:bg-espresso"
      : "border border-hairline text-ink hover:border-ink hover:bg-warmwhite";

  return (
    <a href={href} className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </a>
  );
}
