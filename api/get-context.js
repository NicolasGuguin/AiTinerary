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

### Détails du voyageur :
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

### Contraintes importantes :
1. Le nombre de villes doit dépendre du rythme :
   - Lent → 1 à 2 villes / semaine
   - Modéré → 2 à 3 villes / semaine
   - Rapide → 3 à 6 villes / semaine
2. Le voyage doit être découpé en **chunks thématiques** de 3 à 10 jours. Chaque chunk doit :
   - Avoir un identifiant unique (id) en **kebab-case**
   - Contenir une ou plusieurs villes cohérentes géographiquement
   - Représenter une logique thématique ou géographique
3. Si le voyage est circulaire, la dernière ville doit être proche ou identique à la première.
4. Si les transports sont limités (ex : à pied, à vélo), favorise les courtes distances.
5. Respecte les styles et contraintes du voyageur (ex : festif → villes vivantes ; nature → parcs et campagnes ; etc.)
6. Le coût de la vie doit être pris en compte selon le budget global.
7. Ne propose pas la même ville dans plusieurs chunks sauf exception logique.
8. L’ordre des villes doit former un **trajet fluide et cohérent géographiquement** (évite les zigzags).
9. Chaque chunk doit être assez distinct des autres pour éviter la redondance.
10. Si possible, passe par des points d’intérêt majeurs pour enrichir le voyage.

### Format de réponse attendu :
{
  "countries": ["Japon"],
  "cities": [
    { "id": "tokyo", "name": "Tokyo", "lat": 35.6762, "lng": 139.6503 },
    { "id": "hakone", "name": "Hakone", "lat": 35.2321, "lng": 139.1066 }
  ],
  "chunks": [
    {
      "id": "tokyo-start",
      "title": "Découverte de Tokyo",
      "duration": 4,
      "cityIds": ["tokyo"]
    },
    {
      "id": "nature-hakone",
      "title": "Nature et Onsen à Hakone",
      "duration": 3,
      "cityIds": ["hakone"]
    }
  ]
}

⚠️ Réponds uniquement avec ce JSON. Aucune explication, aucun commentaire.
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
