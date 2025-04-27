import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import { loadStripe } from "@stripe/stripe-js";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion"; // 🌀 ajoute framer-motion pour l'animation

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function PremiumPage() {
  const user = useUser();
  const [isPremium, setIsPremium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erreur en récupérant le profil:', error);
      } else {
        setIsPremium(data.isPremium);
      }
      setLoading(false);
    }

    fetchProfile();
  }, [user]);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    const stripe = await stripePromise;

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
    setCheckoutLoading(false);
  };

  if (loading) return <div className="flex justify-center items-center min-h-[50vh]">Chargement...</div>;

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center p-6 bg-background">
      {/* Animation de fond */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-primary/30 via-secondary/20 to-background opacity-30 blur-3xl z-0"></div>
  
      {/* Contenu premium */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-card rounded-2xl shadow-2xl p-8 w-full max-w-4xl text-center border border-white/10 z-10"
      >
        <div className="flex justify-center mb-6">
          <FaStar className="text-primary" size={48} />
        </div>

        <h1 className="text-4xl font-extrabold text-text mb-4">Passez en Premium</h1>

        <p className="text-secondary text-lg mb-10">
          Voyagez plus loin, plus vite et sans limites.<br />
          Débloquez toute la puissance d'AiTinerary en un seul clic.
        </p>

        {/* Tableau comparatif */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left border-collapse text-sm md:text-base">
            <thead>
              <tr className="text-primary border-b border-white/10">
                <th className="p-3">Fonctionnalité</th>
                <th className="p-3">Gratuit</th>
                <th className="p-3">Premium</th>
              </tr>
            </thead>
            <tbody className="text-secondary">
              <tr className="border-b border-white/5">
                <td className="p-3">Création de voyage simple</td>
                <td className="p-3">✔️</td>
                <td className="p-3">✔️</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3">Nombre de voyages</td>
                <td className="p-3">Limité à 1</td>
                <td className="p-3">Illimité</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3">Personnalisation avancée</td>
                <td className="p-3">❌</td>
                <td className="p-3">✔️</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3">Accès prioritaire aux nouveautés</td>
                <td className="p-3">❌</td>
                <td className="p-3">✔️</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3">Support prioritaire</td>
                <td className="p-3">❌</td>
                <td className="p-3">✔️</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-3">Modèle IA utilisé</td>
                <td className="p-3">GPT-3.5</td>
                <td className="p-3">GPT-4.0</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Prix */}
        {!isPremium && (
          <div className="mb-6 text-lg font-bold text-primary">
            Seulement 3€ pour débloquer tout le potentiel ✨
          </div>
        )}

        {/* Call to action */}
        {!isPremium ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="px-10 py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-secondary transition disabled:bg-gray-400"
          >
            {checkoutLoading ? "Redirection..." : "Devenir Premium"}
          </motion.button>
        ) : (
          <p className="mt-4 text-alert font-semibold">
            Statut : Premium Activé
          </p>
        )}
      </motion.div>
    </div>
  );
}
