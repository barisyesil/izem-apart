"use client";

import { useEffect, useState } from "react";

// =====================================================================
// AKTİF BÖLÜM TAKİBİ (useActiveSection)
// ---------------------------------------------------------------------
// Verilen id listesindeki bölümlerden hangisi şu an ekranın dikey
// ortasındaysa onun id'sini döndürür. Header'daki menü vurgusu (scroll-spy)
// ve sağdaki "Büyüyen İplik" rayı (ChapterRail) AYNI mantığı kullanır;
// kod tekrarını önlemek için buraya tek bir kancaya (hook) çıkarıldı.
// =====================================================================
export function useActiveSection(ids: string[]): string {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return activeId;
}
