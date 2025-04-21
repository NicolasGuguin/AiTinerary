import { Flights, FormData } from "../data/types";

export async function getFlights(
  countries: string[],
  startDate: string,
  formData: FormData
): Promise<Flights> {
  const res = await fetch("/api/get-flights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      countries,
      startDate,
      duration: formData.duration,
      comfort: formData.comfort,
      flexibleDates: formData.flexibleDates,
    }),
  });

  if (!res.ok) throw new Error("Erreur getFlights");

  const flights = await res.json();
  console.log("✈️ Vols générés :", flights);
  return flights;
}
