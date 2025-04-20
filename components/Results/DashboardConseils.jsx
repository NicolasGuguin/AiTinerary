import {
    Globe,
    Coins,
    TrainFront,
    CalendarDays,
    Backpack,
  } from "lucide-react";
  
  const iconMap = {
    Globe,
    Coins,
    TrainFront,
    CalendarDays,
    Backpack,
  };  
  
  export default function DashboardConseils({ tips }) {
    return (
      <div className="space-y-4 text-sm sm:text-base text-gray-200 leading-relaxed">
        {tips.map((tip, index) => {
          const IconComponent = iconMap[tip.icon];
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg bg-[#1B2233]/50 hover:bg-[#2A2F44]/60 transition"
            >
              <div className="text-2xl text-secondary">
                {IconComponent ? <IconComponent size={24} /> : null}
              </div>
              <div>
                <p className="font-semibold text-secondary mb-1">{tip.category}</p>
                <p>{tip.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  