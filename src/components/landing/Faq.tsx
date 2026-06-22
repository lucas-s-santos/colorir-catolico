import { SectionHeading } from "./SectionHeading";

const faqs = [
  {
    q: "Como recebo o livro depois de pagar?",
    a: "Assim que o pagamento é confirmado, você recebe um e-mail com um link seguro para baixar o PDF. Também mostramos o link na tela de confirmação.",
  },
  {
    q: "Em quanto tempo recebo o acesso?",
    a: "No Pix, normalmente em poucos minutos após a confirmação. No cartão, logo após a aprovação. É tudo automático.",
  },
  {
    q: "Posso imprimir quantas vezes quiser?",
    a: "Sim! O arquivo é seu. Imprima em casa ou numa gráfica, quantas vezes precisar, para uso pessoal e familiar.",
  },
  {
    q: "Qual é o formato dos arquivos?",
    a: "PDF em alta qualidade, no tamanho A4, pronto para imprimir em qualquer impressora.",
  },
  {
    q: "Quais as formas de pagamento?",
    a: "Pix e cartão de crédito, processados com segurança pelo Mercado Pago.",
  },
  {
    q: "E se eu tiver algum problema com o download?",
    a: "É só responder o e-mail de confirmação que reenviamos o seu link. O link de download tem validade e um limite de usos por segurança.",
  },
];

export function Faq() {
  return (
    <section id="perguntas" className="scroll-mt-20 bg-cream-soft">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionHeading eyebrow="Perguntas frequentes" title="Tudo o que você precisa saber" />
        <div className="mt-10 divide-y divide-gold/15 border-y border-gold/15">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg font-semibold text-ink">
                {f.q}
                <span className="text-gold-dark transition-transform group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
