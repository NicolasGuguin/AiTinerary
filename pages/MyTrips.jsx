import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import ItineraryMap from "../components/Results/ItineraryMap";

export default function MyTrips() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur récupération trips :", error);
      } else {
        setTrips(data || []);
      }

      setLoading(false);
    };

    fetchTrips();
  }, [user]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Confirmer la suppression de ce voyage ?");
    if (!confirm) return;

    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) {
      console.error("Erreur suppression :", error);
    } else {
      setTrips((prev) => prev.filter((trip) => trip.id !== id));
      setToast("Voyage supprimé !");
      setTimeout(() => setToast(""), 3000);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-20">Chargement…</div>;
  }

  return (
    <div className="px-4 py-10 max-w-5xl mx-auto space-y-10 text-white relative">
      <h1 className="text-4xl font-extrabold text-primary text-center">
        Mes voyages
      </h1>

      {trips.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          Aucun voyage enregistré pour le moment.
        </p>
      ) : (
        trips.map((trip) => (
          <div
            key={trip.id}
            className="bg-card rounded-2xl p-6 md:p-10 shadow-lg space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-secondary">
                  Voyage créé le{" "}
                  {new Date(trip.created_at).toLocaleDateString("fr-FR")}
                </h2>

                <p className="text-gray-300">
                  <span className="block">
                    <strong>Destination</strong> :{" "}
                    {trip.trip_data?.countries?.join(", ") || "N/A"}
                  </span>
                  <span className="block">
                    <strong>Départ</strong> : {trip.trip_data?.startDate}
                  </span>
                  <span className="block">
                    <strong>Étapes</strong> : {trip.trip_data?.steps?.length}
                  </span>
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                <Link
                    to={`/results/${trip.id}`}
                    className="px-6 py-2 rounded-xl bg-primary text-white hover:bg-secondary hover:text-black transition font-semibold"
                  >
                    Voir ce voyage
                  </Link>

                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition font-semibold"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="w-full md:w-1/2 rounded-xl overflow-hidden">
                <ItineraryMap
                  steps={trip.trip_data?.steps || []}
                  cities={trip.trip_data?.cities || []}
                  compact={true}
                />
              </div>
            </div>
          </div>
        ))
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50">
          {toast}
        </div>
      )}

      <div className="text-center pt-6">
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
