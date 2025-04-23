require("dotenv").config();

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const formData = req.body;

  const prompt = `
  Tu es un expert en organisation de voyages. Ton rôle est de concevoir un itinéraire intelligent, cohérent et personnalisé à partir des préférences suivantes :
  
  ### 🧳 Détails du voyageur :
  - Destination cible : ${formData.destination}
  - Durée totale : ${formData.duration} jours
  - Style de voyage : ${formData.style.join(", ") || "non précisé"}
  - Rythme souhaité : ${formData.rhythm}
  - Type de voyage : ${formData.circularTrip ? "voyage circulaire" : "voyage aller simple"}
  - Budget global : ${formData.budget || "non précisé"} €
  - Moyens de transport autorisés : ${formData.transportPreferences.join(", ") || "non précisé"}
  - Temps de transport maximum : ${formData.maxTravelDuration || "illimité"}
  - Vie nocturne : ${formData.nightlife}
  - Éléments à éviter : ${formData.avoid || "aucun"}
  - Objectif principal : ${formData.purpose || "non précisé"}
  
  ---
  
  ### 📌 Contraintes de construction :
  1. Le nombre de villes doit dépendre du rythme :
     - Lent → 1 à 2 villes / semaine
     - Modéré → 2 à 3 villes / semaine
     - Rapide → 3 à 6 villes / semaine
  
  2. Le voyage doit être découpé en **chunks thématiques** de 3 à 10 jours.  
     Chaque chunk doit :
     - Avoir un identifiant (id) en **kebab-case**
     - Avoir un titre thématique
     - Contenir une ou plusieurs **cityIds**
     - Être **géographiquement et thématiquement cohérent**
     - Être **distinct** des autres (évite les redondances)
  
  3. ⚠️ Ne propose **aucune ville** dans plusieurs chunks sauf exception logique **justifiée par la cohérence géographique ou narrative**.
  
  4. Si le voyage est circulaire, la dernière ville doit être proche ou identique à la première.
  
  5. Le style (festif, nature, culturel…) doit guider le choix des régions.
  
  6. Prends en compte les transports autorisés (ex : "vélo" = pas de longues distances).
  
  7. Si le budget est faible, évite les villes très chères ou difficiles d'accès.
  
  ---
  
  ### ⚠️ Consignes strictes :
  
  - Les **villes** doivent apparaître **une seule fois** dans la section cities, avec :
    - un id en **kebab-case** sans accent ni majuscule (ex: "la-paz", "ho-chi-minh")
    - un name (nom réel de la ville)
    - ses coordonnées GPS : lat et lng
  
  - Les chunks doivent utiliser uniquement les **id listés dans \`cities\`** via le champ cityIds.
  
  - L’itinéraire global doit former une **progression fluide géographiquement**.  
    ⚠️ Interdiction stricte des zigzags du type "Séoul → Busan → Séoul → Jeju".
  
  ---
  
  ### ✅ Format de réponse JSON attendu :
  
  {
    "countries": ["Pays 1", "Pays 2 (si applicable)"],
    "cities": [
      { "id": "tokyo", "name": "Tokyo", "lat": 35.6762, "lng": 139.6503 },
      ...
    ],
    "chunks": [
      {
        "id": "tokyo-start",
        "title": "Découverte de Tokyo",
        "duration": 4,
        "cityIds": ["tokyo"]
      },
      ...
    ]
  }
  
  ⚠️ Réponds exclusivement avec ce JSON, sans aucun texte ou commentaire autour.
  `;
  

  
  

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw || "{}");

    res.status(200).json(parsed);
  } catch (error) {
    console.error("Erreur OpenAI", error);
    res.status(500).json({ error: error.message });
  }
};
