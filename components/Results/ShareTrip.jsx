import { useState, useRef } from "react";
import { FaLink, FaShareAlt, FaInstagram, FaDownload, FaTimes } from "react-icons/fa";
import html2canvas from "html2canvas";

export default function ShareTrip({ tripId, tripData }) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [storyGenerating, setStoryGenerating] = useState(false);
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
    setShowPreview(true);
  };

  const handleDownloadStory = async () => {
    if (!storyRef.current) return;
    try {
      setStoryGenerating(true);
      const canvas = await html2canvas(storyRef.current, {
        useCORS: true,
        backgroundColor: "#141A2A",
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = "story-voyage.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Erreur création Story", error);
      alert("Erreur pendant la création de la Story 😢");
    } finally {
      setStoryGenerating(false);
      setShowPreview(false);
    }
  };

  const stepsSummary = tripData.steps.slice(0, 4).map((step) => {
    const city = tripData.cities.find((c) => c.id === step.cityId);
    return city?.name || step.cityId;
  });

  return (
    <section className="bg-card rounded-2xl p-6 md:p-10 shadow-lg space-y-6 relative text-center">
      <h2 className="text-2xl font-bold text-secondary mb-4">Partager votre aventure</h2>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
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

      {/* Preview de Story */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl overflow-hidden relative shadow-2xl w-full max-w-[400px] aspect-[9/16]">
            <div className="h-full w-full" ref={storyRef} style={{
              background: "linear-gradient(135deg, #141A2A, #F43F5E)",
              padding: "40px 30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              fontFamily: "'Poppins', sans-serif",
              color: "white",
            }}>
              <div className="text-3xl font-extrabold">
                🌍 Mon Aventure
              </div>

              <div className="space-y-4">
                <div className="text-xl text-[#FDBA74] font-bold">
                  {tripData.countries?.join(", ")}
                </div>
                <div className="text-lg font-semibold">
                  {stepsSummary.join(" ➔ ")}
                </div>
                <div className="mt-4 text-sm opacity-80">
                  {tripData.startDate} – {tripData.steps.length} jours
                </div>
              </div>

              <div className="text-sm text-center opacity-60">
                ✈️ Généré avec <span className="font-bold">AiTinerary</span>
              </div>
            </div>
          </div>

          {/* Boutons Action */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleDownloadStory}
              disabled={storyGenerating}
              className="flex items-center gap-2 px-5 py-3 bg-primary rounded-xl text-white hover:bg-secondary hover:text-black font-semibold transition disabled:opacity-50 disabled:cursor-wait"
            >
              <FaDownload />
              {storyGenerating ? "Création..." : "Télécharger"}
            </button>

            <button
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2 px-5 py-3 bg-gray-300 rounded-xl text-black hover:bg-gray-400 font-semibold transition"
            >
              <FaTimes />
              Annuler
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
