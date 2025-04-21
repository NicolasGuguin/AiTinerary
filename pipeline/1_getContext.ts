import { FormData, City } from "../data/types.ts";

type Context = {
  countries: string[];
  startDate: string;
  duration: number;
  cities: City[];
};

export async function getContext(formData: FormData): Promise<Context> {
  const res = await fetch("/api/get-context", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Erreur API");

  const parsed = await res.json();

  return {
    countries: parsed.countries,
    cities: parsed.cities,
    startDate: formData.startDate,
    duration: parseInt(formData.duration),
  };
}

