"use client";

import { useState } from "react";
import { formatBRL } from "@/lib/format";

type Variant = "primary" | "secondary" | "combo";

interface BuyButtonProps {
  productId: string;
  titulo: string;
  precoCentavos: number;
  label?: string;
  variant?: Variant;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold text-white hover:bg-gold-dark shadow-sm",
  secondary:
    "border border-gold/40 bg-transparent text-ink hover:bg-gold/10",
  combo:
    "bg-ink text-cream-soft hover:bg-ink/90 shadow-md",
};

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export function BuyButton({
  productId,
  titulo,
  precoCentavos,
  label = "Comprar agora",
  variant = "primary",
  className = "",
}: BuyButtonProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [coupon, setCoupon] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (!emailOk(email)) {
      setErro("Digite um e-mail válido para receber o link de download.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          email,
          coupon: coupon.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.init_point) {
        setErro(
          data?.error ??
            "Não foi possível iniciar o pagamento agora. Tente novamente em instantes.",
        );
        setLoading(false);
        return;
      }
      // Redireciona para o checkout do Mercado Pago.
      window.location.href = data.init_point as string;
    } catch {
      setErro("Falha de conexão. Verifique sua internet e tente novamente.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors ${variantClasses[variant]} ${className}`}
      >
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => !loading && setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-gold/20 bg-cream-soft p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 flex items-start justify-between gap-4">
              <h3 className="font-serif text-xl font-bold text-ink">
                Finalizar compra
              </h3>
              <button
                type="button"
                onClick={() => !loading && setOpen(false)}
                className="text-ink-soft transition-colors hover:text-ink"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-ink-soft">
              {titulo} —{" "}
              <span className="font-semibold text-ink">
                {formatBRL(precoCentavos)}
              </span>
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Seu e-mail
                </label>
                <input
                  id="email"
                  type="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com"
                  className="w-full rounded-lg border border-gold/30 bg-white px-3.5 py-2.5 text-ink outline-none ring-gold/30 placeholder:text-ink-soft/60 focus:ring-2"
                />
                <p className="mt-1.5 text-xs text-ink-soft">
                  É para lá que enviaremos o link de download após o pagamento.
                </p>
              </div>

              <details className="text-sm">
                <summary className="cursor-pointer select-none text-gold-dark">
                  Tenho um cupom
                </summary>
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="CUPOM"
                  className="mt-2 w-full rounded-lg border border-gold/30 bg-white px-3.5 py-2.5 uppercase text-ink outline-none ring-gold/30 placeholder:normal-case placeholder:text-ink-soft/60 focus:ring-2"
                />
              </details>

              {erro && (
                <p className="rounded-lg bg-wine/10 px-3 py-2 text-sm text-wine">
                  {erro}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Redirecionando…" : "Pagar com Pix ou cartão"}
              </button>

              <p className="text-center text-xs text-ink-soft">
                🔒 Pagamento processado com segurança pelo Mercado Pago.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
