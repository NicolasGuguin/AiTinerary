require("dotenv").config();
const OpenAI = require("openai");
const { VercelRequest, VercelResponse } = require("@vercel/node");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { cities, startDate } = req.body;

  const date = new Date(startDate);
  const mois = date.toLocaleString("fr-FR", { month: "long" });

  const prompt = `
Tu es météorologue spécialisé dans le tourisme. Voici une liste de villes et un mois de voyage : ${mois}.

Pour chaque ville, estime :
- la température moyenne du mois
- le taux de pluie (en %)
- le nombre moyen d'heures de soleil par jour
- le taux d'humidité moyen
- l'altitude estimée de la ville

### Villes :
${cities.map(c => `- ${c.name}`).join("\n")}

Format de réponse :
[
  {
    "cityId": "hanoi",
    "temp": "28°C",
    "pluie": "40%",
    "soleil": "6h",
    "humidite": "70%",
    "altitude": "35 m"
  },
  ...
]

⚠️ Réponds uniquement avec ce tableau JSON.
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
    console.error("Erreur get-weather:", error);
    res.status(500).json({ error: error.message });
  }
};
