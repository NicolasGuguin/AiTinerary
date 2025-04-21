import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Questionnaire from "../components/Questionnaire/Questionnaire";

export default function CreateTrip() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null; // Évite le rendu pendant la redirection

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 md:px-8">
      <h2 className="text-3xl font-bold mb-6 text-primary">Créer un nouveau voyage</h2>
      <Questionnaire />
    </div>
  );
}
