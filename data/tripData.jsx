// Données brutes minimales
const tripData = {
    countries: ["Japon"],
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
    ],

    tips: [
      {
        category: "Visa",
        icon: "Globe",
        text: "Pas besoin de visa pour un séjour de moins de 90 jours au Japon si vous êtes français.",
      },
      {
        category: "Monnaie",
        icon: "Coins",
        text: "Le Japon utilise le yen. Prévoyez du cash, car les cartes ne sont pas toujours acceptées.",
      },
      {
        category: "Transport",
        icon: "TrainFront",
        text: "Pensez au JR Pass si vous prenez plusieurs fois le Shinkansen.",
      },
      {
        category: "Préparation",
        icon: "CalendarDays",
        text: "Réservez vos vols 3 à 5 mois à l’avance pour obtenir les meilleurs prix.",
      },
      {
        category: "Bagages",
        icon: "Backpack",
        text: "Préférez un sac léger, certains hôtels proposent des laveries ou services de lessive.",
      },
    ],
    
    activities: [
      // Jour 1
      {
        id: "arrivee-tokyo",
        stepDay: 1,
        title: "Arrivée à Tokyo",
        description: "Installation et premiers pas dans la capitale japonaise, entre modernité et tradition."
      },
      {
        id: "balade-shibuya",
        stepDay: 1,
        title: "Balade à Shibuya",
        description: "Traversez le célèbre carrefour de Shibuya et imprégnez-vous de l’ambiance électrique du quartier."
      },
      {
        id: "coucher-soleil-roppongi",
        stepDay: 1,
        title: "Coucher de soleil à Roppongi Hills",
        description: "Admirez Tokyo depuis la Mori Tower à l’heure dorée, un panorama inoubliable."
    
      },
    
      // Jour 2
      {
        id: "visite-asakusa",
        stepDay: 2,
        title: "Visite d'Asakusa",
        description: "Découvrez le temple Sensō-ji et les ruelles commerçantes typiques du vieux Tokyo."
      },
      {
        id: "akihabara",
        stepDay: 2,
        title: "Akihabara",
        description: "Plongez dans l’univers geek et rétro-gaming du quartier de l’électronique et des mangas."
      },
      {
        id: "tokyo-skytree",
        stepDay: 2,
        title: "Tokyo Skytree",
        description: "Grimpez dans l'une des plus hautes tours du monde pour une vue vertigineuse sur la ville."
      },
    
      // Jour 3
      {
        id: "onsen-hakone",
        stepDay: 3,
        title: "Détente dans un onsen",
        description: "Relaxez-vous dans un bain thermal traditionnel avec vue sur les montagnes."
      },
      {
        id: "croisiere-lac-ashi",
        stepDay: 3,
        title: "Croisière sur le Lac Ashi",
        description: "Naviguez paisiblement sur les eaux du lac avec une vue potentielle sur le Mont Fuji."
      },
      {
        id: "musee-plein-air",
        stepDay: 3,
        title: "Musée en plein air",
        description: "Parcourez un musée unique mêlant art moderne et nature luxuriante."
    
      },
    
      // Jour 4
      {
        id: "fushimi-inari",
        stepDay: 4,
        title: "Fushimi Inari",
        description: "Marchez sous les milliers de torii rouges menant au sommet du mont sacré."
      },
      {
        id: "gion",
        stepDay: 4,
        title: "Gion",
        description: "Promenez-vous dans le quartier historique des geishas, entre ruelles pavées et maisons en bois."
      },
      {
        id: "matcha-temples",
        stepDay: 4,
        title: "Matcha & temples",
        description: "Dégustez un thé matcha traditionnel après la visite de temples zen apaisants."
      },
    
      // Jour 5
      {
        id: "arashiyama",
        stepDay: 5,
        title: "Arashiyama",
        description: "Explorez la forêt de bambous emblématique et les rives calmes de la rivière Katsura."
      },
      {
        id: "kinkakuji",
        stepDay: 5,
        title: "Kinkaku-ji",
        description: "Admirez le Pavillon d'Or, l’un des temples les plus emblématiques du Japon."
      },
      {
        id: "ryokan",
        stepDay: 5,
        title: "Ryokan traditionnel",
        description: "Passez la nuit dans une auberge japonaise authentique, entre futons et hospitalité locale."
      },
    
      // Jour 6
      {
        id: "nara-park",
        stepDay: 6,
        title: "Nara Park",
        description: "Rencontrez des cerfs en liberté dans un parc paisible entourant de magnifiques temples."
      },
      {
        id: "daibutsu",
        stepDay: 6,
        title: "Daibutsu",
        description: "Contemplez la grande statue de Bouddha au temple Tōdai-ji, impressionnante par sa taille et son aura."
      },
      {
        id: "cerfs-liberte",
        stepDay: 6,
        title: "Cerfs en liberté",
        description: "Côtoyez ces animaux sacrés qui se promènent librement dans les rues et jardins."
    
      },
    
      // Jour 7
      {
        id: "chateau-osaka",
        stepDay: 7,
        title: "Château d'Osaka",
        description: "Explorez ce monument historique entouré de douves et de cerisiers."
      },
      {
        id: "dotonbori",
        stepDay: 7,
        title: "Dotonbori",
        description: "Plongez dans le quartier le plus animé d’Osaka, avec ses néons géants et ses spécialités culinaires."
      },
      {
        id: "street-food",
        stepDay: 7,
        title: "Street food",
        description: "Goûtez les takoyakis, okonomiyakis et autres délices locaux dans les ruelles gourmandes."
      },
    
      // Jour 8
      {
        id: "mont-rokko",
        stepDay: 8,
        title: "Mont Rokko",
        description: "Montez au sommet pour une vue panoramique sur la baie de Kobe et les montagnes environnantes."
      },
      {
        id: "port-kobe",
        stepDay: 8,
        title: "Port de Kobe",
        description: "Flânez le long du port moderne de Kobe, entre mer, architecture et ambiance détendue."
      },
      {
        id: "boeuf-kobe",
        stepDay: 8,
        title: "Dîner de bœuf de Kobe",
        description: "Savourez la fameuse viande de Kobe, tendre et persillée à souhait, dans un cadre raffiné."
      },
    
      // Jour 9
      {
        id: "retour-tokyo",
        stepDay: 9,
        title: "Retour à Tokyo",
        description: "Replongez dans la capitale japonaise pour les derniers moments de votre voyage."
      },
      {
        id: "shopping-harajuku",
        stepDay: 9,
        title: "Shopping à Harajuku",
        description: "Parcourez les boutiques originales de Takeshita Street et découvrez la mode tokyoïte."
      },
      {
        id: "derniers-sushis",
        stepDay: 9,
        title: "Derniers sushis",
        description: "Terminez votre séjour en beauté avec une dégustation de sushis frais dans un kaiten."
      },
    
      // Jour 10
      {
        id: "matinee-libre",
        stepDay: 10,
        title: "Matinée libre",
        description: "Profitez d’un dernier moment pour flâner ou faire vos achats de souvenirs."
      },
      {
        id: "depart",
        stepDay: 10,
        title: "Départ",
        description: "Temps de trajet vers l’aéroport et au revoir au pays du Soleil-Levant."
      }
    ],

    flights: {
      outbound: [
        {
          type: "Rapide",
          company: "Air France",
          from: "Paris CDG",
          to: "Tokyo Narita",
          price: 890,
          duration: "11h45",
          stops: 0,
          date: "2025-10-15"
        },
        {
          type: "Bon compromis",
          company: "Turkish Airlines",
          from: "Paris CDG",
          to: "Tokyo Narita",
          price: 620,
          duration: "16h30",
          stops: 1,
          date: "2025-10-15"
        }
      ],
      return: [
        {
          type: "Rapide",
          company: "Japan Airlines",
          from: "Tokyo Narita",
          to: "Paris CDG",
          price: 920,
          duration: "12h00",
          stops: 0,
          date: "2025-10-25"
        },
        {
          type: "Bon compromis",
          company: "Qatar Airways",
          from: "Tokyo Haneda",
          to: "Paris CDG",
          price: 590,
          duration: "17h10",
          stops: 1,
          date: "2025-10-25"
        }
      ]
    }
       

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
  