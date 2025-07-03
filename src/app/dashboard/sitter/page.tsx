"use client";

import { useUser } from "@/components/shared/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SitterDashboard() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    if (user) {
      const loadUserProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Erro ao carregar perfil do usuário:", error.message);
        } else if (data) {
          setFirstName(data.first_name || "");
        }
      };
      loadUserProfile();
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">
        Bem-vindo, {firstName || user.email}! (Sitter)
      </h1>
      {/* adicionar as funcionalidades */}
    </div>
  );
}
