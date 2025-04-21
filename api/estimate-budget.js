require("dotenv").config();
const OpenAI = require("openai");
const { VercelRequest, VercelResponse } = require("@vercel/node");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { formData, totalBudget, cities, steps, trajets, flights } = req.body;

  const cityList = cities.map(c => c.name).join(", ");
    const totalDays = steps.length;
    const nbTrajets = trajets.length;
    const flightInfo = flights?.outbound?.length > 0 ? "Oui" : "Non";

const prompt = `
Tu es un expert en estimation budgétaire pour des voyages organisés.

### Budget global : ${totalBudget} €
- Durée : ${formData.duration} jours (${totalDays} étapes réelles)
- Voyage dans : ${cityList}
- Vols inclus : ${flightInfo}
- Nombre de trajets terrestres : ${nbTrajets}
- Moyens de transport utilisés : ${formData.transportPreferences.join(", ") || "non précisé"}
- Niveau de confort : ${formData.comfort}
- Type de logement : ${formData.roomType}${formData.noLodgingNeeded ? " (hébergement non nécessaire)" : ""}
- Style de voyage : ${formData.style.join(", ") || "non précisé"}
- Objectif : ${formData.purpose || "non précisé"}
- Voyageur solo ou en groupe : ${formData.travelers > 1 ? "en groupe" : "solo"}

Répartis ce budget dans 4 catégories cohérentes :
1. Hébergement
2. Nourriture
3. Activités
4. Souvenirs

### Contraintes :
- Tout le budget ne doit pas forcément etre réparti. Si c'est possible de respecter les contraintes avec moins, c'est mieux.
- Si le logement n’est pas requis, “Hébergement” = 0 €
- Si le style est “nature” ou “détente”, les activités peuvent être moins coûteuses
- Si les transports sont à pied ou limités, “Transport” diminue
- Si les vols sont inclus, ils doivent être pris en compte dans “Transport”
- Plus le confort est élevé, plus “Hébergement” et “Nourriture” montent
- Adapte les proportions selon le **coût de la vie local**, tout en respectant le budget global.

Format attendu :
[
  { "label": "Hébergement", "value": 420 },
  { "label": "Nourriture", "value": 190 },
  ...
]

⚠️ Le total doit être exactement ${totalBudget} €.  
⚠️ Réponds uniquement avec le JSON, sans texte explicatif.
`;


  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw || "[]");

    // Couleurs et icônes pour affichage
    const baseColors = {
      Hébergement: { color: "#F43F5E", icon: "MdHotel" },
      Nourriture: { color: "#10B981", icon: "MdRestaurant" },
      Activités: { color: "#EAB308", icon: "MdLocalActivity" },
      Souvenirs: { color: "#A855F7", icon: "MdCardGiftcard" },
      Transport: { color: "#3B82F6", icon: "MdDirectionsBus" },
    };

    const final = parsed.map(item => ({
      ...item,
      color: baseColors[item.label]?.color || "#ccc",
      icon: baseColors[item.label]?.icon || "MdAttachMoney"
    }));

    res.status(200).json(final);
  } catch (error) {
    console.error("Erreur estimate-budget:", error);
    res.status(500).json({ error: error.message });
  }
};
