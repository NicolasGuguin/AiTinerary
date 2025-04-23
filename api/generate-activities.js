require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { steps, chunk, context } = req.body;

  const flatActivities = steps.flatMap(step =>
    step.activities.map(title => ({
      stepDay: step.day,
      title,
      cityId: step.cityId,
    }))
  );

  const citiesMap = Object.fromEntries(
    context.cities.map(city => [city.id, city.name])
  );

  const country = context.countries[0] || "travel";

  const prompt = `
Tu es un assistant voyage spécialisé dans la présentation d'activités touristiques.

Voici une liste d'activités du chunk **"${chunk.title}"** (${chunk.duration} jours) :

${flatActivities
  .map(a => `- Jour ${a.stepDay} à ${citiesMap[a.cityId] || a.cityId} : ${a.title}`)
  .join("\n")}

Pour chaque activité, génère :
1. Un identifiant **court, en anglais et kebab-case**, qui résume l’activité.
2. **Ajoute à la fin de l’identifiant le nom du pays** (ex: "local-market-vietnam")
3. Une **courte description en français** (1 à 2 phrases max)

⚠️ L’identifiant ne doit pas dépasser 5 mots.
⚠️ Pas de phrases longues ni de commentaires supplémentaires.

Format attendu :

[
  {
    "stepDay": 1,
    "id": "shibuya-crossing-japan",
    "title": "Balade à Shibuya",
    "description": "Traversez le carrefour le plus célèbre du monde et plongez dans l'énergie tokyoïte."
  },
  ...
]

⚠️ Réponds uniquement avec ce tableau JSON, sans texte autour.
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
    console.error("Erreur generate-activities:", error);
    res.status(500).json({ error: error.message });
  }
};
