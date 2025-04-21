import { Tip } from "../data/types";

export async function generateTips(countries: string[]): Promise<Tip[]> {
  const res = await fetch("/api/generate-tips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ countries }),
  });

  if (!res.ok) throw new Error("Erreur generateTips");

  const tips = await res.json();
  console.log("📌 Conseils pratiques :", tips);
  return tips;
}
