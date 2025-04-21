require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { steps } = req.body;

  const flatActivities = steps.flatMap(step =>
    step.activities.map(title => ({
      stepDay: step.day,
      title,
      city: step.city // la propriété `city` doit être incluse côté frontend dans chaque step
    }))
  );

  const prompt = `
Tu es un assistant voyage spécialisé dans la présentation d'activités touristiques.

Voici une liste d'activités, avec leur jour de voyage, leur ville et leur titre :

${flatActivities.map(a => `- Jour ${a.stepDay} à ${a.city} : ${a.title}`).join("\n")}

Pour chaque activité, génère :
1. Un identifiant unique **court**, en **anglais** et en **kebab-case**, qui résume l’activité (⚠️ pas de phrases, pas de texte descriptif complet).
2. **Ajoute à la fin de l'identifiant le nom du pays** (ex: "local-market-vietnam")
3. Une **courte description en français** (1 à 2 phrases maximum)

Format de réponse attendu :

[
  {
    "stepDay": 1,
    "id": "shibuya-crossing-japan",
    "title": "Balade à Shibuya",
    "description": "Traversez le carrefour le plus célèbre du monde et plongez dans l'énergie tokyoïte."
  },
  ...
]

⚠️ Réponds uniquement avec le tableau JSON, sans explication.
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
    console.error("Erreur generate-activity-descriptions:", error);
    res.status(500).json({ error: error.message });
  }
};
