"use client";
import { useUser } from "@/components/shared/UserProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { FaUser, FaDog } from "react-icons/fa";

export default function FirstLoginPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChoose = async (role: "tutor" | "sitter") => {
    if (!user) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      setError("Erro ao salvar escolha. Tente novamente.");
      return;
    }
    if (role === "tutor") {
      router.replace("/dashboard/tutor/onboarding");
    } else {
      router.replace("/dashboard/sitter");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Como você quer usar o TrustPaws?
        </h2>
        <div className="flex flex-col gap-6">
          <button
            onClick={() => handleChoose("tutor")}
            disabled={saving}
            className="flex flex-col items-center gap-2 p-6 border rounded-lg hover:shadow-lg transition cursor-pointer bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <FaUser className="text-4xl text-indigo-600" />
            <span className="text-lg font-semibold text-gray-900">
              Sou Tutor
            </span>
            <span className="text-gray-500 text-sm">
              Quero encontrar cuidadores para meus pets
            </span>
          </button>
          <button
            onClick={() => handleChoose("sitter")}
            disabled={saving}
            className="flex flex-col items-center gap-2 p-6 border rounded-lg hover:shadow-lg transition cursor-pointer bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          >
            <FaDog className="text-4xl text-pink-600" />
            <span className="text-lg font-semibold text-gray-900">
              Sou Pet/House Sitter
            </span>
            <span className="text-gray-500 text-sm">
              Quero cuidar de pets ou casas
            </span>
          </button>
        </div>
        {error && <div className="text-red-600 mt-4">{error}</div>}
      </div>
    </div>
  );
}
