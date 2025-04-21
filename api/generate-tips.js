require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { countries } = req.body;
  const pays = countries.join(", ");

  const prompt = `
  Tu es un assistant de voyage. Donne 1 conseil utile pour chacun des 5 thèmes suivants, en t’adaptant à la ou les destinations suivantes : ${pays}.
  
  Thèmes :
  1. Visa
  2. Monnaie
  3. Transport
  4. Préparation
  5. Bagages
  
  Format :
  [
    { "category": "Visa", "icon": "Globe", "text": "..." },
    { "category": "Monnaie", "icon": "Coins", "text": "..." },
    { "category": "Transport", "icon": "TrainFront", "text": "..." },
    { "category": "Préparation", "icon": "CalendarDays", "text": "..." },
    { "category": "Bagages", "icon": "Backpack", "text": "..." }
  ]
  
  Contraintes :
  - Le texte doit être utile, clair, et concis (1 phrase max)
  - Ne réponds que par le tableau JSON ci-dessus.
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
    console.error("Erreur generate-tips:", error);
    res.status(500).json({ error: error.message });
  }
};
