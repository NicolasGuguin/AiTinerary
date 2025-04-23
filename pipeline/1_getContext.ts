import { FormData, Context, City, TripChunk } from "../data/types.ts";

export async function getContext(formData: FormData): Promise<Context> {
  const res = await fetch("/api/get-context", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Erreur API");

  const parsed = await res.json();

  const context: Context = {
    countries: parsed.countries,
    cities: parsed.cities,
    chunks: parsed.chunks,
    startDate: formData.startDate,
    duration: parseInt(formData.duration),
  };

  return context;
}
