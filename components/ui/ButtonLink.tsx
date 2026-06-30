import type { AnchorHTMLAttributes, ReactNode } from "react";

// Bağlantı görünümlü buton. Sitedeki tüm çağrı (CTA) butonları bunu kullanır.
// Dört çeşit (variant):
//  - primary:        açık zeminde ana eylem (dolu koyu)
//  - secondary:      açık zeminde ikincil eylem (ince çerçeve)
//  - light:          KOYU zeminde ana eylem (dolu krem) — örn. hero
//  - outline-light:  KOYU zeminde ikincil eylem (krem çerçeve)
// min-h-[48px]: mobilde rahat dokunulabilir hedef (erişilebilirlik kuralı).
type Variant = "primary" | "secondary" | "light" | "outline-light";

const variantStyles: Record<Variant, string> = {
  primary: "bg-ink text-cream hover:bg-espresso",
  secondary: "border border-hairline text-ink hover:border-ink hover:bg-warmwhite",
  light: "bg-cream text-ink hover:bg-warmwhite",
  "outline-light": "border border-cream/40 text-cream hover:bg-cream/10",
};

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

  return (
    <a
      href={href}
      className={`${base} ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
