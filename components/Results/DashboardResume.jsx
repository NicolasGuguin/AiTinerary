import { MdOutlineFlag, MdAccessTime, MdEuro, MdDirections, MdCalendarToday, MdMap, MdTrain, MdExplore } from "react-icons/md";
import tripData from "../../data/tripData";

export default function DashboardResume() {
  const {
    countries,
    startDate,
    totalBudget,
    trajets,
    steps,
    cities,
    transportPerDay
  } = tripData;

  const durationDays = steps.length;
  const totalSteps = [...new Set(steps.map(s => s.cityId))].length;
  const totalDistance = trajets.reduce((sum, t) => sum + t.distance, 0);
  const totalTransportMinutes = transportPerDay.reduce((sum, m) => sum + m, 0);
  const avgTransport = Math.round(totalTransportMinutes / durationDays);

  const formatMinutes = (m) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}min`;

  const items = [
    { icon: <MdOutlineFlag size={24} />, label: "Pays", value: countries.join(", ") },
    { icon: <MdCalendarToday size={24} />, label: "Départ", value: startDate },
    { icon: <MdAccessTime size={24} />, label: "Durée", value: `${durationDays} jours` },
    { icon: <MdExplore size={24} />, label: "Étapes", value: `${totalSteps}` },
    { icon: <MdDirections size={24} />, label: "Distance", value: `${totalDistance} km` },
    { icon: <MdTrain size={24} />, label: "Transport total", value: formatMinutes(totalTransportMinutes) },
    { icon: <MdMap size={24} />, label: "Transport/jour", value: formatMinutes(avgTransport) },
    { icon: <MdEuro size={24} />, label: "Budget", value: `${totalBudget} €` }
  ];

  return (
    <div className="bg-card rounded-2xl p-6 md:p-10 shadow-lg">
      <h2 className="text-2xl font-bold text-secondary mb-6">Résumé du voyage</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm md:text-base">
        {items.map((item, i) => (
          <div key={i} className="flex items-center space-x-3 text-gray-200">
            <div className="text-primary">{item.icon}</div>
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wide">{item.label}</div>
              <div className="font-semibold text-white">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
