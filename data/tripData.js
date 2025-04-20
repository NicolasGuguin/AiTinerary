import tripRaw from "./trip-raw.json";

// 1. Base clonée
const tripData = { ...tripRaw };

// 2. Ajout du pays principal (singulier pour rétrocompatibilité)
tripData.country = tripRaw.countries[0] || "Inconnu";

// 3. Calcul de la durée en jours
tripData.durationDays = tripRaw.steps.length;

// 4. Ajout du budget "Transport"
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

// 5. Calcul transport par jour
function parseDurationToMinutes(duration) {
  const [h, m] = duration.split("h");
  return parseInt(h) * 60 + parseInt(m);
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

// 6. Conversion meteoByCity en objet indexé (clé = cityId)
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



// 7. Alias rétrocompatibles
tripData.budgetData = tripData.budgetBreakdown;
tripData.meteoData = tripData.meteoByCity;

export default tripData;
