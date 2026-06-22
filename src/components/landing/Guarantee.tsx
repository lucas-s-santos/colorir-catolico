const itens = [
  {
    icone: "🔒",
    titulo: "Pagamento seguro",
    texto: "Processado pelo Mercado Pago, com Pix e cartão.",
  },
  {
    icone: "⚡",
    titulo: "Download imediato",
    texto: "Acesso liberado automaticamente após a confirmação.",
  },
  {
    icone: "🛡️",
    titulo: "Seus dados protegidos",
    texto: "Coletamos só o seu e-mail, conforme a LGPD.",
  },
  {
    icone: "♾️",
    titulo: "É seu para sempre",
    texto: "Imprima quantas vezes quiser, para uso em família.",
  },
];

export function Guarantee() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <div className="grid gap-6 rounded-3xl border border-gold/20 bg-cream-soft p-8 sm:grid-cols-2 lg:grid-cols-4">
        {itens.map((i) => (
          <div key={i.titulo} className="text-center sm:text-left">
            <div className="text-2xl" aria-hidden>
              {i.icone}
            </div>
            <h3 className="mt-2 font-serif text-lg font-bold text-ink">
              {i.titulo}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{i.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
