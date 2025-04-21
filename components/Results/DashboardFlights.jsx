import { PlaneTakeoff, PlaneLanding, ArrowRight } from "lucide-react";

export default function DashboardFlights({ flights }) {
  if (!flights || !flights.outbound?.length || !flights.return?.length) return null;

  const renderFlightCard = (flight) => (
    <div
      key={`${flight.company}-${flight.date}-${flight.from}`}
      className="bg-muted rounded-xl shadow-md p-4 md:p-6 text-white w-full max-w-md flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm bg-secondary text-black px-2 py-1 rounded-full font-semibold">
            {flight.type}
          </span>
          <span className="text-sm text-gray-300">{flight.date}</span>
        </div>
        <h3 className="text-lg font-bold text-primary mb-1">{flight.company}</h3>
        <p className="text-sm text-gray-300 mb-1">{flight.from} → {flight.to}</p>
        <p className="text-sm text-gray-300 mb-1">Durée : <strong>{flight.duration}</strong></p>
        <p className="text-sm text-gray-300 mb-1">
          Escale{flight.stops > 1 ? "s" : ""} : {flight.stops}
          {flight.stops === 0 && (
            <span className="ml-2 inline-block text-xs bg-green-600 px-2 py-0.5 rounded-full text-white font-medium">
              Direct
            </span>
          )}
        </p>
        <p className="text-lg font-semibold text-white mt-2">{flight.price} €</p>
      </div>
      {flight.link ? (
        <a
            href={flight.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-secondary hover:text-black transition text-center justify-center"
        >
            Réserver
            <ArrowRight size={16} />
        </a>
        ) : (
        <button
            disabled
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-not-allowed opacity-60"
        >
            Lien indisponible
        </button>
        )}

    </div>
  );

  return (
    <section className="bg-card rounded-2xl p-4 md:p-10 shadow-lg">
      <h2 className="text-2xl font-bold text-secondary mb-6">Vols conseillés</h2>

      {/* Vol Aller */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <PlaneTakeoff className="text-primary" size={20} />
          <h3 className="text-xl font-semibold text-white">Aller</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {flights.outbound.map(renderFlightCard)}
        </div>
      </div>

      {/* Vol Retour */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <PlaneLanding className="text-primary" size={20} />
          <h3 className="text-xl font-semibold text-white">Retour</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {flights.return.map(renderFlightCard)}
        </div>
      </div>
    </section>
  );
}
