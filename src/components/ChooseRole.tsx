import { useState } from "react";
import { FaUser, FaDog } from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ChooseRole({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChoose = async (role: "tutor" | "sitter") => {
    setLoading(true);
    await supabase.from("profiles").update({ role }).eq("id", userId);
    setLoading(false);
    if (role === "tutor") {
      router.push("/dashboard/tutor");
    } else {
      router.push("/dashboard/sitter");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Como você quer usar o TrustPaws?
        </h2>
        <div className="flex flex-col gap-6">
          <button
            onClick={() => handleChoose("tutor")}
            disabled={loading}
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
            disabled={loading}
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
