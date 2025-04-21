require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { countries, startDate, duration, comfort, flexibleDates } = req.body;

  const departureCity = "Paris CDG"; // valeur par défaut
  const arrivalCountry = countries[0] || "destination inconnue";

  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + parseInt(duration || 0));
  const returnDate = end.toISOString().split("T")[0];

  const prompt = `
Tu es un assistant de voyage. Voici les infos d’un utilisateur :
- Départ : ${departureCity}
- Destination : ${arrivalCountry}
- Départ prévu le : ${startDate}
- Retour estimé le : ${returnDate}
- Niveau de confort : ${comfort}
- Dates flexibles : ${flexibleDates ? "oui" : "non"}

Génère 3 options de vol pour l’aller ET le retour, avec les infos suivantes :
- le type de vol : "Rapide", "Bon compromis", "Économique"
- la compagnie
- les aéroports (from / to)
- le prix estimé en euros
- la durée de vol
- le nombre d’escales
- la date de vol
- un lien vers la page de réservation (homepage officielle de la compagnie aérienne)

Format attendu :

{
  "outbound": [
    {
      "type": "Rapide",
      "company": "Air France",
      "from": "Paris CDG",
      "to": "Tokyo Narita",
      "price": 890,
      "duration": "11h45",
      "stops": 0,
      "date": "${startDate}",
      "link": "https://wwws.airfrance.fr"
    },
    ...
  ],
  "return": [
    {
      "type": "Rapide",
      "company": "Japan Airlines",
      "from": "Tokyo Narita",
      "to": "Paris CDG",
      "price": 920,
      "duration": "12h00",
      "stops": 0,
      "date": "${returnDate}",
      "link": "https://wwws.airfrance.fr"
    },
    ...
  ]
}

⚠️ Ne retourne que le JSON sans autre texte.
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
    console.error("Erreur get-flights:", error);
    res.status(500).json({ error: error.message });
  }
};
