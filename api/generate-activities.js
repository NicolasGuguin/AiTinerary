require("dotenv").config();
const OpenAI = require("openai");
const { VercelRequest, VercelResponse } = require("@vercel/node");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { steps } = req.body;

  const flatActivities = steps.flatMap(step =>
    step.activities.map(title => ({ stepDay: step.day, title }))
  );

  const prompt = `
Tu es un assistant voyage spécialisé dans la présentation d'activités touristiques.

Voici une liste d'activités, avec leur jour de voyage et leur titre :

${flatActivities.map(a => `- Jour ${a.stepDay} : ${a.title}`).join("\n")}

Pour chaque activité, génère :
1. Un identifiant unique en anglais en kebab-case (ex: "sunset-halpi-viewpoint")
2. Une courte description en français (1 à 2 phrases)

Retourne la réponse au format suivant :

[
  {
    "stepDay": 1,
    "id": "shibuya-crossing",
    "title": "Balade à Shibuya",
    "description": "Traversez le carrefour le plus célèbre du monde et plongez dans l'énergie tokyoïte."
  },
  ...
]

⚠️ Réponds uniquement avec le tableau JSON, sans explication.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw || "[]");

    res.status(200).json(parsed);
  } catch (error) {
    console.error("Erreur generate-activity-descriptions:", error);
    res.status(500).json({ error: error.message });
  }
};
