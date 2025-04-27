import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-card text-secondary py-8 mt-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Logo ou nom */}
        <div className="text-primary text-2xl font-bold">
          AiTinerary
        </div>

        {/* Liens rapides */}
        <div className="flex flex-wrap gap-6 text-sm md:text-base justify-center">
          <Link to="/" className="hover:text-primary transition">Accueil</Link>
          <Link to="/create" className="hover:text-primary transition">Créer un Voyage</Link>
          <Link to="/my-trips" className="hover:text-primary transition">Mes Voyages</Link>
          <Link to="/premium" className="hover:text-primary transition">Premium</Link>
          <a href="n.guguin@gmail.com" className="hover:text-primary transition">Contact</a>
          <Link to="/legal" className="hover:text-primary transition">Mentions légales</Link>
          <Link to="/privacy-policy" className="hover:text-primary transition">Politique de confidentialité</Link>
          <Link to="/terms-of-use" className="hover:text-primary transition">CGU</Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} AiTinerary — Tous droits réservés
        </div>
      </div>
    </footer>
  );
}
