import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

export default function PremiumSuccess() {
  const user = useUser();
  const [upgraded, setUpgraded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function upgradeUser() {
      if (user === undefined) {
        // user n'est pas encore chargé par Supabase
        return;
      }

      if (!user) {
        // utilisateur non connecté
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
      <div className="p-6 text-center">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Connexion requise</h1>
        <p className="text-lg">Merci de te reconnecter pour valider ton statut Premium.</p>
        <a
          href="/login"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Se connecter
        </a>
      </div>
    );
  }

  return (
    <div className="p-6 text-center">
      {upgraded ? (
        <>
          <h1 className="text-3xl font-bold mb-4">Bienvenue parmi les Premiums 🎉</h1>
          <p className="text-lg">Merci pour ton soutien 🚀</p>
          <a
            href="/"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Retour à l'accueil
          </a>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">Mise à jour échouée ❌</h1>
          <p className="text-lg">Une erreur est survenue. Contacte-nous si besoin.</p>
        </>
      )}
    </div>
  );
}
