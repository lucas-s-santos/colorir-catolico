import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const metadata: Metadata = { title: "Política de Privacidade" };

export default function PrivacidadePage() {
  return (
    <LegalPage titulo="Política de Privacidade" atualizado="junho de 2026">
      <p>
        Esta política explica como o <strong>Ateliê Católico Digital</strong>{" "}
        trata os seus dados pessoais, em conformidade com a Lei Geral de
        Proteção de Dados (Lei nº 13.709/2018 — LGPD).
      </p>

      <h2>Quais dados coletamos</h2>
      <p>
        Coletamos o mínimo necessário para concluir sua compra e entregar o
        produto:
      </p>
      <ul>
        <li>
          <strong>E-mail</strong>: para enviar o link de download e dar suporte.
        </li>
        <li>
          <strong>Dados do pagamento</strong>: processados diretamente pela
          Kiwify. Não armazenamos números de cartão.
        </li>
      </ul>

      <h2>Como usamos seus dados</h2>
      <ul>
        <li>Confirmar o pagamento e liberar o download do(s) arquivo(s).</li>
        <li>Enviar o e-mail com o link de acesso e reenviá-lo se necessário.</li>
        <li>Cumprir obrigações legais e prevenir fraudes.</li>
      </ul>

      <h2>Compartilhamento</h2>
      <p>
        Compartilhamos dados apenas com o parceiro essencial à operação: a
        Kiwify (checkout, processamento do pagamento e entrega do produto
        digital). Não vendemos seus dados.
      </p>

      <h2>Seus direitos</h2>
      <p>
        Você pode solicitar acesso, correção ou exclusão dos seus dados a
        qualquer momento pelo e-mail de contato:{" "}
        <a href="mailto:contato@seudominio.com.br">contato@seudominio.com.br</a>.
      </p>

      <h2>Retenção</h2>
      <p>
        Guardamos os dados do pedido pelo tempo necessário para suporte e para
        cumprir obrigações legais. Depois disso, são eliminados ou anonimizados.
      </p>
    </LegalPage>
  );
}
