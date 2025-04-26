import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import { loadStripe } from "@stripe/stripe-js";
import { FaStar } from "react-icons/fa"; // icône moderne

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
    <div className="flex flex-col items-center justify-center p-6">
      <div className="bg-card rounded-2xl shadow-lg p-8 max-w-lg w-full text-center border border-white/10">
        <div className="flex justify-center mb-6">
          <FaStar className="text-primary" size={48} />
        </div>

        <h1 className="text-3xl font-extrabold text-text mb-4">Espace Premium</h1>
        
        <p className="text-secondary text-lg mb-6">
          {isPremium
            ? "Tu es déjà Premium. Merci pour ton soutien !"
            : "Accède aux fonctionnalités avancées et crée des voyages illimités."}
        </p>

        {!isPremium && (
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-secondary transition disabled:bg-gray-400"
          >
            {checkoutLoading ? "Redirection..." : "Devenir Premium"}
          </button>
        )}

        {isPremium && (
          <p className="mt-4 text-alert font-semibold">
            Statut : Premium Activé
          </p>
        )}
      </div>
    </div>
  );
}
