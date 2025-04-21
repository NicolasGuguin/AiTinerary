import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      emoji: "🎯",
      title: "Itinéraires sur mesure",
      desc: "L'IA construit un programme optimisé selon tes envies, ton budget et ton rythme.",
    },
    {
      emoji: "🗺️",
      title: "Carte interactive",
      desc: "Visualise ton parcours, les villes visitées et les temps de transport.",
    },
    {
      emoji: "💸",
      title: "Réservation simplifiée",
      desc: "Accède aux meilleurs liens pour organiser facilement ton aventure.",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0B0F1A] to-[#141A2A] overflow-hidden px-6 py-20">
      {/* Halo animé */}
      <motion.div
        className="absolute w-[600px] h-[600px] bg-primary opacity-20 rounded-full blur-3xl top-[-150px] left-[-150px] z-0"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Hero */}
      <div className="relative z-10 max-w-3xl text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary drop-shadow-lg">
          ✈️ Bienvenue sur <span className="text-secondary">AiTinerary</span>
        </h1>
        <p className="text-white text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
          Génère ton itinéraire de voyage intelligent avec l’aide de l’IA. Personnalisé, stylé, et prêt à explorer.
        </p>
        <Link
          to="/create"
          className="inline-block mt-6 px-8 py-3 rounded-2xl bg-primary text-white text-lg font-semibold shadow-xl hover:bg-secondary hover:text-black transition-all"
        >
          Commencer mon voyage 🚀
        </Link>
      </div>

      {/* Fonctionnalités clés */}
      <div className="grid sm:grid-cols-3 gap-6 text-white mt-24 max-w-5xl mx-auto px-4 z-10">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl p-6 shadow-lg text-left hover:ring-1 hover:ring-primary transition-all"
          >
            <h3 className="text-xl font-bold mb-2 text-secondary">{f.emoji} {f.title}</h3>
            <p className="text-gray-300">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Call to action final */}
      <div className="mt-24 text-center text-white space-y-4 max-w-xl mx-auto z-10">
        <p className="text-sm uppercase tracking-widest text-secondary">Powered by GPT + Carto IA</p>
        <h3 className="text-2xl font-bold">Ton assistant personnel de voyage ✨</h3>
        <p className="text-gray-400 text-md">
          AiTinerary combine intelligence artificielle et design interactif pour créer ton voyage idéal.
        </p>
        <Link
          to="/create"
          className="inline-block mt-4 px-6 py-2 rounded-xl bg-secondary text-black font-semibold hover:bg-primary hover:text-white transition-all"
        >
          Démarrer maintenant
        </Link>
      </div>
    </div>
  );
}
