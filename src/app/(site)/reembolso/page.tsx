import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const metadata: Metadata = { title: "Política de Reembolso" };

export default function ReembolsoPage() {
  return (
    <LegalPage titulo="Política de Reembolso" atualizado="junho de 2026">
      <p>
        Queremos que você fique satisfeita(o) com os nossos livros de colorir.
        Esta política trata de devoluções e reembolsos de produtos digitais
        (PDF).
      </p>

      <h2>Direito de arrependimento</h2>
      <p>
        Conforme o art. 49 do Código de Defesa do Consumidor, você pode desistir
        da compra em até <strong>7 dias corridos</strong> a contar da data do
        pagamento, solicitando o reembolso integral.
      </p>

      <h2>Como solicitar</h2>
      <p>
        Basta escrever para{" "}
        <a href="mailto:lucassilvadossantos2005@gmail.com">lucassilvadossantos2005@gmail.com</a>{" "}
        informando o e-mail usado na compra. O estorno é feito pelo mesmo meio de
        pagamento (no Pix, na conta informada).
      </p>

      <h2>Observações sobre produto digital</h2>
      <ul>
        <li>
          Por se tratar de arquivo de acesso imediato, pedimos bom senso: o
          reembolso destina-se a quem desistiu ou teve algum problema, não ao uso
          do material seguido de devolução.
        </li>
        <li>
          Se você tiver qualquer dificuldade com o download, fale conosco — na
          maioria das vezes resolvemos reenviando o link.
        </li>
      </ul>
    </LegalPage>
  );
}
