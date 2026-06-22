# Ateliê Católico Digital

Loja completa para vender **livros de colorir católicos em PDF** (produtos digitais),
com entrega automática por download após o pagamento.

- **Pagamento**: Mercado Pago (Pix e cartão), via Checkout Pro.
- **Entrega**: e-mail com link seguro + página de download protegida por token
  (validade + limite de downloads), servindo o PDF por **URL assinada temporária**.
- **Catálogo**: vem do banco (Supabase), gerenciável pelo painel `/admin`.

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4**
- **Supabase**: Postgres + Storage (PDFs privados, capas públicas) + Auth (admin)
- **Mercado Pago** (atrás de uma interface modular — fácil trocar por Stripe)
- **Resend** (e-mail transacional)
- **Vercel** (deploy)

---

## 1. Rodar localmente

Pré-requisito: **Node 20+**.

```bash
npm install
cp .env.example .env.local   # preencha os valores (veja a seção 6)
npm run dev                  # http://localhost:3000
```

> Sem as chaves reais, o site **ainda abre** (a landing usa um catálogo de
> exemplo e o checkout fica desativado com aviso). Para vender de verdade,
> configure Supabase + Mercado Pago + Resend.

Scripts úteis:

| Comando | O que faz |
|---|---|
| `npm run dev` | Desenvolvimento |
| `npm run build` / `npm start` | Build e servidor de produção |
| `npm run typecheck` | Checagem de tipos |
| `npm run montar-pdfs` | Gera os PDFs dos livros a partir das pastas de imagens |

---

## 2. Supabase (banco, storage e auth)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **SQL Editor**, rode na ordem:
   - `supabase/migrations/0001_init.sql` (tabelas, RLS e buckets `pdfs`/`capas`)
   - `supabase/seed.sql` (cadastra os 3 livros + combo)
3. Em **Project Settings → API**, copie para o `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (segredo — só no servidor)
4. **Usuário admin**: em **Authentication → Users → Add user**, crie seu e-mail e
   senha. (Recomendado: desabilite o cadastro público de novos usuários, já que só
   você acessa o `/admin`.)

### Subir os PDFs (bucket privado `pdfs`)

Os arquivos **nunca** ficam públicos. Suba cada PDF no bucket `pdfs` com **exatamente**
estes nomes (que correspondem ao `arquivo_path` no seed):

- `grandes-momentos-da-fe.pdf`
- `vida-dos-santos-e-milagres.pdf`
- `cenas-biblicas-e-sacramentos.pdf`

> O **combo** não tem arquivo próprio: ele entrega os 3 PDFs acima.

**Gerar os PDFs automaticamente** (opcional): coloque as imagens de cada livro nas
pastas `livro1/`, `livro2/`, `livro3/` (a capa `capa_livroN.png` vira a 1ª página)
e rode `npm run montar-pdfs`. Os PDFs saem em `pdfs-gerados/`.

### Capas

As capas reais já estão em `public/capas/*.png` (servidas pelo site). Para trocá-las,
substitua os arquivos com o mesmo nome, **ou** suba ao bucket público `capas` e
atualize o campo `capa_url` do produto no `/admin`.

---

## 3. Mercado Pago

1. Em [Suas integrações → Credenciais](https://www.mercadopago.com.br/developers),
   pegue o **Access Token** (use **TEST** para sandbox; **PROD** ao publicar) →
   `MERCADOPAGO_ACCESS_TOKEN`.
2. Em **Webhooks**, configure a URL:
   `https://SEU_DOMINIO/api/webhook/mercadopago` (evento **Pagamentos**), copie a
   **chave secreta** → `MERCADOPAGO_WEBHOOK_SECRET`.

> O webhook valida a **assinatura** e **reconsulta o pagamento na API** antes de
> liberar qualquer download (nunca confia só no payload). Para testar localmente,
> exponha o `localhost` com um túnel (ex.: `ngrok`) e use a URL pública como
> `NEXT_PUBLIC_SITE_URL` e no webhook do MP.

---

## 4. Resend (e-mail)

1. Crie a API key em [resend.com/api-keys](https://resend.com/api-keys) →
   `RESEND_API_KEY`.
2. Verifique seu domínio e ajuste `EMAIL_FROM`
   (ex.: `Ateliê Católico Digital <contato@seudominio.com.br>`).
   Para testes rápidos, dá para usar `onboarding@resend.dev`.

---

## 5. Deploy na Vercel

1. Suba o projeto para o GitHub e importe em [vercel.com](https://vercel.com).
2. Em **Settings → Environment Variables**, adicione **todas** as variáveis do
   `.env.example` (com os valores de produção). Defina `NEXT_PUBLIC_SITE_URL` com
   o domínio final (ex.: `https://seudominio.com.br`).
3. Deploy. Depois, no Mercado Pago, aponte o webhook para
   `https://SEU_DOMINIO/api/webhook/mercadopago`.
4. Analytics: já incluso (`@vercel/analytics`) — ative em **Analytics** no painel.

---

## 6. Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública do site (sem barra no final) |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Acesso público ao Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | **Segredo** — operações de servidor |
| `MERCADOPAGO_ACCESS_TOKEN` | Token do Mercado Pago (TEST ou PROD) |
| `MERCADOPAGO_WEBHOOK_SECRET` | Assinatura do webhook |
| `RESEND_API_KEY` / `EMAIL_FROM` | E-mail transacional |
| `DOWNLOAD_EXPIRES_DAYS` (7) | Validade do link de download |
| `DOWNLOAD_MAX` (5) | Limite de downloads por compra |
| `SIGNED_URL_TTL_SECONDS` (600) | Validade da URL assinada do PDF |
| `WATERMARK_ENABLED` (false) | Grava o e-mail do comprador no rodapé do PDF |

Segredos ficam **apenas** em variáveis de ambiente (nunca no código). O
`.env.local` não é versionado.

---

## 7. Cupons (opcional)

Crie cupons direto no Supabase (tabela `coupons`). Exemplo no SQL Editor:

```sql
insert into public.coupons (codigo, desconto_percent, usos_restantes, ativo)
values ('BEMVINDO10', 10, 100, true);
```

O cliente digita o código no checkout; o desconto é aplicado no servidor e o uso
é debitado quando o pagamento é confirmado.

---

## 8. Trocar Mercado Pago por Stripe (futuro)

Os pagamentos estão atrás da interface `PaymentProvider`
(`src/lib/payments/provider.ts`). Basta criar `stripe.ts` implementando a interface
e apontar `src/lib/payments/index.ts` para ele — o resto do sistema não muda.

---

## 9. Checklist de aceite

- [ ] Compra de teste no **Pix sandbox**: paga → webhook confirma → e-mail chega → download funciona.
- [ ] PDF só baixa com **token válido**, dentro da validade e do limite; link direto ao arquivo no Storage **não** funciona.
- [ ] Landing carrega rápido, responsiva, com as **3 capas**.
- [ ] `/admin` lista pedidos e permite **reenviar o link**.
- [ ] Páginas de **privacidade, reembolso e termos** revisadas (ajuste o e-mail de contato e dados).
- [ ] Depoimentos da landing substituídos por **reais** antes de publicar.

---

## Estrutura

```
src/
  app/
    (site)/        landing, produto, obrigado, download, páginas legais
    admin/         login, pedidos, produtos (Supabase Auth)
    api/           checkout, webhook/mercadopago, download/[token]
  components/      landing, site, admin, BuyButton
  lib/             config, supabase, payments, orders, download, coupons, email, pdf
supabase/          migrations + seed
scripts/           montar-pdfs.mjs
```
