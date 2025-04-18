import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-black/30 backdrop-blur-md p-4 flex justify-between items-center text-white">
      <Link to="/" className="text-xl font-bold text-primary">
        AiTinerary
      </Link>
      <nav className="space-x-4">
        <Link to="/create" className="text-secondary hover:underline">
          Créer un voyage
        </Link>
        <Link to="/" className="text-secondary hover:underline">
          Accueil
        </Link>
      </nav>
    </header>
  );
}