"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, CheckCheck, ChevronDown, Mail, MessageCircle } from "lucide-react";
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
  const reducePreviewMotion = useReducedMotion();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [roomType, setRoomType] = useState(f.roomTypeOptions[0]);
  const [message, setMessage] = useState("");
  // Az önce hangi buton kullanıldı? Kısa bir onay göstermek için (2sn).
  const [justSent, setJustSent] = useState<"whatsapp" | "email" | null>(null);
  // Zorunlu alanlar boş gönderilmeye çalışıldı mı? (bkz. validate())
  const [nameError, setNameError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  // "Bu Odayı Sor"dan az önce dolduruldu mu? Kısa bir vurgu halkası için.
  const [justPrefilled, setJustPrefilled] = useState(false);
  // Canlı mesaj önizlemesi varsayılan olarak GİZLİ; kullanıcı bir butonla
  // açar (tatlı bir animasyonla süzülerek gelir).
  const [showPreview, setShowPreview] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

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

  // Zorunlu alanları (Ad Soyad + Mesaj) kontrol eder. ÖNEMLİ: bu kontrol
  // React state'ine bakar, DOM'daki "required" özniteliğine DEĞİL — bu
  // yüzden birileri tarayıcı geliştirici araçlarından "required"ı silse
  // bile (backend olmadığı için tek savunma hattımız bu) boş form yine de
  // gönderilemez. Geçersizse ilk boş alanı odaklayıp hata mesajlarını
  // gösterir.
  const validate = () => {
    const nameOk = name.trim().length > 0;
    const messageOk = message.trim().length > 0;
    setNameError(!nameOk);
    setMessageError(!messageOk);
    // İlk geçersiz alana odaklan (önce Ad Soyad, sonra Mesaj).
    if (!nameOk) nameInputRef.current?.focus();
    else if (!messageOk) messageInputRef.current?.focus();
    return nameOk && messageOk;
  };

  const messageTitle = "İzem Bayan Apart — İletişim talebi";

  // Mesaj, YALNIZCA kullanıcının gerçekten verdiği alanlardan kurulur —
  // boş bir alan için "Telefon:" gibi içi boş bir satır ASLA oluşmaz.
  // Ad Soyad zorunludur (validate). Oda Tipi, varsayılan/nötr seçim
  // ("Fark etmez", roomTypeOptions[0]) dışında bir değerse eklenir.
  // Hem gönderilen metin (buildText) hem canlı sohbet önizlemesi
  // (MessagePreview) bu TEK listeden beslenir ki ikisi asla ayrışmasın.
  const messageFields = [
    { key: "name", label: "Ad Soyad", value: name.trim() },
    { key: "phone", label: "Telefon", value: phone.trim() },
    {
      key: "room",
      label: "Oda Tipi",
      value: roomType && roomType !== f.roomTypeOptions[0] ? roomType : "",
    },
    { key: "message", label: "Mesaj", value: message.trim() },
  ].filter((field) => field.value);

  // Form alanlarını okunaklı bir mesaja dönüştür.
  const buildText = () =>
    [messageTitle, ...messageFields.map((fld) => `${fld.label}: ${fld.value}`)].join(
      "\n",
    );

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
    <div className="space-y-4">
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
            {/* Zorunlu alan işareti — asıl zorunluluk "required" + validate(). */}
            <span className="text-terracotta-deep" aria-hidden="true">
              {" "}
              *
            </span>
          </label>
          <textarea
            ref={messageInputRef}
            id="cf-message"
            rows={4}
            required
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (messageError && e.target.value.trim()) setMessageError(false);
            }}
            placeholder={f.messagePlaceholder}
            aria-invalid={messageError}
            aria-describedby={messageError ? "cf-message-error" : undefined}
            className={`${fieldClass} resize-y ${messageError ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
          />
          {messageError && (
            <p id="cf-message-error" role="alert" className="mt-1.5 text-xs text-red-600">
              {f.messageRequiredError}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="inline-flex min-h-[48px] flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-ink px-6 text-sm font-medium text-cream transition-colors hover:bg-espresso"
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

      {/* Canlı sohbet önizlemesi — VARSAYILAN GİZLİ. Aşağıdaki butonla
          açılır; formla AYNI messageFields listesinden beslenir, açıkken
          kullanıcı yazdıkça anlık güncellenir. */}
      <div>
        <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          aria-expanded={showPreview}
          aria-controls="cf-preview"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-hairline bg-warmwhite px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-sage hover:text-sage-deep"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {showPreview ? "Önizlemeyi gizle" : "Mesaj önizlemeyi göster"}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${showPreview ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
        </div>

        <AnimatePresence initial={false}>
          {showPreview && (
            <motion.div
              key="preview"
              id="cf-preview"
              initial={reducePreviewMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reducePreviewMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
              exit={reducePreviewMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: reducePreviewMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <motion.div
                initial={reducePreviewMotion ? false : { scale: 0.96, y: 8 }}
                animate={{ scale: 1, y: 0 }}
                exit={reducePreviewMotion ? undefined : { scale: 0.96, y: 8 }}
                transition={
                  reducePreviewMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 30 }
                }
                className="pt-3"
              >
                <MessagePreview title={messageTitle} fields={messageFields} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
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

// =====================================================================
// CANLI SOHBET ÖNİZLEMESİ
// ---------------------------------------------------------------------
// Formla AYNI messageFields listesinden beslenir. Kullanıcı yazdıkça,
// gönderilecek mesaj bir WhatsApp-vari sohbet balonunda anlık belirir;
// her satır tek tek içeri süzülür, balon yumuşakça büyür/küçülür. Alan
// boşken zarif bir "yazıyor" noktalı göstergesi + davet metni görünür.
// "Hareketi azalt" açıksa tüm animasyonlar kapanır, içerik yine doğru.
// =====================================================================
type PreviewField = { key: string; label: string; value: string };

function MessagePreview({
  title,
  fields,
}: {
  title: string;
  fields: PreviewField[];
}) {
  const reduceMotion = useReducedMotion();
  const hasContent = fields.length > 0;
  const bubbleSpring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 480, damping: 34 };

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-warmwhite">
      {/* Sohbet başlığı */}
      <div className="flex items-center gap-3 border-b border-hairline bg-cream/70 px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage/15 text-sage-deep">
          <WhatsappIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">İzem Bayan Apart</p>
          <p className="flex items-center gap-1.5 text-[11px] text-taupe">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-sage-deep" />
            mesaj önizlemesi
          </p>
        </div>
      </div>

      {/* Sohbet gövdesi — giden (sağa yaslı) balon */}
      <div className="px-4 py-4">
        <div className="flex justify-end">
          <motion.div
            layout={!reduceMotion}
            transition={bubbleSpring}
            className="max-w-[88%] rounded-2xl rounded-br-md bg-sage/15 px-3.5 py-2.5 shadow-sm ring-1 ring-sage/15"
          >
            {hasContent ? (
              <motion.div layout={!reduceMotion} className="space-y-1">
                <motion.p
                  layout={!reduceMotion}
                  className="text-[11px] font-semibold uppercase tracking-wide text-sage-deep"
                >
                  {title}
                </motion.p>
                <AnimatePresence mode="popLayout" initial={false}>
                  {fields.map((field) => (
                    <motion.p
                      key={field.key}
                      layout={!reduceMotion}
                      initial={reduceMotion ? false : { opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -4, scale: 0.98 }}
                      transition={
                        reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
                      }
                      className="whitespace-pre-wrap break-words text-sm leading-snug text-ink"
                    >
                      <span className="text-taupe">{field.label}:</span> {field.value}
                    </motion.p>
                  ))}
                </AnimatePresence>
                <div className="flex items-center justify-end gap-1 pt-0.5 text-[10px] text-taupe">
                  şimdi
                  <CheckCheck className="h-3 w-3 text-sage-deep" aria-hidden="true" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                layout={!reduceMotion}
                className="flex items-center gap-1 py-1"
                aria-label="Mesaj bekleniyor"
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="block h-1.5 w-1.5 rounded-full bg-taupe/60"
                    animate={
                      reduceMotion ? undefined : { y: [0, -3, 0], opacity: [0.4, 1, 0.4] }
                    }
                    transition={
                      reduceMotion
                        ? undefined
                        : { duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }
                    }
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {!hasContent && (
          <p className="mt-2.5 text-center text-xs text-taupe">
            Formu doldurdukça mesajınız burada belirir.
          </p>
        )}
      </div>
    </div>
  );
}
