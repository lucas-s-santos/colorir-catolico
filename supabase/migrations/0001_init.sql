-- ===========================================================================
--  Ateliê Católico Digital — schema inicial
--  Rode este arquivo no SQL Editor do Supabase (ou via `supabase db push`).
--  É idempotente: pode ser executado mais de uma vez sem erro.
-- ===========================================================================

-- gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
--  TABELAS
-- ---------------------------------------------------------------------------

-- Produtos (livros avulsos e combo). O catálogo vem daqui, não do código.
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  titulo         text not null,
  descricao      text not null default '',
  preco_centavos integer not null check (preco_centavos >= 0),
  capa_url       text,                      -- URL/path da imagem de capa (bucket público 'capas' ou /public)
  arquivo_path   text,                      -- caminho do PDF no bucket privado 'pdfs' (NULL quando tipo='combo')
  num_desenhos   integer not null default 0,
  ativo          boolean not null default true,
  tipo           text not null default 'unico' check (tipo in ('unico','combo')),
  itens_combo    uuid[] not null default '{}',  -- ids de products quando tipo='combo'
  ordem          integer not null default 0,    -- ordenação na vitrine
  created_at     timestamptz not null default now()
);

comment on column public.products.arquivo_path is 'Caminho do PDF no bucket privado pdfs. NULL em combos (resolvidos via itens_combo).';
comment on column public.products.capa_url is 'URL pública da capa. Pode ser /public local (placeholder) ou URL do bucket público capas.';

-- Pedidos. Criados como "pendente" no checkout e confirmados pelo webhook.
create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  email_cliente      text not null,
  product_id         uuid not null references public.products(id),
  valor_centavos     integer not null check (valor_centavos >= 0),
  status             text not null default 'pendente' check (status in ('pendente','pago','cancelado')),
  mp_payment_id      text,
  mp_preference_id   text,
  external_reference text,                  -- = orders.id, usado para casar com o webhook
  coupon_codigo      text,
  criado_em          timestamptz not null default now(),
  pago_em            timestamptz
);

-- Tokens de download seguros: validade + limite de downloads.
create table if not exists public.download_tokens (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references public.orders(id) on delete cascade,
  token               uuid unique not null default gen_random_uuid(),
  expira_em           timestamptz not null,
  downloads_restantes integer not null default 5 check (downloads_restantes >= 0),
  criado_em           timestamptz not null default now()
);

-- Cupons de desconto (opcional / extra).
create table if not exists public.coupons (
  codigo           text primary key,
  desconto_percent integer not null check (desconto_percent between 1 and 100),
  validade         timestamptz,             -- NULL = sem data de expiração
  usos_restantes   integer,                 -- NULL = ilimitado
  ativo            boolean not null default true,
  created_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
--  ÍNDICES
-- ---------------------------------------------------------------------------
create index if not exists idx_products_ativo            on public.products(ativo);
create index if not exists idx_orders_external_reference on public.orders(external_reference);
create index if not exists idx_orders_status             on public.orders(status);
create index if not exists idx_orders_email              on public.orders(email_cliente);
create index if not exists idx_download_tokens_order     on public.download_tokens(order_id);

-- ---------------------------------------------------------------------------
--  ROW LEVEL SECURITY
--  Regra geral: o servidor usa a SERVICE ROLE KEY, que IGNORA o RLS.
--  Portanto só precisamos liberar explicitamente o que o público (anon) pode ver.
--  products: leitura pública apenas dos ativos.
--  orders / download_tokens / coupons: nenhum acesso público (só via service role).
-- ---------------------------------------------------------------------------
alter table public.products        enable row level security;
alter table public.orders          enable row level security;
alter table public.download_tokens enable row level security;
alter table public.coupons         enable row level security;

drop policy if exists "products_select_public" on public.products;
create policy "products_select_public"
  on public.products
  for select
  to anon, authenticated
  using (ativo = true);

-- (Sem políticas para orders/download_tokens/coupons: ficam acessíveis apenas
--  pela service role, usada no backend.)

-- ---------------------------------------------------------------------------
--  STORAGE (buckets)
--   pdfs  -> PRIVADO (livros). Acesso só por signed URL gerada no servidor.
--   capas -> PÚBLICO (imagens de capa), servidas pela URL pública.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('capas', 'capas', true)
on conflict (id) do nothing;
