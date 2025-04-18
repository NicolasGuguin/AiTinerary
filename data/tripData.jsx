// Données brutes minimales
const tripData = {
    country: "Japon",
    startDate: "2025-10-15",
    totalBudget: 2000, // €
  
    cities: [
      { id: "tokyo", name: "Tokyo", lat: 35.6762, lng: 139.6503 },
      { id: "hakone", name: "Hakone", lat: 35.2321, lng: 139.1066 },
      { id: "kyoto", name: "Kyoto", lat: 35.0116, lng: 135.7681 },
      { id: "nara", name: "Nara", lat: 34.6851, lng: 135.805 },
      { id: "osaka", name: "Osaka", lat: 34.6937, lng: 135.5023 },
      { id: "kobe", name: "Kobe", lat: 34.6901, lng: 135.1955 }
    ],
  
    steps: [
      { day: 1, cityId: "tokyo", activities: ["Arrivée à Tokyo", "Balade à Shibuya", "Coucher de soleil à Roppongi Hills"] },
      { day: 2, cityId: "tokyo", activities: ["Visite d'Asakusa", "Akihabara", "Tokyo Skytree"] },
      { day: 3, cityId: "hakone", activities: ["Détente dans un onsen", "Croisière sur le Lac Ashi", "Musée en plein air"] },
      { day: 4, cityId: "kyoto", activities: ["Fushimi Inari", "Gion", "Matcha & temples"] },
      { day: 5, cityId: "kyoto", activities: ["Arashiyama", "Kinkaku-ji", "Ryokan traditionnel"] },
      { day: 6, cityId: "nara", activities: ["Nara Park", "Daibutsu", "Cerfs en liberté"] },
      { day: 7, cityId: "osaka", activities: ["Château d'Osaka", "Dotonbori", "Street food"] },
      { day: 8, cityId: "kobe", activities: ["Mont Rokko", "Port de Kobe", "Dîner de bœuf de Kobe"] },
      { day: 9, cityId: "tokyo", activities: ["Retour à Tokyo", "Shopping à Harajuku", "Derniers sushis"] },
      { day: 10, cityId: "tokyo", activities: ["Matinée libre", "Départ"] }
    ],
  
    trajets: [
      { day: 3, from: "tokyo", to: "hakone", mode: "Train", duration: "2h15", distance: 150, price: 20 },
      { day: 4, from: "hakone", to: "kyoto", mode: "Shinkansen", duration: "2h45", distance: 370, price: 66 },
      { day: 6, from: "kyoto", to: "nara", mode: "Train", duration: "1h10", distance: 80, price: 13 },
      { day: 7, from: "nara", to: "osaka", mode: "Bus", duration: "1h30", distance: 90, price: 12 },
      { day: 8, from: "osaka", to: "kobe", mode: "Train", duration: "0h50", distance: 35, price: 10 },
      { day: 9, from: "kobe", to: "tokyo", mode: "Shinkansen", duration: "3h20", distance: 480,  price: 75 }
    ],    
  
    meteoByCity: {
      tokyo:  { temp: "22°C", pluie: "30%", soleil: "6h", humidite: "68%", altitude: "40 m" },
      hakone: { temp: "18°C", pluie: "60%", soleil: "3h", humidite: "78%", altitude: "723 m" },
      kyoto:  { temp: "21°C", pluie: "25%", soleil: "7h", humidite: "65%", altitude: "50 m" },
      nara:   { temp: "20°C", pluie: "20%", soleil: "8h", humidite: "60%", altitude: "85 m" },
      osaka:  { temp: "23°C", pluie: "15%", soleil: "9h", humidite: "58%", altitude: "3 m" },
      kobe:   { temp: "22°C", pluie: "10%", soleil: "10h", humidite: "55%", altitude: "10 m" }
    },    
  
    budgetBreakdown: [
      { label: "Hébergement", value: 700, color: "#F43F5E", icon: "MdHotel" },
      { label: "Nourriture",  value: 300, color: "#10B981", icon: "MdRestaurant" },
      { label: "Activités",   value: 350, color: "#EAB308", icon: "MdLocalActivity" },
      { label: "Souvenirs",   value: 150, color: "#A855F7", icon: "MdCardGiftcard" }
    ]
  };
  
  // Ajout de Transport automatiquement dans le budget
  const transportTotal = tripData.trajets.reduce((sum, t) => sum + t.price, 0);
  tripData.budgetBreakdown.unshift({
    label: "Transport",
    value: transportTotal,
    color: "#3B82F6",
    icon: "MdTrain"
  });
  
  // Calcul transport par jour
  function parseDurationToMinutes(duration) {
    const [h, m] = duration.split("h");
    return parseInt(h) * 60 + parseInt(m);
  }
  
  const transportPerDay = Array(tripData.steps.length).fill(0);
  tripData.trajets.forEach((t) => {
    const mins = parseDurationToMinutes(t.duration);
    transportPerDay[t.day - 1] += mins;
  });
  tripData.transportPerDay = transportPerDay;
  
  export default tripData;
  