"use client";

import { useSyncExternalStore } from "react";

// =====================================================================
// İNCE İMLEÇ TESPİTİ (useFinePointer)
// ---------------------------------------------------------------------
// Gerçek bir fareyle (hassas imleç) mi geziniyoruz, yoksa dokunmatik bir
// ekranda mıyız? Bunu bilmek gerekir çünkü bazı efektler (mıknatıs gibi
// takip eden butonlar, fotoğraf eğim efekti) SADECE masaüstünde anlamlıdır;
// dokunmatik ekranlarda "imleç" kavramı olmadığı için o efektleri hiç
// çalıştırmayız.
// "(hover: hover) and (pointer: fine)" -> gerçek fare + hassas işaretleyici.
//
// React'ın "dış bir kaynağa (tarayıcı API'si) abone ol" için önerdiği
// resmi yöntem useSyncExternalStore'dur; sunucu/istemci uyumsuzluğunu
// (hydration mismatch) kendisi güvenle yönetir.
// =====================================================================
const QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(callback: () => void) {
  const mediaQueryList = window.matchMedia(QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false; // Sunucuda "fare imleci" kavramı yok; güvenli varsayılan.
}

export function useFinePointer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
