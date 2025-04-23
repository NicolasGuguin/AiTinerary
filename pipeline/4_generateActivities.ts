import { Step, Activity, Context, TripChunk } from "../data/types";

export async function generateActivitiesForChunk(
  steps: Step[],
  chunk: TripChunk,
  context: Context
): Promise<Activity[]> {
  const res = await fetch("/api/generate-activities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ steps, chunk, context }),
  });

  if (!res.ok) throw new Error("Erreur generateActivities");

  const activities = await res.json();
  console.log("🎯 Activités générées :", activities);
  return activities;
}
