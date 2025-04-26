import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import { loadStripe } from "@stripe/stripe-js";

// Charge Stripe avec ta clé publique (PAS la clé secrète ici !)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // si tu utilises Vite
// ou hardcodé temporairement :
// const stripePromise = loadStripe("pk_test_...");

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
  
      console.log("Fetching profile for user:", user.id);
  
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
  
      console.log("Data:", data);
      console.log("Error:", error);
  
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

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Espace Premium</h1>

      <div className="text-lg mb-6">
        {isPremium
          ? "🎉 Tu es déjà Premium ! Merci infiniment pour ton soutien 🚀"
          : "Tu n'es pas encore Premium. Deviens-le pour débloquer toutes les fonctionnalités ✨"}
      </div>

      {!isPremium && (
        <button
          onClick={handleCheckout}
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400"
          disabled={checkoutLoading}
        >
          {checkoutLoading ? "Redirection en cours..." : "Devenir Premium"}
        </button>
      )}
    </div>
  );
}
