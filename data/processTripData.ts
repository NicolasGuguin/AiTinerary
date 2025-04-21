import { TripData } from "../data/types";

export function processTripData(tripRaw: TripData): TripData & {
  country: string;
  durationDays: number;
  transportPerDay: number[];
  meteoData: any;
  budgetData: any;
} {
  const tripData = { ...tripRaw } as any;

  // 1. Pays principal
  tripData.country = tripRaw.countries[0] || "Inconnu";

  // 2. Durée
  tripData.durationDays = tripRaw.steps.length;

  // 3. Ajout du budget "Transport"
  const transportTotal = tripRaw.trajets.reduce((sum, t) => sum + t.price, 0);
  tripData.budgetBreakdown = [
    {
      label: "Transport",
      value: transportTotal,
      color: "#3B82F6",
      icon: "MdTrain"
    },
    ...tripRaw.budgetBreakdown
  ];

  // 4. Transport par jour
  function parseDurationToMinutes(duration: string) {
    const [h, m] = duration.split("h");
    const hours = parseInt(h) || 0;
    const minutes = parseInt(m?.replace("min", "") || "0") || 0;
    return hours * 60 + minutes;
  }
  

  const transportPerDay = Array(tripRaw.steps.length).fill(0);
  tripRaw.trajets.forEach((t) => {
    const mins = parseDurationToMinutes(t.duration);
    const dayIndex = t.day - 1;
    if (transportPerDay[dayIndex] !== undefined) {
      transportPerDay[dayIndex] += mins;
    }
  });
  tripData.transportPerDay = transportPerDay;

  // 5. Météo par ville
  tripData.meteoByCity = {};
  tripData.meteoData = (tripRaw.meteoByCity || []).map((entry) => {
    tripData.meteoByCity[entry.cityId] = {
      temp: entry.temp,
      pluie: entry.pluie,
      soleil: entry.soleil,
      humidite: entry.humidite,
      altitude: entry.altitude
    };
    return {
      ville: entry.cityId,
      ...entry
    };
  });

  // 6. Aliases rétrocompatibles
  tripData.budgetData = tripData.budgetBreakdown;

  return tripData;
}
