import { Step, Context, FormData } from "../data/types";

export async function generateSteps(context: Context, formData: FormData): Promise<Step[]> {
  const res = await fetch("/api/generate-steps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context, formData }),
  });

  if (!res.ok) throw new Error("Erreur generateSteps");

  const steps = await res.json();
  console.log("📅 Étapes générées :", steps);
  return steps;
}
