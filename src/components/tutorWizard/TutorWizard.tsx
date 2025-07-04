"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/components/shared/UserProvider";

// etapa 1: tipos de pets
const PET_TYPES = [
  { key: "dog", label: "Cachorro" },
  { key: "cat", label: "Gato" },
  { key: "poultry", label: "Aves de curral" },
  { key: "horse", label: "Cavalo" },
  { key: "fish", label: "Peixe" },
  { key: "bird", label: "Pássaro" },
  { key: "reptile", label: "Réptil" },
  { key: "livestock", label: "Animais de fazenda" },
  { key: "small", label: "Pequenos pets" },
];
function StepPetTypes({
  onNext,
}: {
  onNext: (data: { petTypes: string[] }) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  function toggleType(type: string) {
    setSelected((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Quais pets você tem?</h2>
      <p className="text-gray-600 mb-6">
        De cães a animais de fazenda, vamos te ajudar a encontrar o cuidador
        perfeito. Escolha quantos tipos de pets você quiser.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {PET_TYPES.map((pet) => (
          <button
            key={pet.key}
            type="button"
            onClick={() => toggleType(pet.key)}
            className={`border rounded-lg py-3 px-4 flex items-center justify-center font-medium transition-all
              ${
                selected.includes(pet.key)
                  ? "bg-indigo-600 text-white border-indigo-600 shadow"
                  : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            {pet.label}
          </button>
        ))}
      </div>
      <button
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold text-lg disabled:opacity-50"
        disabled={selected.length === 0}
        onClick={() => onNext({ petTypes: selected })}
      >
        Continuar
      </button>
    </div>
  );
}

// etapa 2: quantidade de pets
const PET_LABELS: Record<string, string> = {
  dog: "Cachorros",
  cat: "Gatos",
  poultry: "Aves de curral",
  horse: "Cavalos",
  fish: "Peixes",
  bird: "Pássaros",
  reptile: "Répteis",
  livestock: "Animais de fazenda",
  small: "Pequenos pets",
};
function StepPetCount({
  petTypes,
  onNext,
  onBack,
}: {
  petTypes: string[];
  onNext: (data: { petCount: Record<string, number> }) => void;
  onBack: () => void;
}) {
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const obj: Record<string, number> = {};
    petTypes.forEach((type) => (obj[type] = 1));
    return obj;
  });
  function setCount(type: string, value: number) {
    setCounts((prev) => ({ ...prev, [type]: Math.max(1, value) }));
  }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Quantos pets você tem?</h2>
      <div className="space-y-4 mb-8">
        {petTypes.map((type) => (
          <div key={type} className="flex items-center gap-4 justify-center">
            <span className="font-medium w-32 text-left">
              {PET_LABELS[type]}
            </span>
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-gray-200 text-lg font-bold"
              onClick={() => setCount(type, counts[type] - 1)}
              disabled={counts[type] <= 1}
            >
              -
            </button>
            <span className="w-8 text-center font-semibold">
              {counts[type]}
            </span>
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-gray-200 text-lg font-bold"
              onClick={() => setCount(type, counts[type] + 1)}
            >
              +
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 font-semibold bg-white hover:bg-gray-50"
          onClick={onBack}
        >
          Voltar
        </button>
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold text-lg"
          onClick={() => onNext({ petCount: counts })}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

// etapa 3: necessidades específicas
const NEEDS = [
  "Cães ou gatos idosos",
  "Filhotes de cães ou gatos",
  "Administração de medicação",
  "Cães especialmente grandes",
  "Gatos ansiosos ou nervosos",
  "Animais exóticos",
  "Animais de fazenda",
  "Nenhuma das opções acima",
];
function StepPetNeeds({
  onNext,
  onBack,
}: {
  onNext: (data: { petNeeds: string[] }) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  function toggleNeed(need: string) {
    setSelected((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">
        Seu cuidador precisa de experiência específica?
      </h2>
      <p className="text-gray-600 mb-6">
        Muitos dos nossos cuidadores têm experiência e habilidades em cuidados
        com pets. Vamos te ajudar a encontrar o ideal.
      </p>
      <div className="flex flex-col gap-4 mb-8">
        {NEEDS.map((need) => (
          <button
            key={need}
            type="button"
            onClick={() => toggleNeed(need)}
            className={`border rounded-lg py-3 px-4 text-left font-medium transition-all
              ${
                selected.includes(need)
                  ? "bg-indigo-600 text-white border-indigo-600 shadow"
                  : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            {need}
          </button>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 font-semibold bg-white hover:bg-gray-50"
          onClick={onBack}
        >
          Voltar
        </button>
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold text-lg"
          onClick={() => onNext({ petNeeds: selected })}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

// etapa 4: mensagem informativa
function StepInfo({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Veterinários concordam. Pets são mais felizes em casa
      </h2>
      <p className="text-gray-600 mb-8">
        Pets são mais felizes em casa quando seus tutores viajam. Eles respondem
        melhor a um cuidador no próprio lar do que a novos ambientes, como
        hotéis para pets.
      </p>
      <div className="flex justify-between">
        <button
          className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 font-semibold bg-white hover:bg-gray-50"
          onClick={onBack}
        >
          Voltar
        </button>
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold text-lg"
          onClick={onNext}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

// etapa 5: quando vai viajar
function StepTravelDates({
  onNext,
  onBack,
}: {
  onNext: (data: { travelDates: string }) => void;
  onBack: () => void;
}) {
  const [option, setOption] = useState<string>("");
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Quando você vai viajar?</h2>
      <p className="text-gray-600 mb-6">
        De férias do ano que vem a viagens de última hora, encontre um cuidador
        para qualquer viagem.
      </p>
      <div className="flex justify-end mb-2">
        <button
          type="button"
          className="text-indigo-600 underline text-sm font-medium hover:text-indigo-800"
          onClick={() => onNext({ travelDates: "" })}
        >
          Pular
        </button>
      </div>
      <div className="flex flex-col gap-4 mb-8">
        <button
          className={`border rounded-lg py-3 px-4 text-left font-medium transition-all ${
            option === "know"
              ? "bg-indigo-600 text-white border-indigo-600 shadow"
              : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => {
            setOption("know");
            onNext({ travelDates: "know" });
          }}
        >
          Eu sei as datas
        </button>
        <button
          className={`border rounded-lg py-3 px-4 text-left font-medium transition-all ${
            option === "thinking"
              ? "bg-indigo-600 text-white border-indigo-600 shadow"
              : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => {
            setOption("thinking");
            onNext({ travelDates: "thinking" });
          }}
        >
          Ainda estou pensando
        </button>
      </div>
      <div className="flex justify-between">
        <button
          className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 font-semibold bg-white hover:bg-gray-50"
          onClick={onBack}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

// etapa 6: seleção de mês/ano
/**
 * gera uma lista de meses/anos a partir de um ponto inicial.
 * @param startMonth mês inicial (0-11)
 * @param startYear ano inicial
 * @param count quantidade de meses a gerar
 */
function getMonthYearList(
  startMonth: number,
  startYear: number,
  count: number
) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const result: { label: string; month: number; year: number }[] = [];
  let m = startMonth;
  let y = startYear;
  for (let i = 0; i < count; i++) {
    result.push({ label: `${months[m]} ${y}`, month: m, year: y });
    m++;
    if (m > 11) {
      m = 0;
      y++;
    }
  }
  return result;
}

interface StepSelectDatesProps {
  onNext: (data: { selectDates: string[] }) => void;
  onBack: () => void;
}

export function StepSelectDates({ onNext, onBack }: StepSelectDatesProps) {
  // estado para controlar o início da janela de meses
  const now = new Date();
  const [startMonth, setStartMonth] = useState(now.getMonth());
  const [startYear, setStartYear] = useState(now.getFullYear());
  const [selected, setSelected] = useState<string[]>([]);

  const monthsToShow = 6;
  const monthList = getMonthYearList(startMonth, startYear, monthsToShow);

  // navega para meses anteriores
  const handlePrev = useCallback(() => {
    let newMonth = startMonth - monthsToShow;
    let newYear = startYear;
    while (newMonth < 0) {
      newMonth += 12;
      newYear--;
    }
    setStartMonth(newMonth);
    setStartYear(newYear);
  }, [startMonth, startYear]);

  // navega para meses seguintes
  const handleNext = useCallback(() => {
    let newMonth = startMonth + monthsToShow;
    let newYear = startYear;
    while (newMonth > 11) {
      newMonth -= 12;
      newYear++;
    }
    setStartMonth(newMonth);
    setStartYear(newYear);
  }, [startMonth, startYear]);

  // impede voltar antes do mês atual
  const isAtCurrent =
    startMonth === now.getMonth() && startYear === now.getFullYear();

  function toggleMonth(label: string) {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Quando você vai viajar?</h2>
      <div className="flex justify-end mb-2">
        <button
          type="button"
          className="text-indigo-600 underline text-sm font-medium hover:text-indigo-800"
          onClick={() => onNext({ selectDates: [] })}
        >
          Pular
        </button>
      </div>
      <div className="flex items-center justify-center gap-2 mb-8 mt-6">
        <button
          type="button"
          onClick={handlePrev}
          className="p-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={isAtCurrent}
          aria-label="Meses anteriores"
        >
          <span aria-hidden="true">&#8592;</span>
        </button>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {monthList.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => toggleMonth(item.label)}
              className={`border rounded-lg py-4 px-6 flex flex-col items-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${
                  selected.includes(item.label)
                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                    : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                }
              `}
              aria-pressed={selected.includes(item.label)}
              aria-label={`Selecionar ${item.label}`}
            >
              <span className="text-lg font-semibold">
                {item.label.split(" ")[0]}
              </span>
              <span className="text-xs">{item.label.split(" ")[1]}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleNext}
          className="p-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Próximos meses"
        >
          <span aria-hidden="true">&#8594;</span>
        </button>
      </div>
      <div className="flex justify-between">
        <button
          className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 font-semibold bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={onBack}
        >
          Voltar
        </button>
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold text-lg disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={selected.length === 0}
          onClick={() => onNext({ selectDates: selected })}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

// etapa 7: duração da viagem
const OPTIONS = [
  "Alguns dias",
  "Uma ou duas semanas",
  "Cerca de um mês",
  "Mais de um mês",
];
function StepTripLength({
  onNext,
  onBack,
  selectedMonths,
}: {
  onNext: (data: { tripLength: string }) => void;
  onBack: () => void;
  selectedMonths?: string[];
}) {
  const [selected, setSelected] = useState<string>("");
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Quanto tempo dura sua viagem?</h2>
      {selectedMonths && selectedMonths.length > 0 && (
        <div className="mb-2 text-indigo-700 font-semibold">
          Meses selecionados: {selectedMonths.join(", ")}
        </div>
      )}
      <div className="flex justify-end mb-2">
        <button
          type="button"
          className="text-indigo-600 underline text-sm font-medium hover:text-indigo-800"
          onClick={() => onNext({ tripLength: "" })}
        >
          Pular
        </button>
      </div>
      <div className="flex flex-col gap-4 mb-8 mt-6">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setSelected(opt)}
            className={`border rounded-lg py-3 px-4 text-left font-medium transition-all
              ${
                selected === opt
                  ? "bg-indigo-600 text-white border-indigo-600 shadow"
                  : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 font-semibold bg-white hover:bg-gray-50"
          onClick={onBack}
        >
          Voltar
        </button>
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold text-lg disabled:opacity-50"
          disabled={!selected}
          onClick={() => onNext({ tripLength: selected })}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

// etapa 8: localização
function StepLocation({
  onFinish,
  onBack,
}: {
  onFinish: (location: string) => void;
  onBack: () => void;
}) {
  const [location, setLocation] = useState("");
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Onde você está no mundo?</h2>
      <p className="text-gray-600 mb-6">
        Só vamos compartilhar sua localização exata com cuidadores confirmados.
      </p>
      <input
        type="text"
        placeholder="Continente, país, cidade ou bairro"
        className="w-full border border-gray-300 rounded-md p-3 mb-8 text-lg"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <div className="flex justify-between">
        <button
          className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 font-semibold bg-white hover:bg-gray-50"
          onClick={onBack}
        >
          Voltar
        </button>
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold text-lg disabled:opacity-50"
          disabled={!location}
          onClick={() => onFinish(location)}
        >
          CONCLUIR
        </button>
      </div>
    </div>
  );
}

const steps = [
  "petTypes",
  "petCount",
  "petNeeds",
  "info",
  "travelDates",
  "selectDates",
  "tripLength",
  "location",
];

export default function TutorWizard() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    petTypes: [],
    petCount: {},
    petNeeds: [],
    travelDates: "",
    selectDates: [],
    tripLength: "",
    location: "",
  });
  const router = useRouter();
  const { user } = useUser();

  function next(data: any) {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  }
  function back() {
    setStep((prev) => Math.max(0, prev - 1));
  }
  async function finish(location: string) {
    setFormData((prev) => ({ ...prev, location }));

    if (!user) {
      alert("Usuário não autenticado!");
      return;
    }

    // garante que o profile existe
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          email: user.email,
          role: "tutor",
        },
      ]);
      if (profileError) {
        alert("Erro ao criar perfil: " + profileError.message);
        return;
      }
    }

    // monta o objeto para pets_profile (apenas tipos, quantidade e localização)
    const wizardData = {
      user_id: user.id,
      pet_types: JSON.stringify(formData.petTypes),
      pet_count: JSON.stringify(formData.petCount),
      location: location,
      created_at: new Date().toISOString(),
    };

    // salva no Supabase
    const { error } = await supabase.from("pets_profile").insert([wizardData]);

    if (error) {
      alert("Erro ao salvar dados do wizard: " + error.message);
      return;
    }

    router.push("/dashboard/tutor");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-500">
            Passo {step + 1} de {steps.length}
          </span>
        </div>
        {step === 0 && <StepPetTypes onNext={next} />}
        {step === 1 && (
          <StepPetCount
            petTypes={formData.petTypes as string[]}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 2 && <StepPetNeeds onNext={next} onBack={back} />}
        {step === 3 && (
          <StepInfo onNext={() => setStep(step + 1)} onBack={back} />
        )}
        {step === 4 && <StepTravelDates onNext={next} onBack={back} />}
        {step === 5 && <StepSelectDates onNext={next} onBack={back} />}
        {step === 6 && (
          <StepTripLength
            onNext={next}
            onBack={back}
            selectedMonths={formData.selectDates as string[]}
          />
        )}
        {step === 7 && <StepLocation onFinish={finish} onBack={back} />}
      </div>
    </div>
  );
}
