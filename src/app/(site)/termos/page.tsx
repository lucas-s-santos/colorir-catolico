import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const metadata: Metadata = { title: "Termos de Uso" };

export default function TermosPage() {
  return (
    <LegalPage titulo="Termos de Uso" atualizado="junho de 2026">
      <p>
        Ao comprar e usar os produtos do{" "}
        <strong>Ateliê Católico Digital</strong>, você concorda com os termos
        abaixo.
      </p>

      <h2>O que você adquire</h2>
      <p>
        Você adquire uma licença de uso pessoal e familiar dos arquivos em PDF.
        Pode imprimir quantas vezes quiser para esse fim.
      </p>

      <h2>O que não é permitido</h2>
      <ul>
        <li>Revender, redistribuir ou compartilhar os arquivos.</li>
        <li>
          Publicar os desenhos em sites, redes ou aplicativos como se fossem
          seus.
        </li>
        <li>Usar o material para fins comerciais sem autorização por escrito.</li>
      </ul>

      <h2>Entrega e acesso</h2>
      <p>
        Após a confirmação do pagamento, o link de download é enviado por e-mail.
        O link tem prazo de validade e um limite de downloads, por segurança. Em
        caso de problema, reenviamos o acesso.
      </p>

      <h2>Direitos autorais</h2>
      <p>
        Todas as ilustrações são protegidas por direitos autorais e permanecem de
        titularidade do Ateliê Católico Digital.
      </p>

      <h2>Contato</h2>
      <p>
        Dúvidas? Escreva para{" "}
        <a href="mailto:lucassilvadossantos2005@gmail.com">lucassilvadossantos2005@gmail.com</a>.
      </p>
    </LegalPage>
  );
}
