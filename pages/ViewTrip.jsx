import { useParams } from "react-router-dom";

export default function ViewTrip() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Voyage #{id}</h2>
      <p>Affichage du voyage sélectionné à venir...</p>
    </div>
  );
}