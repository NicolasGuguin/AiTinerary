// /api/generate-steps.js
require("dotenv").config();
const OpenAI = require("openai");
const { VercelRequest, VercelResponse } = require("@vercel/node");

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
  - L'identifiant de la ville (cityId, tel que fourni)
  - 📊 Nombre d’activités par jour :
- Si le voyage dure **moins de 6 jours** → 3 activités par jour
- Si le voyage dure **entre 6 et 15 jours** → 2 activités par jour
- Si le voyage dure **15 jours ou plus** → 1 seule activité par jour

Respecte strictement cette règle. Ne propose jamais plus d’activités que ce qui est prévu selon la durée.
  
  ### 🧾 Données du voyage :
  - 📍 Destination : ${formData.destination}
  - 📅 Date de départ : ${context.startDate}
  - ⏱️ Durée : ${context.duration} jours
  - 🧑 Nombre de voyageurs : ${formData.travelers}
  - 💸 Budget global : ${formData.budget} €
  - 😴 Confort : ${formData.comfort}
  - 🚶‍♂️ Rythme : ${formData.rhythm} (lent, modéré, rapide)
  - 🧭 Style recherché : ${formData.style.join(", ") || "non précisé"}
  - 🚗 Transports disponibles : ${formData.transportPreferences.join(", ") || "non précisé"}
  - 🚗 Temps de transport maximum entre chaque étape : ${formData.maxTravelDuration || "illimité"}
  - 🌃 Vie nocturne : ${formData.nightlife}
  - 🔁 Type de voyage : ${formData.circularTrip ? "circulaire" : "aller simple"}
  - 🚫 Choses à éviter : ${formData.avoid || "aucune"}
  - 🎯 Objectif principal : ${formData.purpose || "non précisé"}
  
  
  ### 🗺️ Liste des villes disponibles :
  ${context.cities.map((c, i) => `- ${c.name} (id: "${c.id}", lat: ${c.lat}, lng: ${c.lng})`).join("\n")}
  
  ### 📌 Contraintes à respecter :
  1. **Le rythme doit influencer le nombre de changements de ville** :
     - Chill → 1 villes différents par semaine
     - Modéré → 2  villes différentes par semaine
     - Intensif → jusqu'à 3-4 villes différentes par semaine
  2. **Évite les longs trajets si le transport est limité** (ex : à pied ou à vélo)
  3. **Distribue les jours de façon équilibrée** selon les distances et le style
  4. **Respecte le style de voyage** (ex : nature → randonnées, culturel → musées, festif → bars)
  5. **Pas de nightlife si "Non" ou "indifférent"**
  6. Si le voyage est **circulaire**, la dernière ville doit être identique ou proche de la première
  7. **Pas d'activités coûteuses si le budget est faible**
  8. Chaque journée doit être **réaliste et agréable** selon la durée du séjour.
  
  ### 🧾 Format de réponse attendu (strictement) :
  [
    {
      "day": 1,
      "cityId": "hanoi",
      "activities": [
        "Découverte du vieux quartier",
        "Dégustation de street food vietnamienne",
        "Croisière sur le lac Hoan Kiem"
      ]
    },
    ...
  ]
  
  ⚠️ Ne réponds qu’avec le JSON pur, sans explication, sans commentaire.
  `;
  

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message.content;
    const steps = JSON.parse(raw || "[]");

    res.status(200).json(steps);
  } catch (error) {
    console.error("Erreur generate-steps:", error);
    res.status(500).json({ error: error.message });
  }
};
