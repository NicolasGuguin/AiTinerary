import { FormData, TripData } from "../data/types.ts";
import { getContext } from "./1_getContext.ts";
import { generateSteps } from "./2_generateSteps.ts";
import { generateTrajets } from "./3_generateTrajets.ts";
import { generateActivities } from "./4_generateActivities.ts";
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
  
  update(10, "context");
  const context = await getContext(formData);
  console.log("📅 Contexte généré :", context);
  
  update(25, "steps");
  const steps = await generateSteps(context, formData);

  update(40, "trajets");
  const trajets = await generateTrajets(steps, context.cities, formData.transportPreferences, formData.maxTravelDuration);

  update(55, "activities");
  const activities = await generateActivities(steps);

  update(65, "meteo");
  const meteo = await getWeather(context.cities, context.startDate);

  update(80, "flights");
  const flights = await getFlights(context.countries, context.startDate, formData);

  update(90, "budget");
  const budget = await estimateBudget(formData.budget, formData, steps, context.cities, trajets, flights);

  update(95, "tips");
  const tips = await generateTips(context.countries);

  return {
    countries: context.countries,
    startDate: context.startDate,
    totalBudget: formData.budget,
    cities: context.cities,
    steps,
    activities,
    trajets,
    meteoByCity: meteo,
    budgetBreakdown: budget,
    tips,
    flights,
  };
}


