import { Weather, City } from "../data/types";

export async function getWeather(
  cities: City[],
  startDate: string
): Promise<Weather[]> {
  const res = await fetch("/api/get-weather", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cities, startDate }),
  });

  if (!res.ok) throw new Error("Erreur getWeather");

  const weather = await res.json();
  console.log("☀️ Météo estimée :", weather);
  return weather;
}
