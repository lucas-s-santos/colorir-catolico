"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Curva "ease-out" suave, usada em todo o site para dar leveza às entradas.
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Revela o conteúdo com um fade + leve subida quando ele entra na tela.
 * Anima uma única vez e respeita `prefers-reduced-motion` (cai para um
 * fade simples, sem deslocamento).
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduz = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduz ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}
