import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setErrorMsg(error.message);
    navigate("/"); // Redirige une fois connecté
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) setErrorMsg(error.message);
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4">
      <div className="bg-card shadow-xl p-8 rounded-2xl w-full max-w-md space-y-6 text-white">
        <h1 className="text-3xl font-extrabold text-center text-primary">Connexion</h1>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-background border border-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-background border border-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-primary text-white hover:bg-secondary hover:text-black font-semibold transition"
          >
            Se connecter
          </button>
        </form>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-gray-400">ou</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 rounded-xl bg-white text-black font-semibold shadow hover:bg-gray-100 transition"
        >
          Continuer avec Google
        </button>

        {errorMsg && <p className="text-sm text-red-500 text-center">{errorMsg}</p>}
      </div>
    </div>
  );
}
