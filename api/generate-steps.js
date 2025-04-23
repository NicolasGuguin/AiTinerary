// /api/generate-steps.js
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { context, formData, chunk } = req.body;

  const prompt = `
  Tu es un expert en organisation de voyages sur mesure. Ta mission est de construire un itinéraire journalier **uniquement pour le chunk suivant**, en respectant strictement les préférences du voyageur.
  
  ---
  
  ### 🧱 Détails du chunk :
  - Titre : ${chunk.title}
  - Durée : ${chunk.duration} jours
  - Villes concernées : ${chunk.cityIds.join(", ")}
  
  ---
  
  ### 🎯 Objectif :
  Générer une liste d'étapes journalières avec :
  - Le jour (day, relatif au chunk, entier commençant à 1)
  - L'identifiant de la ville (cityId)
  - Une liste de 2 activités par jour(texte uniquement)
  
  ---
  
  ### 🧾 Infos générales sur le voyage :
  - Départ global : ${context.startDate}
  - Durée totale : ${context.duration} jours
  - Style : ${formData.style.join(", ") || "non précisé"}
  - Rythme : ${formData.rhythm}
  - Budget : ${formData.budget} €
  - Confort : ${formData.comfort}
  - Transports : ${formData.transportPreferences.join(", ") || "non précisé"}
  - Max durée trajet : ${formData.maxTravelDuration || "illimité"}
  - Vie nocturne : ${formData.nightlife}
  - À éviter : ${formData.avoid || "aucune"}
  - Objectif : ${formData.purpose || "non précisé"}
  
  ---
  
  ### 📌 Contraintes :
  1. Génère exactement ${chunk.duration} objets (un pour chaque jour du chunk).
  2. Ne propose que des cityId présents dans ${chunk.cityIds.join(", ")}.
  3. L’ordre des villes doit être fluide géographiquement.
  4. Respecte le style, budget, rythme, etc.
  5. ⚠️ Respecte absolument la règle du nombre d’activités par jour.
  
  ---
  
  ### 📎 Format de réponse :
  [
    {
      "day": 1,
      "cityId": "kyoto",
      "activities": [
        "Balade au marché Nishiki",
        "Visite du sanctuaire Fushimi Inari"
      ]
    },
    ...
  ]
  
  ⚠️ Répond uniquement avec ce JSON, sans texte autour.
  `;
  
  
  
  

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
  
    const raw = completion.choices[0].message.content;
    console.log("🟢 Réponse OpenAI:", raw); // 👉 log pour debug
  
    let parsed;
    try {
      parsed = JSON.parse(raw || "[]");
    } catch (e) {
      console.error("🔴 JSON.parse FAILED:", e);
      return res.status(500).json({ error: "Erreur de parsing JSON dans generate-activities" });
    }
  
    res.status(200).json(parsed);
  } catch (error) {
    console.error("Erreur generate-activities:", error);
    res.status(500).json({ error: error.message });
  } 
};
