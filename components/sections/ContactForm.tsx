"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Mail } from "lucide-react";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { contact, site } from "@/lib/content";
import { onContactPrefill } from "@/lib/contactPrefill";
import type { IconType } from "@/lib/types";

// =====================================================================
// İLETİŞİM FORMU (sadece ön yüz — backend YOK)
// ---------------------------------------------------------------------
// Form gönderildiğinde sunucuya istek ATMAZ. Bunun yerine girilen
// bilgilerden bir mesaj metni oluşturup:
//   • "WhatsApp ile Gönder"  -> wa.me bağlantısını açar (metin hazır)
//   • "E-posta ile Gönder"   -> mailto: ile e-posta uygulamasını açar
// Böylece kullanıcı tek tıkla bize ulaşır, hiçbir altyapı gerekmez.
//
// NOT: Tarayıcı bize "WhatsApp gerçekten açıldı mı / e-posta gönderildi
// mi" bilgisini vermez (bu bilgiye erişimimiz yok). Bu yüzden butonlarda
// gösterilen onay sadece "işlem başlatıldı" anlamına gelir, "mesaj
// ulaştı" anlamına GELMEZ — metinler de buna göre seçilmiştir.
// =====================================================================
export default function ContactForm() {
  const f = contact.form;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [roomType, setRoomType] = useState(f.roomTypeOptions[0]);
  const [message, setMessage] = useState("");
  // Az önce hangi buton kullanıldı? Kısa bir onay göstermek için (2sn).
  const [justSent, setJustSent] = useState<"whatsapp" | "email" | null>(null);
  // Ad Soyad boş gönderilmeye çalışıldı mı? (bkz. validate())
  const [nameError, setNameError] = useState(false);
  // "Bu Odayı Sor"dan az önce dolduruldu mu? Kısa bir vurgu halkası için.
  const [justPrefilled, setJustPrefilled] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Odalar bölümündeki "Bu Odayı Sor" butonu bir CustomEvent yayınlar
  // (bkz. lib/contactPrefill.ts); burada dinleyip oda tipi + hazır mesajı
  // doldururuz. Kaydırmayı Rooms tarafı yapar; biz sadece state'i kurup
  // kısa bir vurgu halkası yakarız ki kullanıcı formun dolduğunu fark etsin.
  useEffect(() => {
    return onContactPrefill((detail) => {
      if (detail.roomType && f.roomTypeOptions.includes(detail.roomType)) {
        setRoomType(detail.roomType);
      }
      if (detail.message !== undefined) setMessage(detail.message);
      setJustPrefilled(true);
      window.setTimeout(() => setJustPrefilled(false), 1800);
    });
  }, [f.roomTypeOptions]);

  // Zorunlu alanları kontrol eder. ÖNEMLİ: bu kontrol React state'ine
  // (name) bakar, DOM'daki "required" özniteliğine DEĞİL — bu yüzden
  // birileri tarayıcı geliştirici araçlarından "required"ı silse bile
  // (backend olmadığı için tek savunma hattımız bu) boş form yine de
  // gönderilemez. Geçersizse alanı odaklayıp hata mesajını gösterir.
  const validate = () => {
    const isValid = name.trim().length > 0;
    setNameError(!isValid);
    if (!isValid) nameInputRef.current?.focus();
    return isValid;
  };

  // Form alanlarını okunaklı bir mesaja dönüştür. YALNIZCA kullanıcının
  // gerçekten verdiği bilgiler eklenir — boş bir alan için "Telefon:" gibi
  // içi boş bir satır ASLA oluşmaz. Ad Soyad zorunlu olduğundan (validate)
  // her zaman vardır. Oda Tipi, varsayılan/nötr seçim ("Fark etmez",
  // roomTypeOptions[0]) dışında bir değerse eklenir — böylece kullanıcı
  // özellikle bir oda seçmediyse gereksiz gürültü olmaz.
  const buildText = () =>
    [
      "İzem Bayan Apart — İletişim talebi",
      `Ad Soyad: ${name.trim()}`,
      phone.trim() ? `Telefon: ${phone.trim()}` : "",
      roomType && roomType !== f.roomTypeOptions[0]
        ? `Oda Tipi: ${roomType}`
        : "",
      message.trim() ? `Mesaj: ${message.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

  const confirmBriefly = (via: "whatsapp" | "email") => {
    setJustSent(via);
    window.setTimeout(() => setJustSent(null), 2000);
  };

  // WhatsApp'ı hazır metinle aç.
  const sendWhatsapp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    const url = `${site.whatsappHref}?text=${encodeURIComponent(buildText())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    confirmBriefly("whatsapp");
  };

  // E-posta uygulamasını konu + içerik hazır şekilde açacak "mailto:" bağlantısı.
  // NOT: Bunu "window.location.href = ..." ile DEĞİL, gerçek bir <a href> ile
  // tetikliyoruz — bazı ortamlarda (kayıtlı e-posta istemcisi olmayan
  // tarayıcılar dâhil) location.href ataması sayfanın yeniden
  // değerlendirilmesine yol açıp az önce girilen form bilgilerini
  // kaybettirebiliyor; gerçek bir mailto: bağlantısı bu riski taşımaz.
  const subject = encodeURIComponent("İzem Bayan Apart — İletişim talebi");
  const body = encodeURIComponent(buildText());
  const mailtoHref = `${site.emailHref}?subject=${subject}&body=${body}`;

  // mailto linki bir <a>, form submit'i değil — bu yüzden aynı state
  // kontrolünü burada da ayrıca yapıp geçersizse linkin açılmasını
  // (e.preventDefault) engelliyoruz.
  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!validate()) {
      e.preventDefault();
      return;
    }
    confirmBriefly("email");
  };

  // Ortak input görünümü (tekrar yazmamak için).
  const fieldClass =
    "w-full rounded-lg border border-hairline bg-warmwhite px-4 py-3 text-ink placeholder:text-taupe/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/25";
  const labelClass = "mb-1.5 block text-sm font-medium text-ink";

  return (
    <form
      onSubmit={sendWhatsapp}
      className={`rounded-2xl border bg-cream p-6 ring-0 transition-[box-shadow,border-color] duration-500 sm:p-8 ${
        justPrefilled ? "border-sage ring-2 ring-sage/50" : "border-hairline"
      }`}
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="cf-name" className={labelClass}>
            {f.nameLabel}
            {/* Zorunlu alan işareti — asıl zorunluluk "required" özniteliği
                ve aşağıdaki validate() ile sağlanıyor, bu sadece görsel ipucu. */}
            <span className="text-terracotta-deep" aria-hidden="true">
              {" "}
              *
            </span>
          </label>
          <input
            ref={nameInputRef}
            id="cf-name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError && e.target.value.trim()) setNameError(false);
            }}
            placeholder={f.namePlaceholder}
            aria-invalid={nameError}
            aria-describedby={nameError ? "cf-name-error" : undefined}
            className={`${fieldClass} ${nameError ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
          />
          {nameError && (
            <p id="cf-name-error" role="alert" className="mt-1.5 text-xs text-red-600">
              {f.nameRequiredError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cf-phone" className={labelClass}>
            {f.phoneLabel}
          </label>
          <input
            id="cf-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            // Telefon alanına alakasız karakter girilemesin: rakam, boşluk
            // ve + - ( ) dışındaki her şeyi anında ayıklıyoruz. onChange
            // üzerinde filtrelemek, keydown'ı engellemekten daha sağlamdır —
            // yapıştırmayı (paste), mobil klavyeyi ve otomatik doldurmayı da
            // aynı anda kapsar (izinsiz karakter hiç görünmez).
            onChange={(e) =>
              setPhone(e.target.value.replace(/[^0-9\s()+-]/g, ""))
            }
            placeholder={f.phonePlaceholder}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="cf-room" className={labelClass}>
            {f.roomTypeLabel}
          </label>
          <select
            id="cf-room"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className={fieldClass}
          >
            {f.roomTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="cf-message" className={labelClass}>
            {f.messageLabel}
          </label>
          <textarea
            id="cf-message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={f.messagePlaceholder}
            className={`${fieldClass} resize-y`}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-ink px-6 text-sm font-medium text-cream transition-colors hover:bg-espresso"
        >
          <SubmitButtonContent
            active={justSent === "whatsapp"}
            icon={WhatsappIcon}
            label={f.submitWhatsapp}
            confirmLabel={f.confirmWhatsapp}
          />
        </button>
        <a
          href={mailtoHref}
          onClick={handleEmailClick}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 overflow-hidden rounded-full border border-hairline px-6 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-warmwhite"
        >
          <SubmitButtonContent
            active={justSent === "email"}
            icon={Mail}
            label={f.submitEmail}
            confirmLabel={f.confirmEmail}
          />
        </a>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-taupe">{f.note}</p>
    </form>
  );
}

// Buton içeriği: normalde ikon + etiket, tıklandıktan sonra kısa süreliğine
// bir onay çentiği + "açılıyor" metnine "geçiş yapar" (morph), sonra geri döner.
function SubmitButtonContent({
  active,
  icon: Icon,
  label,
  confirmLabel,
}: {
  active: boolean;
  icon: IconType;
  label: string;
  confirmLabel: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {active ? (
        <motion.span
          key="confirm"
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="inline-flex items-center gap-2"
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          {confirmLabel}
        </motion.span>
      ) : (
        <motion.span
          key="default"
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="inline-flex items-center gap-2"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
