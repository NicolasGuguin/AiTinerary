import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-black/30 backdrop-blur-md px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 text-white">
      <Link to="/" className="text-2xl font-extrabold text-primary">
        AiTinerary
      </Link>
      <nav className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm sm:text-base">
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
