import { useState, useRef } from "react";
import { FaLink, FaShareAlt, FaInstagram } from "react-icons/fa";
import html2canvas from "html2canvas";

export default function ShareTrip({ tripId, tripData }) {
  const [copied, setCopied] = useState(false);
  const [storyGenerated, setStoryGenerated] = useState(false);
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

    const canvas = await html2canvas(storyRef.current, {
      useCORS: true,
      backgroundColor: null,
      scale: 2,
    });

    const link = document.createElement("a");
    link.download = "story-voyage.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    setStoryGenerated(true);
  };

  const stepsSummary = tripData.steps.slice(0, 4).map((step) => {
    const city = tripData.cities.find((c) => c.id === step.cityId);
    return city?.name || step.cityId;
  });

  return (
    <section className="bg-card rounded-2xl p-6 md:p-10 shadow-lg space-y-6 relative">
      <h2 className="text-2xl font-bold text-secondary">Partager votre aventure</h2>

      <div className="flex flex-col sm:flex-row items-center gap-4">
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
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white hover:brightness-110 transition font-semibold"
        >
          <FaInstagram />
          Créer une Story
        </button>
      </div>

      {/* 🔥 Story Preview cachée */}
      <div className="hidden">
        <div
          ref={storyRef}
          style={{
            width: "1080px",
            height: "1920px",
            background: "linear-gradient(135deg, #141A2A, #F43F5E)",
            color: "white",
            padding: "80px 60px",
            fontFamily: "'Poppins', sans-serif",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div className="text-4xl font-extrabold text-white drop-shadow-md">
            🌍 Mon Aventure
          </div>

          <div className="space-y-6">
            <div className="text-2xl text-[#FDBA74]">
              {tripData.countries?.join(", ")}
            </div>
            <div className="text-lg">
              {stepsSummary.join(" ➔ ")}
            </div>
            <div className="mt-6 text-sm opacity-80">
              {tripData.startDate} – {tripData.steps.length} jours
            </div>
          </div>

          <div className="text-sm text-center opacity-60">
            ✈️ Généré avec AiTinerary
          </div>
        </div>
      </div>
    </section>
  );
}
