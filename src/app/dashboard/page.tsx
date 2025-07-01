"use client";

import { useUser } from "@/components/shared/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ChooseRole from "../../components/ChooseRole";
import { FaDog, FaCat, FaMars, FaVenus, FaPlus } from "react-icons/fa";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [showAddPet, setShowAddPet] = useState(false);
  const [species, setSpecies] = useState("");
  const [gender, setGender] = useState("");
  const [castrated, setCastrated] = useState("");
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [size, setSize] = useState("");
  const [birthday, setBirthday] = useState({ day: "", month: "", year: "" });
  const [knowDayMonth, setKnowDayMonth] = useState(false);
  const [vaccines, setVaccines] = useState<string[]>([]);
  const [petPhoto, setPetPhoto] = useState<string | null>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [editingPet, setEditingPet] = useState<any | null>(null);
  const [petError, setPetError] = useState<string | null>(null);
  const [petSuccess, setPetSuccess] = useState<string | null>(null);

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

  useEffect(() => {
    if (user) {
      const fetchPets = async () => {
        const { data, error } = await supabase
          .from("pets")
          .select("*")
          .eq("tutor_id", user.id)
          .order("id", { ascending: false });
        if (!error && data) setPets(data);
      };
      fetchPets();
    }
  }, [user]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setPetPhoto(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function toggleVaccine(vac: string) {
    setVaccines((prev) =>
      prev.includes(vac) ? prev.filter((v) => v !== vac) : [...prev, vac]
    );
  }

  function openEditPet(pet: any) {
    setEditingPet(pet);
    setSpecies(pet.species);
    setGender(pet.gender);
    setCastrated(pet.castrated);
    setPetName(pet.pet_name);
    setBreed(pet.breed);
    setSize(pet.size);
    setBirthday(pet.birthday || { day: "", month: "", year: "" });
    setKnowDayMonth(pet.know_day_month || false);
    setVaccines(pet.vaccines || []);
    setPetPhoto(pet.pet_photo || null);
    setShowAddPet(true);
  }

  async function handleDeletePet(petId: number) {
    await supabase.from("pets").delete().eq("id", petId);
    setPets((prev) => prev.filter((p) => p.id !== petId));
  }

  async function handleAddPet(e: React.FormEvent) {
    e.preventDefault();
    setPetError(null);
    setPetSuccess(null);
    if (!user) return;
    const newPet = {
      tutor_id: user.id,
      species,
      gender,
      castrated,
      pet_name: petName,
      breed,
      size,
      birthday,
      know_day_month: knowDayMonth,
      vaccines,
      pet_photo: petPhoto,
    };
    let error = null;
    if (editingPet) {
      // Update
      ({ error } = await supabase
        .from("pets")
        .update(newPet)
        .eq("id", editingPet.id));
    } else {
      ({ error } = await supabase.from("pets").insert([newPet]));
    }
    if (error) {
      setPetError("Erro ao salvar pet: " + error.message);
      return;
    }
    setPetSuccess("Pet salvo com sucesso!");
    // buscar pets novamente após adicionar/editar
    const { data } = await supabase
      .from("pets")
      .select("*")
      .eq("tutor_id", user.id)
      .order("id", { ascending: false });
    setPets(data || []);
    setShowAddPet(false);
    setEditingPet(null);
    // limpar campos
    setSpecies("cachorro");
    setGender("macho");
    setCastrated("");
    setPetName("");
    setBreed("");
    setSize("");
    setBirthday({ day: "", month: "", year: "" });
    setKnowDayMonth(false);
    setVaccines([]);
    setPetPhoto(null);
  }

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

          <div className="space-y-8">
            <div className="border-b pb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Perfil</h2>
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="text-sm font-medium text-gray-900">{user.id}</p>
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

            {/* adicionar pet */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Adicionar Pet
              </h2>
              <button
                onClick={() => setShowAddPet((prev) => !prev)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block mb-4"
              >
                Adicionar Pet
              </button>

              {showAddPet && (
                <div className="border border-gray-200 rounded-lg shadow-md p-8 bg-white transition-all w-full max-w-2xl mx-auto">
                  <h3 className="text-2xl font-semibold mb-6">Adicionar pet</h3>
                  {petError && (
                    <div className="mb-4 text-red-600 font-semibold">
                      {petError}
                    </div>
                  )}
                  {petSuccess && (
                    <div className="mb-4 text-green-600 font-semibold">
                      {petSuccess}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mb-6">
                    <label className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-500 cursor-pointer hover:bg-pink-600 transition">
                      <FaPlus className="text-white text-xl" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                    <span className="text-gray-500 text-sm">
                      Adicionar foto do pet (opcional)
                    </span>
                  </div>
                  <div className="flex gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setSpecies("cachorro")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-lg font-medium ${
                        species === "cachorro"
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <FaDog /> Cachorro
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpecies("gato")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-lg font-medium ${
                        species === "gato"
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <FaCat /> Gato
                    </button>
                  </div>
                  <form className="space-y-6" onSubmit={handleAddPet}>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gênero
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setGender("macho")}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-lg font-medium ${
                              gender === "macho"
                                ? "bg-gray-800 text-white"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            <FaMars /> Macho
                          </button>
                          <button
                            type="button"
                            onClick={() => setGender("femea")}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-lg font-medium ${
                              gender === "femea"
                                ? "bg-gray-800 text-white"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            <FaVenus /> Fêmea
                          </button>
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Castrado
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-md p-2"
                          value={castrated}
                          onChange={(e) => setCastrated(e.target.value)}
                        >
                          <option value="">Selecione aqui</option>
                          <option value="sim">Sim</option>
                          <option value="nao">Não</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="Digite o nome"
                          value={petName}
                          onChange={(e) => setPetName(e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Raça
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="Digite a raça"
                          value={breed}
                          onChange={(e) => setBreed(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tamanho
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-md p-2"
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                        >
                          <option value="">Selecione aqui</option>
                          <option value="pequeno">Pequeno</option>
                          <option value="medio">Médio</option>
                          <option value="grande">Grande</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Aniversário
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Dia"
                            className="w-1/3 border border-gray-300 rounded-md p-2"
                            value={birthday.day}
                            onChange={(e) =>
                              setBirthday({ ...birthday, day: e.target.value })
                            }
                            disabled={!knowDayMonth}
                          />
                          <input
                            type="text"
                            placeholder="Mês"
                            className="w-1/3 border border-gray-300 rounded-md p-2"
                            value={birthday.month}
                            onChange={(e) =>
                              setBirthday({
                                ...birthday,
                                month: e.target.value,
                              })
                            }
                            disabled={!knowDayMonth}
                          />
                          <input
                            type="text"
                            placeholder="Ano"
                            className="w-1/3 border border-gray-300 rounded-md p-2"
                            value={birthday.year}
                            onChange={(e) =>
                              setBirthday({ ...birthday, year: e.target.value })
                            }
                          />
                        </div>
                        <label className="flex items-center gap-2 mt-1 text-sm">
                          <input
                            type="checkbox"
                            checked={knowDayMonth}
                            onChange={(e) => setKnowDayMonth(e.target.checked)}
                          />{" "}
                          Sei o dia e o mês
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quais das vacinas tomou no último ano?
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleVaccine("V8/V10")}
                          className={`px-4 py-2 rounded-full border text-sm font-medium ${
                            vaccines.includes("V8/V10")
                              ? "bg-pink-500 text-white border-pink-500"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                        >
                          V8/V10
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleVaccine("Antirrábica")}
                          className={`px-4 py-2 rounded-full border text-sm font-medium ${
                            vaccines.includes("Antirrábica")
                              ? "bg-pink-500 text-white border-pink-500"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                        >
                          Antirrábica
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between mt-8">
                      <button
                        type="button"
                        onClick={() => setShowAddPet(false)}
                        className="px-6 py-2 rounded-md border border-pink-500 text-pink-600 font-semibold bg-white hover:bg-pink-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-md bg-pink-600 text-white font-semibold hover:bg-pink-700 transition-colors"
                      >
                        Salvar
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* pets */}
            {pets.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">Meus pets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pets.map((pet, idx) => (
                    <div
                      key={pet.id}
                      className="flex gap-4 items-center border rounded-lg p-4 bg-white shadow-sm cursor-pointer group relative"
                      onClick={() => openEditPet(pet)}
                    >
                      <img
                        src={pet.pet_photo ? pet.pet_photo : undefined}
                        alt="Foto do pet"
                        className="w-20 h-20 rounded-full object-cover border"
                      />
                      <div>
                        <div className="font-bold text-lg text-gray-800 flex items-center gap-2">
                          {pet.pet_name}{" "}
                          <span className="text-sm text-gray-500">
                            ({pet.species})
                          </span>
                        </div>
                        <div className="text-gray-600 text-sm">
                          Raça: {pet.breed || "-"}
                        </div>
                        <div className="text-gray-600 text-sm">
                          Sexo: {pet.gender}, Castrado: {pet.castrated || "-"}
                        </div>
                        <div className="text-gray-600 text-sm">
                          Tamanho: {pet.size || "-"}
                        </div>
                        <div className="text-gray-600 text-sm">
                          Vacinas: {pet.vaccines.join(", ") || "Nenhuma"}
                        </div>
                      </div>
                      <button
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePet(pet.id);
                        }}
                        title="Apagar pet"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
