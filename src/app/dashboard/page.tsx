"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/shared/UserProvider";
import { supabase } from "@/lib/supabase";

export default function DashboardIndex() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [status, setStatus] = useState("Carregando...");

  useEffect(() => {
    async function redirect() {
      if (!loading && user) {
        setStatus("Buscando perfil...");
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        console.log("Perfil carregado:", data, error);
        if (!error && data && data.role) {
          if (data.role === "tutor") {
            setStatus("Redirecionando para dashboard tutor...");
            router.replace("/dashboard/tutor");
          } else if (data.role === "sitter") {
            setStatus("Redirecionando para dashboard sitter...");
            router.replace("/dashboard/sitter");
          } else {
            setStatus("Redirecionando para first login...");
            router.replace("/first-login");
          }
        } else {
          setStatus("Redirecionando para first login...");
          router.replace("/first-login");
        }
      } else if (!loading && !user) {
        setStatus("Redirecionando para login...");
        router.replace("/login");
      }
    }
    redirect();
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
      <div className="text-gray-700 text-lg">{status}</div>
    </div>
  );
}
