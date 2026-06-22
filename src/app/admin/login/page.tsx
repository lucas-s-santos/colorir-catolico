"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    if (error) {
      setErro("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-20">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-gold/20 bg-cream-soft p-7 shadow-sm"
      >
        <h1 className="text-center font-serif text-2xl font-bold text-ink">
          Painel · Ateliê Católico
        </h1>
        <p className="mt-1 text-center text-sm text-ink-soft">
          Acesso restrito à administração.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gold/30 bg-white px-3.5 py-2.5 text-ink outline-none ring-gold/30 focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-ink">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-lg border border-gold/30 bg-white px-3.5 py-2.5 text-ink outline-none ring-gold/30 focus:ring-2"
            />
          </div>

          {erro && (
            <p className="rounded-lg bg-wine/10 px-3 py-2 text-sm text-wine">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gold-dark disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
