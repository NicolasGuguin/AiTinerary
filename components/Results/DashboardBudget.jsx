import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  MdTrain,
  MdHotel,
  MdRestaurant,
  MdLocalActivity,
  MdCardGiftcard
} from "react-icons/md";

ChartJS.register(ArcElement, Tooltip, Legend);

// Mapping nom -> composant réel
const iconMap = {
  MdTrain: MdTrain,
  MdHotel: MdHotel,
  MdRestaurant: MdRestaurant,
  MdLocalActivity: MdLocalActivity,
  MdCardGiftcard: MdCardGiftcard,
};

export default function DashboardBudget({ budgetData }) {
  const total = budgetData.reduce((sum, item) => sum + item.value, 0);

  const chartData = {
    labels: budgetData.map((item) => item.label),
    datasets: [
      {
        data: budgetData.map((item) => item.value),
        backgroundColor: budgetData.map((item) => item.color),
        borderColor: "#141A2A",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    cutout: "5%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label} : ${ctx.raw} €`,
        },
      },
    },
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="w-[260px] h-[260px]">
        <Doughnut data={chartData} options={options} />
      </div>

      <div className="flex-1 space-y-4 text-sm md:text-base text-gray-200">
        <h3 className="text-lg text-secondary font-bold">
          Détail du budget (total : {total} €)
        </h3>

        {budgetData.map((item, index) => {
          const Icon = iconMap[item.icon];
          const percent = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {Icon && <Icon className="text-xl" style={{ color: item.color }} />}
                <span className="font-semibold">{item.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 w-[120px] text-right font-mono">
                <span className="text-gray-400">{item.value} €</span>
                <span className="text-primary">{percent}%</span>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
