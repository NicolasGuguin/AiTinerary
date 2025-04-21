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
  Tu es un expert en organisation de voyages. Tu dois créer un itinéraire intelligent et personnalisé à partir des préférences suivantes :
  
  ### Détails du voyageur :
  - Destination cible : ${formData.destination}
  - Durée totale : ${formData.duration} jours
  - Style de voyage préféré : ${formData.style.length > 0 ? formData.style.join(", ") : "non précisé"}
  - Rythme souhaité : ${formData.rhythm} (ex. : "lent" = 2-3 étapes sur tout le voyage, "rapide" = jusqu'à 8-10 villes)
  - Type de voyage : ${formData.circularTrip ? "voyage circulaire" : "voyage aller simple"}
  - Budget global : ${formData.budget ? formData.budget + " €" : "non précisé"}
  - Moyens de transport autorisés : ${formData.transportPreferences.length > 0 ? formData.transportPreferences.join(", ") : "non précisé"}
  - Vie nocturne : ${formData.nightlife} (par exemple : "active", "calme", "indifférent")
  - Éléments à éviter absolument : ${formData.avoid || "aucun"}
  - Objectif du voyage : ${formData.purpose || "non précisé"}
  
  ### Contraintes importantes :
  1. Le nombre d’étapes doit dépendre du rythme : 
     - Lent → 1 à 2 villes par semaine
     - Modéré → 2 à 3 villes par semaine
     - Rapide → 3 à 6 villes par semaine
  2. Si le voyage est circulaire, la dernière ville doit être proche ou identique à la première.
  3. Si les transports disponibles sont limités (ex : "à pied", "à vélo"), privilégie les courtes distances.
  4. L’itinéraire doit respecter le style demandé (nature, culturel, festif, etc.)
  5. Ne propose pas de destinations très coûteuses si le budget est restreint.
  6. La vie nocturne doit être présente uniquement si souhaitée.
  7. ⚠️ **Le champ id pour chaque ville doit être au format kebab-case, sans majuscules ni accents** (ex: "ho-chi-minh-city", "hue", "la-paz").
  
  ### Format attendu (obligatoire) :
  {
    "countries": ["Pays 1", "Pays 2 (optionnel)"],
    "cities": [
      { "id": "tokyo", "name": "Tokyo", "lat": 35.6762, "lng": 139.6503 },
      ...
    ]
  }
  
  ⚠️ Réponds uniquement avec ce JSON, sans autre texte.
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
