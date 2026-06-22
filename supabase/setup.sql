-- ===========================================================================
--  Ateliê Católico Digital — SETUP COMPLETO (schema + seed em um arquivo só)
--  COMO USAR:
--    1. Abra o SQL Editor do seu projeto:
--       https://supabase.com/dashboard/project/oddensbhnicwcpemwdui/sql/new
--    2. Cole TODO o conteúdo deste arquivo.
--    3. Clique em "Run".
--  É idempotente: pode rodar mais de uma vez sem erro.
-- ===========================================================================

-- gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
--  TABELAS
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  titulo         text not null,
  descricao      text not null default '',
  preco_centavos integer not null check (preco_centavos >= 0),
  capa_url       text,
  arquivo_path   text,
  num_desenhos   integer not null default 0,
  ativo          boolean not null default true,
  tipo           text not null default 'unico' check (tipo in ('unico','combo')),
  itens_combo    uuid[] not null default '{}',
  ordem          integer not null default 0,
  created_at     timestamptz not null default now()
);

create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  email_cliente      text not null,
  product_id         uuid not null references public.products(id),
  valor_centavos     integer not null check (valor_centavos >= 0),
  status             text not null default 'pendente' check (status in ('pendente','pago','cancelado')),
  mp_payment_id      text,
  mp_preference_id   text,
  external_reference text,
  coupon_codigo      text,
  criado_em          timestamptz not null default now(),
  pago_em            timestamptz
);

create table if not exists public.download_tokens (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references public.orders(id) on delete cascade,
  token               uuid unique not null default gen_random_uuid(),
  expira_em           timestamptz not null,
  downloads_restantes integer not null default 5 check (downloads_restantes >= 0),
  criado_em           timestamptz not null default now()
);

create table if not exists public.coupons (
  codigo           text primary key,
  desconto_percent integer not null check (desconto_percent between 1 and 100),
  validade         timestamptz,
  usos_restantes   integer,
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

-- ---------------------------------------------------------------------------
--  STORAGE (buckets)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('capas', 'capas', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
--  SEED — 3 livros + combo
-- ---------------------------------------------------------------------------
insert into public.products
  (id, slug, titulo, descricao, preco_centavos, capa_url, arquivo_path, num_desenhos, tipo, itens_combo, ordem)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'grandes-momentos-da-fe',
    'Grandes Momentos da Fé',
    'Dez cenas marcadas pela presença de Deus na história da salvação — da criação à promessa cumprida. Ideal para começar a colorir a fé em família, com traços generosos e cheios de significado.',
    1490,
    '/capas/grandes-momentos-da-fe.png',
    'grandes-momentos-da-fe.pdf',
    10,
    'unico',
    '{}',
    1
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'vida-dos-santos-e-milagres',
    'Vida dos Santos e Milagres',
    'Vinte desenhos que celebram a vida dos santos e os milagres que tocaram gerações. Uma forma carinhosa de apresentar exemplos de santidade às crianças, na catequese ou em casa.',
    1990,
    '/capas/vida-dos-santos-e-milagres.png',
    'vida-dos-santos-e-milagres.pdf',
    20,
    'unico',
    '{}',
    2
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'cenas-biblicas-e-sacramentos',
    'Cenas Bíblicas e Sacramentos',
    'Trinta cenas bíblicas e os sacramentos da Igreja, do Batismo à Eucaristia. O álbum mais completo para momentos de oração, contemplação e convivência em família.',
    2490,
    '/capas/cenas-biblicas-e-sacramentos.png',
    'cenas-biblicas-e-sacramentos.pdf',
    30,
    'unico',
    '{}',
    3
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'combo-3-livros',
    'Combo Completo — os 3 livros',
    'Os três livros juntos — Grandes Momentos da Fé, Vida dos Santos e Milagres e Cenas Bíblicas e Sacramentos — reunidos com um desconto especial. Sessenta desenhos para colorir a fé do começo ao fim.',
    4990,
    '/capas/combo-3-livros.svg',
    null,
    60,
    'combo',
    array[
      '11111111-1111-1111-1111-111111111111'::uuid,
      '22222222-2222-2222-2222-222222222222'::uuid,
      '33333333-3333-3333-3333-333333333333'::uuid
    ],
    4
  )
on conflict (id) do nothing;
