-- ===========================================================================
--  Ateliê Católico Digital — seed dos produtos (3 livros + combo)
--  Rode DEPOIS de 0001_init.sql. Idempotente (ON CONFLICT DO NOTHING):
--  re-executar não sobrescreve preços que você editou no /admin.
--
--  Observações:
--   - capa_url aponta para placeholders em /public/capas (troque pelas capas reais).
--   - arquivo_path é o nome do PDF no bucket privado 'pdfs' (suba seus PDFs com
--     exatamente estes nomes — veja o README).
--   - O combo NÃO tem arquivo_path; ele é resolvido pelos itens em itens_combo.
-- ===========================================================================

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
