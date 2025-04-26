import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function PremiumSuccess() {
  const user = useUser();
  const [upgraded, setUpgraded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function upgradeUser() {
      if (user === undefined) {
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ isPremium: true })
        .eq('id', user.id);

      if (error) {
        console.error('Erreur lors de la mise à jour du statut Premium :', error);
      } else {
        setUpgraded(true);
      }

      setLoading(false);
    }

    upgradeUser();
  }, [user]);

  if (user === undefined || loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-secondary text-lg">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="bg-card rounded-2xl shadow-lg p-8 max-w-lg w-full text-center border border-white/10">
          <FaExclamationTriangle size={48} className="text-alert mb-4" />
          <h1 className="text-3xl font-bold text-text mb-4">Connexion requise</h1>
          <p className="text-secondary text-lg mb-6">Merci de te reconnecter pour valider ton statut Premium.</p>
          <a
            href="/login"
            className="px-6 py-3 bg-primary rounded-xl font-semibold text-white hover:bg-secondary transition"
          >
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="bg-card rounded-2xl shadow-lg p-8 max-w-lg w-full text-center border border-white/10">
        {upgraded ? (
          <>
            <FaCheckCircle size={48} className="text-primary mb-4" />
            <h1 className="text-3xl font-bold text-text mb-4">Bienvenue parmi les Premiums</h1>
            <p className="text-secondary text-lg mb-6">Merci pour ton soutien précieux.</p>
            <a
              href="/"
              className="px-6 py-3 bg-primary rounded-xl font-semibold text-white hover:bg-secondary transition"
            >
              Retour à l'accueil
            </a>
          </>
        ) : (
          <>
            <FaExclamationTriangle size={48} className="text-alert mb-4" />
            <h1 className="text-3xl font-bold text-text mb-4">Mise à jour échouée</h1>
            <p className="text-secondary text-lg">Une erreur est survenue. Contacte-nous si besoin.</p>
          </>
        )}
      </div>
    </div>
  );
}
