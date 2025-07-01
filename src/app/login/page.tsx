"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      window.location.href = "/dashboard";
    } catch (error: any) {
      setError(error.message);
      console.error("Erro ao fazer login:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMagicLinkLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setMagicLinkSent(true);
    } catch (error: any) {
      setError(error.message);
      console.error("Erro ao enviar link:", error);
    } finally {
      setMagicLinkLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md bg-white text-center">
          <h2 className="text-xl font-semibold text-gray-900 text-center">
            Verifique seu email
          </h2>
          <p className="text-center text-gray-700 text-sm mt-4">
            Um link de login foi enviado para <strong>{email}</strong>.
            <br />
            Clique no link no seu email para criar sua conta.
          </p>
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => {
                setMagicLinkSent(false);
                setEmail("");
                setIsRegistering(false);
              }}
              className="text-sm text-gray-700 hover:underline"
            >
              Usar um email diferente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          {isRegistering ? "Junte-se ao TrustPaws" : "Entrar"}
        </h1>
        <p className="text-gray-700 mt-2 mb-6">
          {isRegistering
            ? "Digite seu email para receber um link de login seguro"
            : "Bem-vindo de volta! Esperávamos ver você de novo…"}
        </p>

        {!isRegistering ? (
          <>
            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="email"
                required
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                required
                placeholder="Password"
                className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-2 rounded-md text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
              >
                Entrar
                {loading ? "Entrando..." : " "}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-700 text-sm">
                Não tem uma conta?{" "}
                <button
                  onClick={() => setIsRegistering(true)}
                  className="text-gray-900 hover:underline font-semibold"
                >
                  Junte-se agora
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleRegister} className="space-y-6">
              <input
                type="email"
                required
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={magicLinkLoading}
                className="w-full bg-gray-900 text-white py-2 rounded-md text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
              >
                {magicLinkLoading
                  ? "Enviando link..."
                  : "Link de login enviado"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-700 text-sm">
                Já tem uma conta?{" "}
                <button
                  onClick={() => setIsRegistering(false)}
                  className="text-gray-900 hover:underline font-semibold"
                >
                  Entrar
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
