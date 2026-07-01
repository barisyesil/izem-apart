"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

// İçindeki öğeyi, sayfa kaydırıldıkça ÇOK HAFİF yukarı/aşağı kaydırarak
// derinlik (parallax) hissi verir. Kasıtlı olarak ince tutulur.
// "Hareketi azalt" açıksa hiç uygulanmaz.
export default function Parallax({
  children,
  className = "",
  distance = 20,
}: {
  children: ReactNode;
  className?: string;
  distance?: number; // toplam kayma miktarı (px)
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Öğe ekrana girerken 0, ekrandan çıkarken 1 olur.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
