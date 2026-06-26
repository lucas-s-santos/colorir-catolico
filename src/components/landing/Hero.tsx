"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import type { Product } from "@/lib/types";
import { BookCover } from "./BookCover";

const badges = [
  "Download imediato",
  "Pagamento seguro",
  "Pix e cartão",
  "PDF pronto para imprimir",
];

// Curva "ease-out" suave — dá o ar elegante e sereno às animações.
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero({ livros }: { livros: Product[] }) {
  const capas = livros.slice(0, 3);
  const reduz = useReducedMotion();

  // ---- Parallax 3D sutil: as capas inclinam acompanhando o cursor ----
  const ponteiroX = useMotionValue(0);
  const ponteiroY = useMotionValue(0);
  const mola = { stiffness: 80, damping: 18, mass: 0.6 };
  const rotacaoY = useSpring(useTransform(ponteiroX, [-0.5, 0.5], [-10, 10]), mola);
  const rotacaoX = useSpring(useTransform(ponteiroY, [-0.5, 0.5], [8, -8]), mola);

  function aoMover(e: PointerEvent<HTMLElement>) {
    if (reduz) return;
    const r = e.currentTarget.getBoundingClientRect();
    ponteiroX.set((e.clientX - r.left) / r.width - 0.5);
    ponteiroY.set((e.clientY - r.top) / r.height - 0.5);
  }
  function aoSair() {
    ponteiroX.set(0);
    ponteiroY.set(0);
  }

  // ---- Variantes de entrada (orquestradas pelas colunas) ----
  const sobe = (delay = 0): Variants => ({
    hidden: { opacity: 0, y: reduz ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT, delay } },
  });

  // Linha do título que surge "de baixo da máscara" (overflow-hidden no pai).
  const linha = (delay = 0): Variants =>
    reduz
      ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.5, delay } } }
      : {
          hidden: { y: "115%" },
          show: { y: 0, transition: { duration: 0.9, ease: EASE_OUT, delay } },
        };

  // Cada capa sobe, cresce e gira até a posição final de "leque".
  const entraCapa = (i: number, rotate: number): Variants =>
    reduz
      ? {
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.6, delay: 0.2 + i * 0.12 } },
        }
      : {
          hidden: { opacity: 0, y: 64, scale: 0.85, rotate: 0 },
          show: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate,
            transition: { duration: 1, ease: EASE_OUT, delay: 0.35 + i * 0.15 },
          },
        };

  return (
    <section
      onPointerMove={aoMover}
      onPointerLeave={aoSair}
      className="relative overflow-hidden"
    >
      {/* Brilhos decorativos que "respiram" devagar */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-12%] h-115 w-215 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
        animate={reduz ? undefined : { scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-[26%] h-65 w-65 rounded-full bg-green/10 blur-3xl"
        animate={reduz ? undefined : { scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2">
        {/* Coluna de texto */}
        <motion.div initial="hidden" animate="show" className="text-center lg:text-left">
          <motion.p variants={sobe(0.05)} className="font-serif text-sm italic text-gold-dark">
            Evangelizando com cor e arte
          </motion.p>

          <h1 className="mt-3 text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
            <span className="block overflow-hidden py-[0.1em] my-[-0.1em]">
              <motion.span variants={linha(0.15)} className="block">
                Colorir a fé,
              </motion.span>
            </span>
            <span className="block overflow-hidden py-[0.1em] my-[-0.1em]">
              <motion.span variants={linha(0.3)} className="block text-gold-dark">
                em família
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={sobe(0.5)}
            className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-ink-soft lg:mx-0"
          >
            Livros de colorir católicos em PDF, com ilustrações exclusivas em
            contorno — prontos para imprimir e colorir em casa, na catequese e
            nos momentos de oração.
          </motion.p>

          <motion.div
            variants={sobe(0.62)}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start"
          >
            <BotaoHero href="#livros" reduz={!!reduz} primario>
              Ver os livros
            </BotaoHero>
            <BotaoHero href="#combo" reduz={!!reduz}>
              Combo com desconto
            </BotaoHero>
          </motion.div>

          <motion.ul
            variants={sobe(0.74)}
            className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-ink-soft lg:justify-start"
          >
            {badges.map((b) => (
              <li key={b} className="flex items-center gap-1.5">
                <span className="text-green" aria-hidden>
                  ✓
                </span>
                {b}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Capas em destaque: parallax 3D + flutuação contínua */}
        <motion.div
          initial="hidden"
          animate="show"
          style={
            reduz
              ? undefined
              : { rotateX: rotacaoX, rotateY: rotacaoY, transformPerspective: 1200 }
          }
          className="flex items-end justify-center gap-2 transform-3d sm:gap-4"
        >
          {capas.map((livro, i) => {
            const rotate = i === 0 ? -6 : i === 2 ? 6 : 0;
            const tamanho =
              i === 1
                ? "z-10 mb-6 w-[38%] max-w-[230px] sm:mb-10"
                : "w-[31%] max-w-[185px]";
            return (
              <motion.div
                key={livro.id}
                variants={entraCapa(i, rotate)}
                whileHover={
                  reduz
                    ? undefined
                    : {
                        scale: 1.06,
                        rotate: rotate * 0.4,
                        transition: { duration: 0.4, ease: EASE_OUT },
                      }
                }
                className={tamanho}
              >
                <Flutua disabled={!!reduz} delay={1 + i * 0.4}>
                  <BookCover
                    src={livro.capa_url ?? ""}
                    alt={`Capa do livro ${livro.titulo}`}
                    priority={i === 1}
                  />
                </Flutua>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// Botão do hero com microinteração de hover/clique.
function BotaoHero({
  href,
  children,
  reduz,
  primario = false,
}: {
  href: string;
  children: ReactNode;
  reduz: boolean;
  primario?: boolean;
}) {
  const estilo = primario
    ? "bg-gold text-white shadow-sm hover:bg-gold-dark"
    : "border border-gold/40 text-ink hover:bg-gold/10";
  return (
    <motion.div
      whileHover={reduz ? undefined : { scale: 1.04 }}
      whileTap={reduz ? undefined : { scale: 0.97 }}
      className="w-full sm:w-auto"
    >
      <Link
        href={href}
        className={`block w-full rounded-full px-7 py-3.5 text-center text-sm font-semibold transition-colors ${estilo}`}
      >
        {children}
      </Link>
    </motion.div>
  );
}

// Flutuação vertical contínua e suave (desligada com prefers-reduced-motion).
function Flutua({
  children,
  disabled,
  delay = 0,
}: {
  children: ReactNode;
  disabled: boolean;
  delay?: number;
}) {
  if (disabled) return <>{children}</>;
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}
