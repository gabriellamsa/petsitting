"use client";
import { useUser } from "@/components/shared/UserProvider";
import { useEffect, useState } from "react";
import { FaUser, FaDog } from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ChooseRole() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.role) {
            setRole(data.role);
            // Redireciona se já tiver role
            if (data.role === "tutor") router.replace("/dashboard/tutor");
            if (data.role === "sitter") router.replace("/dashboard/sitter");
          }
          setLoading(false);
        });
    }
  }, [user, router]);

  const handleChoose = async (role: "tutor" | "sitter") => {
    if (!user) return;
    setLoading(true);
    await supabase.from("profiles").update({ role }).eq("id", user.id);
    setLoading(false);
    if (role === "tutor") {
      router.push("/dashboard/tutor/onboarding");
    } else {
      router.push("/dashboard/sitter");
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (role) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Como você quer usar o TrustPaws?
        </h2>
        <div className="flex flex-col gap-6">
          <button
            onClick={() => user && handleChoose("tutor")}
            disabled={loading || !user}
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
            onClick={() => user && handleChoose("sitter")}
            disabled={loading || !user}
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
      </div>
    </div>
  );
}
