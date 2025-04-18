import TransportChart from "./TransportChart";
import {
  MdTrain,
  MdAccessTime,
  MdAttachMoney,
  MdStraighten,
  MdCalendarToday,
} from "react-icons/md";

export default function DashboardTrajets({
  trajets,
  transportPerDay,
  totalPrice,
  totalMinutes,
  averagePerDay,
  formatMinutes,
}) {
  return (
    <div className="w-full space-y-6">
      {/* Liste des trajets */}
      <div className="space-y-4">
        {trajets.map((trajet, index) => (
          <div
            key={index}
            className="bg-[#1C2333] rounded-xl px-4 py-5 shadow-md flex flex-col md:flex-row md:items-center md:justify-between 
              transition-all duration-200 hover:bg-[#252f44] hover:scale-[1.01] hover:ring-1 hover:ring-primary"
          >
            <div className="flex-1 mb-3 md:mb-0">
              <p className="text-secondary font-semibold text-sm md:text-base">
                Jour {trajet.day}
              </p>
              <p className="text-white font-bold text-lg md:text-xl">
                {trajet.from} ➝ {trajet.to}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm md:text-base items-center">
              <span className="flex items-center gap-1 text-blue-400">
                <MdTrain /> {trajet.mode}
              </span>
              <span className="flex items-center gap-1 text-yellow-400">
                <MdAccessTime /> {trajet.duration}
              </span>
              <span className="flex items-center gap-1 text-green-400">
                <MdStraighten /> {trajet.distance} km
              </span>
              <span className="text-pink-400">
                {trajet.price} €
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Résumé global */}
      <div className="text-sm md:text-base text-gray-100 px-1 mt-4 grid gap-3 sm:grid-cols-3 bg-[#1A1F2E] rounded-xl p-4 shadow-inner border border-white/5">
        <div className="flex flex-col items-center">
          <span className="text-secondary font-semibold flex items-center gap-2">
            <MdAttachMoney className="text-pink-400" />
            Total estimé
          </span>
          <span className="text-lg font-bold text-white">{totalPrice.toLocaleString()} €</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-secondary font-semibold flex items-center gap-2">
            <MdAccessTime className="text-yellow-400" />
            Temps total
          </span>
          <span className="text-lg font-bold text-white">{formatMinutes(totalMinutes)}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-secondary font-semibold flex items-center gap-2">
            <MdCalendarToday className="text-blue-400" />
            Moyenne / jour
          </span>
          <span className="text-lg font-bold text-white">{formatMinutes(averagePerDay)}</span>
        </div>
      </div>

      {/* Graphique d'évolution */}
      <TransportChart transportPerDay={transportPerDay} />
    </div>
  );
}
