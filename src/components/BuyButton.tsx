import { getCheckoutLink } from "@/lib/checkout-links";

type Variant = "primary" | "secondary" | "combo";

interface BuyButtonProps {
  /** slug do produto — usado para achar o link de checkout da Kiwify. */
  slug: string;
  label?: string;
  variant?: Variant;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-gold text-white hover:bg-gold-dark shadow-sm",
  secondary: "border border-gold/40 bg-transparent text-ink hover:bg-gold/10",
  combo: "bg-ink text-cream-soft hover:bg-ink/90 shadow-md",
};

/**
 * Botão "Comprar": leva direto ao checkout da Kiwify (que cuida do pagamento
 * e da entrega do PDF). Sem link cadastrado, mostra "Em breve" desabilitado.
 */
export function BuyButton({
  slug,
  label = "Comprar agora",
  variant = "primary",
  className = "",
}: BuyButtonProps) {
  const url = getCheckoutLink(slug);
  const base = `inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors ${variantClasses[variant]} ${className}`;

  if (!url) {
    return (
      <span
        className={`${base} cursor-not-allowed opacity-60`}
        aria-disabled="true"
        title="Disponível em breve"
      >
        Em breve
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={base}
    >
      {label}
    </a>
  );
}
