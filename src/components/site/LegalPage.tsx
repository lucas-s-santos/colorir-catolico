export function LegalPage({
  titulo,
  atualizado,
  children,
}: {
  titulo: string;
  atualizado: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="text-3xl font-bold text-ink sm:text-4xl">{titulo}</h1>
      <p className="mt-2 text-sm text-ink-soft">Última atualização: {atualizado}</p>
      <div className="legal mt-8 space-y-5 leading-relaxed text-ink-soft">
        {children}
      </div>
    </article>
  );
}
