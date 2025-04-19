import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function formatLabel(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

export default function TransportChart({ transportPerDay }) {
  const data = {
    labels: transportPerDay.map((_, i) => `Jour ${i + 1}`),
    datasets: [
      {
        label: "Temps de transport (min)",
        data: transportPerDay,
        backgroundColor: "#F43F5E",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `⏱ ${formatLabel(ctx.raw)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatLabel(value),
        },
      },
    },
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg text-secondary font-semibold mb-2">
        Temps de transport par jour
      </h3>
      <div className="w-full h-[260px] md:h-[400px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );  
}
