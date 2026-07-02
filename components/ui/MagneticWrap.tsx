"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer } from "@/lib/useFinePointer";

// =====================================================================
// MIKNATIS SARMALAYICI (MagneticWrap)
// ---------------------------------------------------------------------
// İçindeki öğeyi (genelde bir buton) fare yaklaşınca hafifçe kendine
// doğru çeker; fare uzaklaşınca yumuşak bir yayla (spring) eski yerine
// döner. SADECE gerçek fare + hassas imleç olan masaüstünde çalışır
// (bkz. lib/useFinePointer.ts) — dokunmatik ekranlarda devre dışıdır,
// buton normal şekilde davranır.
// =====================================================================
export default function MagneticWrap({
  children,
  strength = 16,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const isFine = useFinePointer();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isFine || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relativeX = event.clientX - (rect.left + rect.width / 2);
    const relativeY = event.clientY - (rect.top + rect.height / 2);
    x.set((relativeX / rect.width) * strength);
    y.set((relativeY / rect.height) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={isFine ? { x: springX, y: springY } : undefined}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
