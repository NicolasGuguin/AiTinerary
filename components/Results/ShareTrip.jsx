// components/Results/ShareTrip.jsx
import { useState, useRef } from "react";
import { FaLink, FaShareAlt, FaInstagram } from "react-icons/fa";
import html2canvas from "html2canvas";
import StoryMap from "./StoryMap";

export default function ShareTrip({ tripId, tripData }) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const storyRef = useRef(null);

  const shareUrl = `${window.location.origin}/results/${tripId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Découvre mon voyage !",
          text: "Regarde ce super itinéraire 🧭",
          url: shareUrl,
        });
      } catch (err) {
        console.error("Erreur partage natif", err);
      }
    } else {
      alert("Le partage natif n'est pas disponible sur ce navigateur.");
    }
  };

  const handleCreateStory = async () => {
    if (!storyRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(storyRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = "story-voyage.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Erreur création Story", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const stepsSummary = tripData.steps.slice(0, 4).map((step) => {
    const city = tripData.cities.find((c) => c.id === step.cityId);
    return city?.name || step.cityId;
  });

  const totalDistance = tripData.trajets.reduce((sum, t) => sum + t.distance, 0);
  const roundedDistance = Math.round(totalDistance);

  return (
    <section className="bg-card rounded-2xl p-6 md:p-10 shadow-lg space-y-8 relative">
      <h2 className="text-2xl font-bold text-secondary">Partager votre aventure</h2>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:bg-secondary hover:text-black transition font-semibold"
        >
          <FaLink />
          {copied ? "Lien copié !" : "Copier le lien"}
        </button>

        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-black hover:bg-primary hover:text-white transition font-semibold"
        >
          <FaShareAlt />
          Partager
        </button>

        <button
          onClick={handleCreateStory}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white transition font-semibold ${isGenerating ? "opacity-50 pointer-events-none" : ""}`}
        >
          <FaInstagram />
          {isGenerating ? "Création..." : "Créer une Story"}
        </button>
      </div>

      {/* 🔥 Preview visible maintenant */}
      <div className="border-2 border-dashed border-gray-600 rounded-2xl overflow-hidden mt-8 shadow-lg bg-black">
        <div
          ref={storyRef}
          style={{
            width: "360px",
            height: "640px",
            background: "linear-gradient(135deg, #141A2A, #F43F5E)",
            color: "white",
            padding: "20px",
            fontFamily: "'Poppins', sans-serif",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="text-center">
            <h1 className="text-3xl font-extrabold mb-2">🌍 Mon Aventure</h1>
            <p className="text-[#FDBA74]">{tripData.countries?.join(", ")}</p>
          </div>

          <div className="w-full flex-1 flex items-center justify-center px-2">
            <StoryMap steps={tripData.steps} cities={tripData.cities} />
          </div>

          <div className="text-center space-y-2 text-sm opacity-90 mt-4">
            <p>{tripData.steps.length} jours • {roundedDistance} km</p>
            <p className="text-xs opacity-70">aitinerary-webapp.vercel.app</p>
          </div>
        </div>
      </div>
    </section>
  );
}
