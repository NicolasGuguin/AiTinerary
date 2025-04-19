import ItineraryMap from "../components/Results/ItineraryMap";
import DailyCardsCarousel from "../components/Results/DailyCardsCarousel";
import DashboardMeteo from "../components/Results/DashboardMeteo";
import DashboardTrajets from "../components/Results/DashboardTrajets";
import DashboardBudget from "../components/Results/DashboardBudget";
import DashboardResume from "../components/Results/DashboardResume";
import tripData from "../data/tripData";

// Utilitaire simple
function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m.toString().padStart(2, "0")}min`;
}

export default function Results() {
  const {
    country,
    durationDays,
    startDate,
    totalBudget,
    steps,
    trajets,
    transportPerDay,
    budgetData,
    meteoData
  } = tripData;

  const totalPrice = trajets.reduce((sum, t) => sum + t.price, 0);
  const totalMinutes = transportPerDay.reduce((sum, min) => sum + min, 0);
  const averagePerDay = Math.round(totalMinutes / durationDays);

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




        <div className="w-full max-w-screen-lg px-1 sm:px-2 md:px-6 lg:px-0 mx-auto space-y-12">




        {/* Résumé global */}
          <DashboardResume />

        {/* Carte */}
        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Carte de l’itinéraire</h2>
          <ItineraryMap steps={tripData.steps} cities={tripData.cities} />
        </section>

        {/* Carrousel */}
        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Votre parcours jour par jour</h2>
          <DailyCardsCarousel steps={tripData.steps} cities={tripData.cities} />
        </section>

        {/* Trajets */}
        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Vos trajets</h2>
          <DashboardTrajets
            trajets={tripData.trajets}
            transportPerDay={tripData.transportPerDay}
            totalPrice={tripData.budgetBreakdown.find(b => b.label === "Transport").value}
            totalMinutes={tripData.transportPerDay.reduce((a, b) => a + b, 0)}
            averagePerDay={Math.round(tripData.transportPerDay.reduce((a, b) => a + b, 0) / tripData.steps.length)}
            formatMinutes={(mins) => `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}min`}
            />
        </section>

        {/* Budget */}
        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Budget estimé</h2>
          <DashboardBudget budgetData={tripData.budgetBreakdown} />
        </section>

        {/* Météo */}
        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Prévisions météo</h2>
          <DashboardMeteo meteoData={tripData.meteoByCity} />
        </section>

        {/* À venir */}
        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-xl font-semibold text-secondary mb-4">[Section : Spots & recommandations]</h2>
          <p className="text-gray-400">À venir…</p>
        </section>

        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-xl font-semibold text-secondary mb-4">[Section : Visualisation graphique]</h2>
          <p className="text-gray-400">À venir…</p>
        </section>

      </div>
    </div>
  );
}
