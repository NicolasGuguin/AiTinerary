export const stageLabels = {
    context: "Analyse du contexte...",
    steps: "Création de l'itinéraire...",
    trajets: "Planification des trajets...",
    activities: "Sélection des activités...",
    meteo: "Estimation de la météo...",
    flights: "Recherche des vols...",
    budget: "Répartition du budget...",
    tips: "Conseils de voyage..."
  };
  
  export type StageKey = keyof typeof stageLabels;
  