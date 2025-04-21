import { Step, Activity } from "../data/types";

export async function generateActivities(steps: Step[]): Promise<Activity[]> {
  const res = await fetch("/api/generate-activities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ steps }),
  });

  if (!res.ok) throw new Error("Erreur generateActivities");

  const activities = await res.json();
  console.log("🎯 Activités enrichies :", activities);
  return activities;
}
