import { useState, useRef } from "react";
import { FaLink, FaShareAlt, FaInstagram, FaTimes, FaDownload } from "react-icons/fa";
import html2canvas from "html2canvas";

export default function ShareTrip({ tripId, tripData }) {
  const [copied, setCopied] = useState(false);
  const [loadingStory, setLoadingStory] = useState(false);
  const [storyImage, setStoryImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
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
    setLoadingStory(true);
    storyRef.current.style.display = "block"; // Affiche la story temporairement

    try {
      const canvas = await html2canvas(storyRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
      });
      const dataUrl = canvas.toDataURL("image/png");
      setStoryImage(dataUrl);
      setShowPreview(true);
    } catch (err) {
      console.error("Erreur création Story", err);
      alert("Erreur lors de la création de la Story.");
    } finally {
      setLoadingStory(false);
      storyRef.current.style.display = "none"; // Cache à nouveau
    }
  };

  const handleDownloadStory = () => {
    if (!storyImage) return;
    const link = document.createElement("a");
    link.href = storyImage;
    link.download = "story-voyage.png";
    link.click();
  };

  const stepsSummary = tripData.steps.slice(0, 4).map((step) => {
    const city = tripData.cities.find((c) => c.id === step.cityId);
    return city?.name || step.cityId;
  });

  return (
    <section className="bg-card rounded-2xl p-6 md:p-10 shadow-lg space-y-6 relative">
      <h2 className="text-2xl font-bold text-secondary">Partager votre aventure</h2>

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
          onClick={handleCreateStory}
          disabled={loadingStory}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white hover:brightness-110 transition font-semibold disabled:opacity-50"
        >
          {loadingStory ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FaInstagram />
          )}
          {loadingStory ? "Création..." : "Créer une Story"}
        </button>
      </div>

      {/* Hidden Story */}
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

      {/* Modal Preview */}
      {showPreview && storyImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade">
          <div className="relative bg-[#121827] rounded-2xl shadow-lg overflow-hidden w-full max-w-[400px] p-4 space-y-4">
            <img src={storyImage} alt="Story Preview" className="rounded-xl w-full" />
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDownloadStory}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-secondary hover:text-black transition"
              >
                <FaDownload />
                Télécharger
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-red-500 transition"
              >
                <FaTimes />
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
