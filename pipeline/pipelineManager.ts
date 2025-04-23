import { FormData, TripData } from "../data/types.ts";
import { getContext } from "./1_getContext.ts";
import { generateStepsForChunk } from "./2_generateSteps.ts";
import { generateActivitiesForChunk } from "./4_generateActivities.ts";
import { generateInterChunkTrajets } from "./3_generateTrajets.ts";
import { getWeather } from "./5_getWeather.ts";
import { getFlights } from "./6_getFlights.ts";
import { estimateBudget } from "./7_estimateBudget.ts";
import { generateTips } from "./8_generateTips.ts";
import { StageKey } from "../constants";

export async function generateTripPipeline(
  formData: FormData,
  setProgressFn?: (n: number, label?: StageKey) => void
): Promise<TripData> {
  const update = (v: number, l: StageKey) => setProgressFn?.(v, l);

  // 1. Contexte global : villes, pays, structure des chunks
  update(10, "context");
  const context = await getContext(formData);
  console.log("📅 Contexte généré :", context);

  // 2. Génération par chunk : steps + activités
  update(35, "steps");
  const enrichedChunks = [];

  for (const chunk of context.chunks) {
    const steps = await generateStepsForChunk(chunk, context, formData);
    const activities = await generateActivitiesForChunk(steps, chunk, context);
    enrichedChunks.push({ ...chunk, steps, activities });
  }

  const allSteps = enrichedChunks.flatMap(c => c.steps);
  const allActivities = enrichedChunks.flatMap(c => c.activities);

// 3. Trajets inter-chunks (découpés en plusieurs parties si besoin)
update(55, "trajets");
const trajets: Trajet[] = [];

const joursTotaux = allSteps.length;
const chunkSize = 7;

for (let i = 0; i < joursTotaux; i += chunkSize) {
  const chunkSteps = allSteps.filter(step => step.day > i && step.day <= i + chunkSize);
  const partTrajets = await generateInterChunkTrajets(chunkSteps, context.cities, formData.transportPreferences, formData.maxTravelDuration);
  trajets.push(...partTrajets);
}


  // 4. Météo
  update(80, "meteo");
  const meteo = await getWeather(context.cities, context.startDate);

  // 5. Vols
  update(85, "flights");
  const flights = await getFlights(context.countries, context.startDate, formData);

  // 6. Budget
  update(90, "budget");
  const budget = await estimateBudget(formData.budget, formData, allSteps, context.cities, trajets, flights);

  // 7. Tips
  update(95, "tips");
  const tips = await generateTips(context.countries);

  // 8. Assemblage final
  return {
    countries: context.countries,
    startDate: context.startDate,
    totalBudget: formData.budget,
    cities: context.cities,
    steps: allSteps,
    activities: allActivities,
    trajets,
    meteoByCity: meteo,
    budgetBreakdown: budget,
    tips,
    flights,
  };
}
