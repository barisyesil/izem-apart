// Gerçek fotoğraflar gelene kadar kullanılan zarif "yer tutucu" görsel.
// Kum (sand) zemin üzerinde İzem monogramı gösterir. Boyutu/oranı, ona
// verilen className (örn. "aspect-[4/5] rounded-2xl") belirler.
export default function Placeholder({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden border border-hairline bg-sand ${className}`}
      aria-hidden="true"
    >
      <div className="px-4 text-center">
        <span className="font-serif text-4xl text-espresso/35">İzem</span>
        {label && (
          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-taupe/70">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}
