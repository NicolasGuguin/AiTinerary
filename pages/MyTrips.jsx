import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ItineraryMap from "../components/Results/ItineraryMap";

export default function MyTrips() {
  const [lastTrip, setLastTrip] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTrip = localStorage.getItem("lastTripData");
    if (savedTrip) {
      setLastTrip(JSON.parse(savedTrip));
    }
  }, []);

  const handleLoad = () => {
    navigate("/results", { state: lastTrip });
  };

  return (
    <div className="px-4 py-10 max-w-5xl mx-auto space-y-10 text-white">
      <h1 className="text-4xl font-extrabold text-primary text-center">
        📂 Mes voyages
      </h1>

      {lastTrip ? (
        <div className="bg-card rounded-2xl p-6 md:p-10 shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-secondary">
                Dernier voyage généré
              </h2>
              <p className="text-gray-300">
                <span className="block">
                  <strong>Destination</strong> : {lastTrip.countries?.join(", ")}
                </span>
                <span className="block">
                  <strong>Départ</strong> : {lastTrip.startDate}
                </span>
                <span className="block">
                  <strong>Étapes</strong> : {lastTrip.steps?.length || 0}
                </span>
              </p>
              <button
                onClick={handleLoad}
                className="inline-block mt-2 px-6 py-2 rounded-xl bg-primary text-white hover:bg-secondary hover:text-black transition font-semibold"
              >
                🧭 Voir ce voyage
              </button>
            </div>

            <div className="w-full md:w-1/2 rounded-xl overflow-hidden">
              <ItineraryMap
                steps={lastTrip.steps}
                cities={lastTrip.cities}
                compact={true}
              />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg">
          Aucun voyage enregistré pour le moment.
        </p>
      )}

      <div className="text-center">
        <Link
          to="/create"
          className="inline-block text-sm text-blue-400 hover:underline"
        >
          + Créer un nouveau voyage
        </Link>
      </div>
    </div>
  );
}