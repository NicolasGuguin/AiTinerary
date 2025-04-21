import { useState } from "react";
import BasicInfo from "./BasicInfo";
import BudgetComfort from "./BudgetComfort";
import StyleTransport from "./StyleTransport";
import ExtraOptions from "./ExtraOptions";
import { useNavigate } from "react-router-dom";
import { stageLabels } from "../../constants";
import { generateTripPipeline } from "../../pipeline/pipelineManager";

const steps = [
  { label: "Infos de base", component: BasicInfo },
  { label: "Budget & confort", component: BudgetComfort },
  { label: "Style & transports", component: StyleTransport },
  { label: "Préférences avancées", component: ExtraOptions }
];

export default function Questionnaire() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");

  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    duration: "",
    travelers: 1,
    budget: "",
    comfort: "moyen",
    rhythm: "modéré",
    style: [],
    transportPreferences: [],
    flexibleDates: false,
    nightlife: "indifférent",
    circularTrip: false,
    avoid: "",
    purpose: "",
    roomType: "private",
    noLodgingNeeded: false,
    rooms: "",
  });

  const StepComponent = steps[step].component;

  const handleNext = () => {
    if (step < steps.length - 1 && !loading) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 0 && !loading) setStep(step - 1);
  };


  const delayedProgress = (value, label) => {
    setCurrentStage(stageLabels[label]);
    setProgress((prev) => Math.max(prev + 8, value));
  };
  
  
  

  const startGeneration = async () => {
    console.log("🟡 Validation déclenchée !");
    setLoading(true);
    setProgress(5);
    setCurrentStage("Initialisation…");

    try {
      const result = await generateTripPipeline(formData, delayedProgress);
      setProgress(100);
      setCurrentStage("✅ Finalisation…");

      setTimeout(() => {
        navigate("/results", { state: result });
      }, 500);
    } catch (error) {
      console.error("🔴 Erreur lors de la génération du voyage :", error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-card p-8 rounded-2xl shadow-xl space-y-8 transition-all duration-300 max-w-2xl mx-auto min-h-[500px]">
      {/* Barre de progression */}
      <div className="w-full bg-background h-2 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-500 ease-out"
          style={{
            width: loading
              ? `${progress}%`
              : `${((step + 1) / steps.length) * 100}%`,
          }}
        />
      </div>

      {/* Titre ou loading */}
      <h2 className="text-3xl font-bold text-primary">
        {loading ? "Génération en cours..." : steps[step].label}
      </h2>

      {/* Corps du formulaire ou loading */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-6 text-white mt-12">
            {/* Spinner */}
            <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>

            {/* Texte de progression */}
            <div className="text-lg font-semibold">{currentStage}</div>

            {/* Barre */}
            <div className="w-full bg-background h-2 rounded-full overflow-hidden max-w-md">
              <div
                className="bg-primary h-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-secondary font-medium">{progress}%</div>
            <div className="text-sm text-gray-400 text-center max-w-sm">
              Cela peut prendre jusqu’à 3 minutes. Merci de patienter pendant que nous construisons votre voyage idéal.
            </div>
          </div>
        ) : (
          <StepComponent formData={formData} setFormData={setFormData} />
        )}
      </div>

      {/* Navigation */}
      {!loading && (
        <div className="flex justify-between pt-6 gap-4 flex-wrap sm:flex-nowrap">
          {step > 0 ? (
            <button
              onClick={handlePrevious}
              className="min-w-[140px] px-6 py-2 rounded-xl bg-background border border-secondary text-secondary hover:bg-secondary hover:text-black transition-all text-center"
            >
              ⬅ Précédent
            </button>
          ) : (
            <div className="min-w-[140px] invisible">⬅</div>
          )}

          {step < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="min-w-[140px] px-6 py-2 rounded-xl bg-primary text-white hover:bg-secondary hover:text-black transition-all text-center"
            >
              Suivant ➡
            </button>
          ) : (
            <button
              className="min-w-[140px] px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-500 transition-all text-center"
              onClick={startGeneration}
            >
              Valider
            </button>
          )}
        </div>
      )}
    </div>
  );
}
