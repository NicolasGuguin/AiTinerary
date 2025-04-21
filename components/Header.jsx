import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-black/30 backdrop-blur-md px-6 py-3 flex flex-wrap justify-between items-center text-white shadow-md z-50">
      {/* Logo / titre */}
      <Link to="/" className="text-2xl font-extrabold text-primary tracking-tight">
        AiTinerary
      </Link>

      {/* Navigation principale */}
      <nav className="flex items-center gap-6 text-sm sm:text-base">
        <Link to="/create" className="text-secondary hover:text-white transition-all">
          Créer un voyage
        </Link>
        <Link to="/my-trips" className="text-secondary hover:text-white transition-all">
          Mes voyages
        </Link>
        <Link to="/" className="text-secondary hover:text-white transition-all">
          Accueil
        </Link>
      </nav>

      {/* Compte utilisateur */}
      <div className="flex items-center gap-3 mt-2 sm:mt-0">
        <button className="text-sm px-4 py-1.5 rounded-xl border border-secondary text-secondary hover:bg-secondary hover:text-black transition-all">
          Se connecter
        </button>
        <button className="text-sm px-4 py-1.5 rounded-xl bg-primary text-white hover:bg-secondary hover:text-black transition-all">
          S’inscrire
        </button>
      </div>
    </header>
  );
}
