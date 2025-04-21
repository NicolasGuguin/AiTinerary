import { generateTripPipeline } from "../pipeline/pipelineManager.ts";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// __dirname polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ FAUX FORM DATA TEST
const formData = {
  destination: "Japon",
  startDate: "2025-10-15",
  duration: "10",
  travelers: 2,
  budget: 2000,
  comfort: "moyen",
  rhythm: "modéré",
  style: ["culture", "nature"],
  transportPreferences: ["train"],
  flexibleDates: false,
  nightlife: "indifférent",
  circularTrip: false,
  avoid: "",
  purpose: "",
  roomType: "private",
  noLodgingNeeded: false,
  rooms: "1"
};

async function main() {
  try {
    console.log("🚀 Lancement pipeline...");
    const result = await generateTripPipeline(formData as any);
    const outputPath = path.join(__dirname, "../data/trip-raw.json");
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");
    console.log("✅ trip-raw.json généré !");
  } catch (error) {
    console.error("❌ Erreur pipeline !");
    console.dir(error, { depth: null });
  }
}

main();
