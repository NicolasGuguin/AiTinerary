import { Step, City, Trajet, Flights, BudgetBreakdown, FormData } from "../data/types";

export async function estimateBudget(
  budget: number,
  formData: FormData,
  steps: Step[],
  cities: City[],
  trajets: Trajet[],
  flights: Flights
): Promise<BudgetBreakdown[]> {
  const res = await fetch("/api/estimate-budget", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      totalBudget: budget,
      formData,
      steps,
      cities,
      trajets,
      flights,
    }),
  });

  if (!res.ok) throw new Error("Erreur estimateBudget");

  const data = await res.json();
  console.log("💰 Budget estimé (détaillé) :", data);
  return data;
}

