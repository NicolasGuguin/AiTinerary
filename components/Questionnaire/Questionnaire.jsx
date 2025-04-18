import { useState } from "react";
import BasicInfo from "./BasicInfo";
import BudgetComfort from "./BudgetComfort";
import StyleTransport from "./StyleTransport";
import ExtraOptions from "./ExtraOptions";
import { useNavigate } from "react-router-dom";

const steps = [
  { label: "Infos de base", component: BasicInfo },
  { label: "Budget & confort", component: BudgetComfort },
  { label: "Style & transports", component: StyleTransport },
  { label: "Préférences avancées", component: ExtraOptions }
];



export default function Questionnaire() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
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
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="bg-card p-8 rounded-2xl shadow-xl space-y-8 transition-all duration-300 max-w-2xl mx-auto">
      {/* Progression */}
      <div className="w-full bg-background h-2 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-500"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}

        />
      </div>

      {/* Étape active */}
      <h2 className="text-3xl font-bold text-primary">{steps[step].label}</h2>

      {/* Composant d'étape */}
      <div className="space-y-6">
        <StepComponent formData={formData} setFormData={setFormData} />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        {step > 0 ? (
          <button
            onClick={handlePrevious}
            className="px-6 py-2 rounded-xl bg-background border border-secondary text-secondary hover:bg-secondary hover:text-black transition-all"
          >
            ⬅ Précédent
          </button>
        ) : <div></div>}

        {step < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-xl bg-primary text-white hover:bg-secondary hover:text-black transition-all"
          >
            Suivant ➡
          </button>
        ) : (
          <button
            className="px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-500 transition-all"
            onClick={() => {
              console.log("Form submitted:", formData);
              navigate("/results"); // redirection
            }}
          >
           Valider
          </button>
        )}
      </div>
    </div>
  );
}