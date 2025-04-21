require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { steps, cities, transportPreferences, maxTravelDuration  } = req.body;

  // Reconstituer les trajets à estimer (dès qu'une ville change)
  const transitions = [];
  for (let i = 1; i < steps.length; i++) {
    const prev = steps[i - 1];
    const curr = steps[i];
    if (prev.cityId !== curr.cityId) {
      transitions.push({
        day: curr.day,
        from: prev.cityId,
        to: curr.cityId
      });
    }
  }

  const cityNames = {};
  cities.forEach(c => { cityNames[c.id] = c.name; });

  const prompt = `
  Tu es un assistant spécialisé dans les déplacements entre villes pendant un voyage.
  
  Voici les transitions à planifier :
  ${transitions.map(t => `- Jour ${t.day} : de ${cityNames[t.from]} à ${cityNames[t.to]}`).join("\n")}
  
  Le voyageur autorise les transports suivants : ${transportPreferences.join(", ")}
  
  Pour chaque trajet, estime :
  - le mode de transport le plus adapté parmi les options autorisées
  - la durée (ex: "2h15")
  - la distance en km (approximative)
  - le prix moyen en euros (budget normal)
  - Trajets limités à ${maxTravelDuration} en temps de transport si possible
  - N'utilise **aucun trajet supérieur à 120% de ${maxTravelDuration}** sauf s’il **n’existe vraiment aucune alternative** parmi les moyens autorisés.
  - Laisse le lien vide.

  Réponds au format suivant :
  
  [
    {
      "day": 3,
      "from": "hanoi",
      "to": "sapa",
      "mode": "Train",
      "duration": "7h30",
      "distance": 320,
      "price": 18,
      "link": ""
    },
    ...
  ]
  
  ⚠️ Réponds uniquement avec ce JSON.
  `;
  

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw || "[]");

    res.status(200).json(parsed);
  } catch (error) {
    console.error("Erreur generate-trajets:", error);
    res.status(500).json({ error: error.message });
  }
};
