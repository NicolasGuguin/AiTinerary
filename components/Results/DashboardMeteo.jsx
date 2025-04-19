import { useEffect, useState } from "react";
import {
  MdLocationOn,
  MdThermostat,
  MdWaterDrop,
  MdWbSunny,
  MdOpacity,
  MdTerrain,
} from "react-icons/md";

export default function DashboardMeteo({ meteoData }) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const visibleRows = 6;

  const meteoArray = Object.entries(meteoData).map(([ville, infos]) => ({
    ville,
    ...infos,
  }));

  const extendedData = [...meteoArray, ...meteoArray.slice(0, visibleRows)];

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex((prev) => (prev + 1) % meteoArray.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [meteoArray.length]);

  return (
    <div className="h-full w-full overflow-hidden font-sans text-white">
      <div className="h-full w-full flex flex-col items-center justify-center px-2 sm:px-6 py-4">
        {/* En-têtes stylisés */}
        <div className="grid grid-cols-6 text-center font-bold mb-2 w-full max-w-4xl text-xs sm:text-sm text-primary">
        <div className="flex flex-col items-center gap-0.5 text-pink-400 leading-tight truncate">
            <MdLocationOn className="text-base sm:text-lg" />
            <span>Ville</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-red-400 leading-tight truncate">
            <MdThermostat className="text-base sm:text-lg" />
            <span>Temp.</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-blue-300 leading-tight truncate">
            <MdOpacity className="text-base sm:text-lg" />
            <span>Pluie</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-yellow-400 leading-tight truncate">
            <MdWbSunny className="text-base sm:text-lg" />
            <span>Soleil</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-cyan-300 leading-tight truncate">
            <MdWaterDrop className="text-base sm:text-lg" />
            <span>Humidité</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-gray-300 leading-tight truncate">
            <MdTerrain className="text-base sm:text-lg" />
            <span>Altitude</span>
        </div>
        </div>

        {/* Contenu scrollable avec style visuel */}
        <div className="relative h-[192px] w-full max-w-4xl overflow-hidden rounded-xl border border-white/5 bg-[#1B2233] shadow-inner">
          <div
            className="absolute w-full transition-all duration-700 ease-in-out"
            style={{ transform: `translateY(-${scrollIndex * 32}px)` }}
          >
            {extendedData.map((entry, i) => (
              <div
                key={i}
                className={`h-[32px] grid grid-cols-6 text-center text-gray-200 text-sm px-2 items-center
                ${i % 2 === 0 ? "bg-[#1B2233]/60" : "bg-[#1B2233]/30"} 
                hover:bg-[#2A2F44]/60 transition duration-300`}
              >
                <div className="font-semibold">{entry.ville}</div>
                <div>{entry.temp}</div>
                <div>{entry.pluie}</div>
                <div>{entry.soleil}</div>
                <div>{entry.humidite}</div>
                <div>{entry.altitude}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
