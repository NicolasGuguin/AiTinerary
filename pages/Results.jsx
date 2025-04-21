import { useLocation } from "react-router-dom";
import { processTripData } from "../data/processTripData"; // 👈 à créer (voir plus haut)
import ItineraryMap from "../components/Results/ItineraryMap";
import DailyCardsCarousel from "../components/Results/DailyCardsCarousel";
import DashboardMeteo from "../components/Results/DashboardMeteo";
import DashboardTrajets from "../components/Results/DashboardTrajets";
import DashboardBudget from "../components/Results/DashboardBudget";
import DashboardResume from "../components/Results/DashboardResume";
import DashboardSocial from "../components/Results/DashboardSocial";
import DashboardConseils from "../components/Results/DashboardConseils";
import DashboardActivitiesCarousel from "../components/Results/DashboardActivitiesCarousel";
import DashboardFlights from "../components/Results/DashboardFlights";

// Utilitaire simple
function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m.toString().padStart(2, "0")}min`;
}

export default function Results() {
  const location = useLocation();
  const tripRaw = location.state;

  if (!tripRaw) {
    return (
      <div className="text-center text-white py-20 text-xl">
        Aucun voyage généré. Veuillez remplir le formulaire pour créer un itinéraire.
      </div>
    );
  }

  const tripData = processTripData(tripRaw);

  const {
    steps,
    trajets,
    transportPerDay,
    budgetBreakdown,
    cities,
    flights,
    meteoByCity,
    tips
  } = tripData;

  const totalPrice = budgetBreakdown.find(b => b.label === "Transport")?.value || 0;
  const totalMinutes = transportPerDay.reduce((sum, min) => sum + min, 0);
  const averagePerDay = Math.round(totalMinutes / steps.length);

  return (
    <div className="min-h-screen bg-background text-white px-4 py-8 md:px-12 md:py-16 font-sans">
      {/* Titre principal */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#F43F5E] drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
          Votre aventure commence
        </h1>
        <p className="mt-2 text-lg md:text-xl text-[#FDBA74] font-medium">
          Itinéraire généré. Décollage imminent ✈️
        </p>
      </div>

      <div className="w-full max-w-[1200px] px-2 sm:px-4 md:px-8 lg:px-12 mx-auto space-y-12">

        {/* Résumé global */}
        <DashboardResume tripData={tripData}/>

        {/* Carte */}
        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Carte de l’itinéraire</h2>
          <ItineraryMap steps={steps} cities={cities} />
        </section>

        {/* Carrousel jour par jour */}
        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Votre parcours jour par jour</h2>
          <DailyCardsCarousel steps={steps} cities={cities} />
        </section>

        {/* Trajets */}
        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Vos trajets</h2>
          <DashboardTrajets
            trajets={trajets}
            transportPerDay={transportPerDay}
            totalPrice={totalPrice}
            totalMinutes={totalMinutes}
            averagePerDay={averagePerDay}
            formatMinutes={formatMinutes}
          />
        </section>

        {/* Vols */}
        {flights && (
          <DashboardFlights flights={flights} />
        )}

        {/* Budget */}
        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Budget estimé</h2>
          <DashboardBudget budgetData={budgetBreakdown} />
        </section>

        {/* Activités */}
        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Activités recommandées</h2>
          <DashboardActivitiesCarousel
            steps={steps}
            cities={cities}
            activities={tripData.activities}
          />
        </section>

        {/* Météo */}
        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Prévisions météo</h2>
          <DashboardMeteo meteoData={meteoByCity} />
        </section>

        {/* Conseils */}
        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Conseils et recommandations</h2>
          <DashboardConseils tips={tips} />
        </section>

        {/* Réseaux sociaux */}
        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Ce que les voyageurs postent</h2>
          <DashboardSocial cities={cities} />
        </section>

      </div>
    </div>
  );
}
