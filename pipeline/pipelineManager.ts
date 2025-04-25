import { FormData, TripData, Trajet, Activity, Step, TripChunk, Context } from "../data/types.ts";
import { withRetry } from "../utils/withRetry.ts";
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
  update(5, "context");

  // Fonction interne pour générer un contexte propre
  async function generateValidContext(formData: FormData): Promise<Context> {
    let tries = 3;
    while (tries > 0) {
      const context = await withRetry(() => getContext(formData));
      console.log("📅 Contexte généré :", context);
  
      if (checkNoDuplicateTrajets(context.chunks)) {
        return context; // Contexte OK directement
      }
  
      console.warn("⚡ Trajets dupliqués détectés. Tentative de correction de l'ordre des chunks...");
  
      // Tentative de correction
      try {
        const fixedChunks = tryFixChunkOrder(context.chunks);
        const fixedContext = { ...context, chunks: fixedChunks };
  
        if (tryFixChunkOrder(fixedChunks)) {
          console.log("✅ Correction de l'ordre réussie !");
          return fixedContext;
        } else {
          console.warn("❌ Correction insuffisante. Reprompt nécessaire.");
        }
      } catch (error) {
        console.error("❌ Correction échouée :", error);
      }
  
      tries--;
    }
  
    throw new Error("Échec de la génération d'un contexte cohérent après plusieurs tentatives.");
  }
  
  // 🎯 Nouvelle génération du contexte
  const context = await generateValidContext(formData);
  


// 2. Génération par chunk : steps + activités
update(15, "steps");
const enrichedChunks = [];
const totalChunks = context.chunks.length;

let currentDay = 1; // compteur global

for (let idx = 0; idx < totalChunks; idx++) {
  const chunk = context.chunks[idx];

  let steps = await withRetry(() => generateStepsForChunk(chunk, context, formData));
  
  // 🛠️ ➔ Ajustement des days globaux
  steps = steps.map(step => ({
    ...step,
    day: currentDay++,
  }));

  const activities = await withRetry(() => generateActivitiesForChunk(steps, chunk, context));
  
  enrichedChunks.push({ ...chunk, steps, activities });

  const progress = 15 + Math.floor((idx + 1) / totalChunks * 60);
  update(progress, "steps");
}

  

  const allSteps = enrichedChunks.flatMap(c => c.steps);
  let allActivities = enrichedChunks.flatMap(c => c.activities);

  // 🛠 Contrôle de cohérence des activities
  allActivities = fixActivitiesIds(allActivities, allSteps);
  

// 3. Trajets inter-chunks (découpés en plusieurs parties si besoin)
update(75, "trajets");
const trajets = await withRetry(() =>
  generateInterChunkTrajets(
    allSteps,
    context.cities,
    formData.transportPreferences,
    formData.maxTravelDuration
  )
);


  // 4. Météo
  update(80, "meteo");
  const meteo = await withRetry(() => getWeather(context.cities, context.startDate));

  // 5. Vols
  update(85, "flights");
  const flights = await withRetry(() => getFlights(context.countries, context.startDate, formData));

  // 6. Budget
  update(90, "budget");
  const budget = await withRetry(() => estimateBudget(formData.budget, formData, allSteps, context.cities, trajets, flights));

  // 7. Tips
  update(95, "tips");
  const tips = await withRetry(() => generateTips(context.countries));

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


function fixActivitiesIds(allActivities: Activity[], steps: Step[]): Activity[] {
  const seen = new Set<string>();

  return allActivities.map(activity => {
    if (seen.has(activity.id)) {
      // On génère un nouvel id : {cityId}-{randomNumber}
      const step = steps.find(s => s.day === activity.stepDay);
      const cityId = step?.cityId || "unknown";
      const randomSuffix = Math.floor(Math.random() * 10000); // entre 0 et 9999

      const newId = `${cityId}-${randomSuffix}`;
      console.warn(`⚡ Doublon détecté pour l'activité "${activity.title}", nouvel id assigné : ${newId}`);
      
      seen.add(newId);
      return { ...activity, id: newId };
    } else {
      seen.add(activity.id);
      return activity;
    }
  });
}

function tryFixChunkOrder(chunks: TripChunk[]): TripChunk[] {
  let fixedChunks = [...chunks];
  let maxTries = fixedChunks.length * 2; // on limite pour éviter boucle infinie

  while (maxTries > 0) {
    const citySequence: string[] = [];
    let hasProblem = false;
    const seenPairs = new Set<string>();

    for (const chunk of fixedChunks) {
      for (const city of chunk.cityIds) {
        citySequence.push(city);
      }
    }

    for (let i = 0; i < citySequence.length - 1; i++) {
      const pair = `${citySequence[i]}->${citySequence[i + 1]}`;
      if (seenPairs.has(pair)) {
        // ➔ DUPLICATE
        hasProblem = true;

        // Trouver quel chunk cause le problème
        const problemCity = citySequence[i];
        const chunkIndex = fixedChunks.findIndex(c => c.cityIds.includes(problemCity));
        if (chunkIndex >= 0 && chunkIndex < fixedChunks.length - 1) {
          // ➔ Tenter d'échanger avec le suivant
          const temp = fixedChunks[chunkIndex];
          fixedChunks[chunkIndex] = fixedChunks[chunkIndex + 1];
          fixedChunks[chunkIndex + 1] = temp;
        }

        break; // recommencer la boucle
      }
      seenPairs.add(pair);
    }

    if (!hasProblem) {
      return fixedChunks;
    }

    maxTries--;
  }

  // Si pas réussi après X essais
  throw new Error("Impossible de corriger automatiquement l'ordre des chunks. Besoin de régénérer.");
}

function checkNoDuplicateTrajets(chunks: TripChunk[]): boolean {
  const trajectoryPairs = new Set<string>();

  // Construire la séquence complète des trajets
  const citySequence: string[] = [];
  for (const chunk of chunks) {
    citySequence.push(...chunk.cityIds);
  }

  for (let i = 0; i < citySequence.length - 1; i++) {
    const from = citySequence[i];
    const to = citySequence[i + 1];
    const pair = `${from}->${to}`;

    if (trajectoryPairs.has(pair)) {
      console.warn(`🔴 Trajet répété détecté : ${pair}`);
      return false;
    }

    trajectoryPairs.add(pair);
  }

  return true;
}

