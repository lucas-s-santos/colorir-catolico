// Tipos do domínio — espelham as tabelas do Postgres (supabase/migrations).

export type ProductTipo = "unico" | "combo";
export type OrderStatus = "pendente" | "pago" | "cancelado";

export interface Product {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  preco_centavos: number;
  capa_url: string | null;
  arquivo_path: string | null;
  num_desenhos: number;
  ativo: boolean;
  tipo: ProductTipo;
  itens_combo: string[];
  ordem: number;
  created_at: string;
}

export interface Order {
  id: string;
  email_cliente: string;
  product_id: string;
  valor_centavos: number;
  status: OrderStatus;
  mp_payment_id: string | null;
  mp_preference_id: string | null;
  external_reference: string | null;
  coupon_codigo: string | null;
  criado_em: string;
  pago_em: string | null;
}

export interface DownloadToken {
  id: string;
  order_id: string;
  token: string;
  expira_em: string;
  downloads_restantes: number;
  criado_em: string;
}

export interface Coupon {
  codigo: string;
  desconto_percent: number;
  validade: string | null;
  usos_restantes: number | null;
  ativo: boolean;
  created_at: string;
}
