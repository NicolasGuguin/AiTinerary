// /api/generate-steps.js
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { context, formData } = req.body;

  const prompt = `
  Tu es un expert en organisation de voyages sur mesure. Ta mission est de construire un itinéraire journalier intelligent, en respectant strictement les préférences du voyageur.
  
  ### 🎯 Objectif :
  Générer une liste d'étapes journalières avec :
  - Le jour (day, entier commençant à 1)
  - L'identifiant de la ville (cityId, tel que fourni, **obligatoirement identique** à ceux listés ci-dessous)
  - Une liste d'activités (voir règle ci-dessous)
  
  ---
  
  📊 Nombre d’activités par jour :  
  ⚠️ Cette règle est OBLIGATOIRE :  
  - Moins de 6 jours → 3 activités par jour  
  - De 6 à 15 jours → 2 activités par jour  
  - 15 jours ou plus → 1 seule activité par jour  
  
  Tu dois respecter cette règle à la lettre.  
  Chaque journée doit contenir **EXACTEMENT** le bon nombre d'activités selon la durée totale (${context.duration} jours).
  
  ⚠️ Ne contourne jamais cette règle, même si cela te semble pertinent.
  
  ---
  
  ### 🧾 Détails du voyage :
  - Destination : ${formData.destination}
  - Départ : ${context.startDate}
  - Durée : ${context.duration} jours
  - Voyageurs : ${formData.travelers}
  - Budget : ${formData.budget} €
  - Confort : ${formData.comfort}
  - Rythme : ${formData.rhythm}
  - Style : ${formData.style.join(", ") || "non précisé"}
  - Transports : ${formData.transportPreferences.join(", ") || "non précisé"}
  - Max transport par étape : ${formData.maxTravelDuration || "illimité"}
  - Vie nocturne : ${formData.nightlife}
  - Type de voyage : ${formData.circularTrip ? "circulaire" : "aller simple"}
  - À éviter : ${formData.avoid || "aucune"}
  - Objectif : ${formData.purpose || "non précisé"}
  
  ### 📍 Villes disponibles :
  ${context.cities.map((c) => `- ${c.name} (id: "${c.id}", lat: ${c.lat}, lng: ${c.lng})`).join("\n")}
  
  ⚠️ Chaque cityId doit correspondre **exactement** à ceux listés ci-dessus (kebab-case, sans majuscules ni accents).
  
  ---
  
  ### 📌 Contraintes supplémentaires :
  
  1. Génère **exactement ${context.duration} étapes** (une par jour).
  2. L’enchaînement des villes doit suivre une **logique géographique fluide**.
     - Le voyage doit progresser naturellement dans l’espace, sans zigzags ni retours inutiles.
     - ⚠️ Interdiction stricte de faire "ville A → ville B → ville A → ville B"
     - Exemple à éviter : "Paris → Marseille → Paris → Nice"
  3. La dernière ville doit être identique ou proche de la première uniquement si le voyage est circulaire.
  4. Le style de voyage (nature, festif, culturel, etc.) doit être respecté dans le choix des activités.
  5. Pas d’activités coûteuses si le budget est faible.
  6. Pas de nightlife si "non" ou "indifférent".
  7. Tu dois respecter strictement le **nombre exact d’activités par jour** selon la règle définie plus haut.
  
  ---
  
  ### 🧾 Format de réponse attendu :
  [
    {
      "day": 1,
      "cityId": "hanoi",
      "activities": [
        "Découverte du vieux quartier",
        "Dégustation de street food vietnamienne"
      ]
    },
    ...
  ]
  
  ⚠️ Réponds uniquement avec le JSON pur, sans texte explicatif.
  ⚠️ Génère exactement ${context.duration} objets (un pour chaque jour du voyage).
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
