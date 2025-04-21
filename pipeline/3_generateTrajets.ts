import { Step, Trajet, City } from "../data/types";

export async function generateTrajets(
  steps: Step[],
  cities: City[],
  transportPreferences: string[]
): Promise<Trajet[]> {
  const res = await fetch("/api/generate-trajets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ steps, cities, transportPreferences }),
  });

  if (!res.ok) throw new Error("Erreur generateTrajets");

  const trajets = await res.json();
  console.log("🛣️ Trajets générés :", trajets);
  return trajets;
}
