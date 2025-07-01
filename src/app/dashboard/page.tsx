"use client";

import { useUser } from "@/components/shared/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ChooseRole from "../../components/ChooseRole";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    if (user) {
      const loadUserProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, role")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Erro ao carregar perfil do usuário:", error.message);
        } else if (data) {
          setFirstName(data.first_name || "");
          setRole(data.role || null);
        }
        setCheckingRole(false);
      };
      loadUserProfile();
    }
  }, [user, loading, router]);

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!role) {
    return (
      <ChooseRole userId={user.id} onRoleChosen={() => setRole("chosen")} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Bem-vindo, {firstName || user.email}!
            </h1>
          </div>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Perfil</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="text-sm font-medium text-gray-900">{user.id}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/dashboard/settings"
                  className="text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200"
                >
                  Editar detalhes da conta
                </Link>
              </div>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Status da conta
              </h2>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                <span className="text-sm text-gray-900">Ativo</span>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Atividade recente
              </h2>
              <p className="text-sm text-gray-500">
                Último login:{" "}
                {new Date(user.last_sign_in_at || "").toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
