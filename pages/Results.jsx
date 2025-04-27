import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { processTripData } from "../data/processTripData";
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
import ShareTrip from "../components/Results/ShareTrip";

function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m.toString().padStart(2, "0")}min`;
}

export default function Results() {
  const { tripId } = useParams();
  const location = useLocation();
  const [tripRaw, setTripRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Charge le voyage depuis Supabase si tripId présent
  useEffect(() => {
    const loadTrip = async () => {
      if (tripId) {
        const { data, error } = await supabase
          .from("trips")
          .select("trip_data")
          .eq("id", tripId)
          .single();

        if (error) {
          console.error("Erreur de chargement du voyage :", error);
        } else {
          setTripRaw(data.trip_data);
        }
        setLoading(false);
      } else {
        const stateData = location.state;
        if (stateData) {
          localStorage.setItem("lastTripData", JSON.stringify(stateData));
          setTripRaw(stateData);
        }
        setLoading(false);
      }
    };

    loadTrip();
  }, [tripId, location.state]);

  if (loading) {
    return <div className="text-center text-white py-20 text-xl">Chargement du voyage…</div>;
  }

  if (!tripRaw) {
    return (
      <div className="text-center text-white py-20 text-xl">
        Aucun voyage trouvé.
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
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#F43F5E] drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
          Votre aventure commence
        </h1>
        <p className="mt-2 text-lg md:text-xl text-[#FDBA74] font-medium">
          Itinéraire généré. Décollage imminent ✈️
        </p>
      </div>

      <div className="w-full max-w-[1200px] px-2 sm:px-4 md:px-8 lg:px-12 mx-auto space-y-12">
        <DashboardResume tripData={tripData} />

        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Carte de l’itinéraire</h2>
          <ItineraryMap steps={steps} cities={cities} isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen} />
        </section>

        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Votre parcours jour par jour</h2>
          <DailyCardsCarousel steps={steps} cities={cities} tripData={tripData} />
        </section>

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

        {flights && <DashboardFlights flights={flights} />}

        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Budget estimé</h2>
          <DashboardBudget budgetData={budgetBreakdown} />
        </section>

        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Activités recommandées</h2>
          <DashboardActivitiesCarousel
            steps={steps}
            cities={cities}
            activities={tripData.activities}
          />
        </section>

        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Prévisions météo</h2>
          <DashboardMeteo meteoData={meteoByCity} />
        </section>

        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Conseils et recommandations</h2>
          <DashboardConseils tips={tips} />
        </section>

        <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Ce que les voyageurs postent</h2>
          <DashboardSocial cities={cities} />
        </section>

        <ShareTrip tripId={tripId} tripData={tripData} trajets={trajets}/>
      </div>
    </div>
  );
}
