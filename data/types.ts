export type FormData = {
    destination: string;
    startDate: string;
    duration: string;
    travelers: number;
    budget: number;
    comfort: string;
    rhythm: string;
    style: string[];
    transportPreferences: string[];
    flexibleDates: boolean;
    nightlife: string;
    circularTrip: boolean;
    avoid: string;
    purpose: string;
    roomType: string;
    noLodgingNeeded: boolean;
    rooms: string;
    maxTravelDuration: string;
  };
  
  export type City = { id: string; name: string; lat: number; lng: number };
  export type Step = { day: number; cityId: string; activities: string[] };
  export type Activity = { stepDay: number; title: string; description: string; id: string };
  
  export type Trajet = {
    day: number;
    from: string;
    to: string;
    mode: string;
    duration: string;
    distance: number;
    price: number;
    link: string;
  };
  
  export type Weather = { cityId: string; temp: string; pluie: string; soleil: string; humidite: string; altitude: string };
  export type BudgetBreakdown = { label: string; value: number; color: string; icon: string };
  export type Tip = { category: string; icon: string; text: string };
  export type FlightOption = { type: string; company: string; from: string; to: string; price: number; duration: string; stops: number; date: string; link: string };
  export type Flights = { outbound: FlightOption[]; return: FlightOption[] };
  
  export type TripChunk = {
    id: string;
    title: string;
    duration: number;
    cityIds: string[]; // villeId, pas City complet
  };
  
  export type Context = {
    countries: string[];
    startDate: string;
    duration: number;
    cities: City[];
    chunks: TripChunk[];
  };
  
  export type TripData = {
    countries: string[];
    startDate: string;
    totalBudget: number;
    cities: City[];
    steps: Step[];
    activities: Activity[];
    trajets: Trajet[];
    meteoByCity: Weather[];
    budgetBreakdown: BudgetBreakdown[];
    tips: Tip[];
    flights: Flights;
  };
  