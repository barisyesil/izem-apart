// =====================================================================
// İLETİŞİM FORMU ÖN-DOLDURMA KÖPRÜSÜ (Rooms → ContactForm)
// ---------------------------------------------------------------------
// Odalar bölümündeki "Bu Odayı Sor" butonu, sayfanın çok aşağısındaki
// iletişim formunu (oda tipi + hazır mesaj) doldurmalı. İki bileşen
// (Rooms ve ContactForm) ayrı kardeşlerdir ve ortak bir React state'i
// paylaşmaz; araya bir Context/Provider koymak page.tsx'teki hassas
// "garaj kapısı" yapısını da sarmalamayı gerektirirdi.
//
// Bunun yerine küçük, tip-güvenli bir `window` CustomEvent köprüsü:
// Rooms olayı yayınlar (requestContactPrefill), ContactForm dinler
// (onContactPrefill). Tamamen gevşek bağlı — ContactForm sayfada olduğu
// sürece çalışır, hiçbir üst bileşeni değiştirmeye gerek yoktur.
// =====================================================================

export type ContactPrefill = {
  // Form'daki <select> ile eşleşen oda tipi etiketi (örn. "Tek Kişilik Oda").
  roomType?: string;
  // Mesaj kutusuna yazılacak hazır metin.
  message?: string;
};

const CONTACT_PREFILL_EVENT = "izem:contact-prefill";

// Rooms tarafı: formu doldurmak için olayı yayınlar.
export function requestContactPrefill(detail: ContactPrefill) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ContactPrefill>(CONTACT_PREFILL_EVENT, { detail }),
  );
}

// ContactForm tarafı: olayı dinler; aboneliği kaldıran fonksiyonu döndürür
// (useEffect cleanup'ında çağrılır).
export function onContactPrefill(
  handler: (detail: ContactPrefill) => void,
): () => void {
  if (typeof window === "undefined") return () => {};
  const listener = (event: Event) => {
    handler((event as CustomEvent<ContactPrefill>).detail);
  };
  window.addEventListener(CONTACT_PREFILL_EVENT, listener);
  return () => window.removeEventListener(CONTACT_PREFILL_EVENT, listener);
}
