import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="bg-black/30 backdrop-blur-md px-6 py-3 flex flex-wrap justify-between items-center text-white shadow-md z-50">
      <Link to="/" className="text-2xl font-extrabold text-primary tracking-tight">
        AiTinerary
      </Link>

      <nav className="flex items-center gap-6 text-sm sm:text-base">
        <Link to="/create" className="text-secondary hover:text-white transition-all">
          Créer un voyage
        </Link>
        {user && (
          <Link to="/my-trips" className="text-secondary hover:text-white transition-all">
            Mes voyages
          </Link>
        )}
        <Link to="/" className="text-secondary hover:text-white transition-all">
          Accueil
        </Link>
      </nav>

      <div className="flex items-center gap-3 mt-2 sm:mt-0">
        {!user ? (
          <>
            <Link
              to="/login"
              className="text-sm px-4 py-1.5 rounded-xl border border-secondary text-secondary hover:bg-secondary hover:text-black transition-all"
            >
              Se connecter
            </Link>
            <Link
              to="/signup"
              className="text-sm px-4 py-1.5 rounded-xl bg-primary text-white hover:bg-secondary hover:text-black transition-all"
            >
              S’inscrire
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-300 hidden sm:inline">
               {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-1.5 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            >
              Se déconnecter
            </button>
          </>
        )}
      </div>
    </header>
  );
}
