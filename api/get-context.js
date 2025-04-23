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
  Tu es un expert en organisation de voyages. Crée un itinéraire structuré et fluide à partir des préférences suivantes :
  
  ### Voyageur :
  - Destination : ${formData.destination}
  - Durée : ${formData.duration} jours
  - Style : ${formData.style.join(", ") || "non précisé"}
  - Rythme : ${formData.rhythm}
  - Type : ${formData.circularTrip ? "circulaire" : "aller simple"}
  - Transports autorisés : ${formData.transportPreferences.join(", ") || "non précisé"}
  - Max transport/étape : ${formData.maxTravelDuration || "illimité"}
  - Budget : ${formData.budget || "non précisé"} €
  - Vie nocturne : ${formData.nightlife}
  - À éviter : ${formData.avoid || "aucun"}
  
  ---
  
  ### Règles à suivre :
  1. Découpe le voyage en **chunks** de 3 à 10 jours, chacun avec un `id`, `title`, `duration` et une ou plusieurs `cityIds`.
  2. Chaque chunk doit avoir une **logique géographique ou thématique claire**.
  3. ⚠️ **Ne répète pas la même ville dans plusieurs chunks** sauf si c’est nécessaire pour la cohérence (ex : aller-retour impossible).
  4. L’ordre des villes doit suivre une **progression fluide**, sans zigzag.
  5. Si le voyage est circulaire, la fin doit rejoindre le début.
  6. Choisis les villes en accord avec le style de voyage demandé et les transports autorisés.
  
  ---
  
  ### Format attendu :
  {
    "countries": ["Pays 1", "Pays 2"],
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
  
  ⚠️ Réponds uniquement avec ce JSON, sans aucun commentaire ni explication.
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
