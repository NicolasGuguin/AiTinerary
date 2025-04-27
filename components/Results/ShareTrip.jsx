import { useState, useRef } from "react";
import { FaLink, FaShareAlt, FaInstagram, FaDownload } from "react-icons/fa";
import html2canvas from "html2canvas";
import StoryMap from "./StoryMap"; // 🌟 On utilise un composant StoryMap corrigé

export default function ShareTrip({ tripId, tripData, trajets }) {
  const [copied, setCopied] = useState(false);
  const [storyReady, setStoryReady] = useState(false);
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
    } catch (error) {
      console.error("Erreur création Story", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalDistance = trajets.reduce((sum, t) => sum + t.distance, 0);
  const stepsSummary = tripData.steps.slice(0, 4).map((step) => {
    const city = tripData.cities.find((c) => c.id === step.cityId);
    return city?.name || step.cityId;
  });

  return (
    <section className="bg-card rounded-2xl p-6 md:p-10 shadow-lg space-y-6 relative">
      <h2 className="text-2xl font-bold text-secondary text-center">Partager votre aventure</h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
          onClick={() => setStoryReady(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white hover:brightness-110 transition font-semibold"
        >
          <FaInstagram />
          Prévisualiser la Story
        </button>
      </div>

      {/* Story Preview visible si demandé */}
      {storyReady && (
        <div className="mt-8 flex flex-col items-center gap-4">
            <div className="relative" style={{ width: "300px", height: "533px" }}>
                <div
                    ref={storyRef}
                    style={{
                    width: "1080px",
                    height: "1920px",
                    transform: "scale(0.2777)", // 300 / 1080
                    transformOrigin: "top left",
                    background: "linear-gradient(135deg, #141A2A, #F43F5E)",
                    color: "white",
                    padding: "80px 60px",
                    fontFamily: "'Poppins', sans-serif",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxSizing: "border-box",
                    }}
                >
              {/* En-tête */}
              <div className="text-5xl font-extrabold text-white drop-shadow-md text-center">
                🌍 Mon Aventure
              </div>

              {/* Centre : Map + Infos */}
              <div className="flex flex-col items-center space-y-8">
                <div className="text-3xl text-[#FDBA74] font-semibold text-center">
                  {tripData.countries?.join(", ")}
                </div>

                <div className="w-full h-[400px]">
                  <StoryMap steps={tripData.steps} cities={tripData.cities} />
                </div>

                <div className="text-center space-y-2 mt-6">
                  <div className="text-xl">{tripData.startDate} — {tripData.steps.length} jours</div>
                  <div className="text-lg">{Math.round(totalDistance)} km parcourus</div>
                  <div className="text-md text-white/80">{stepsSummary.join(" ➔ ")}</div>
                </div>
              </div>

              {/* Bas : Lien */}
              <div className="text-center text-sm opacity-80">
                Généré avec <strong>AiTinerary</strong> 🚀<br />
                aitinerary-webapp.vercel.app
              </div>
            </div>
          </div>

          <button
            onClick={handleCreateStory}
            disabled={isGenerating}
            className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-secondary hover:text-black transition font-semibold flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Génération...
              </>
            ) : (
              <>
                <FaDownload /> Télécharger la Story
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
