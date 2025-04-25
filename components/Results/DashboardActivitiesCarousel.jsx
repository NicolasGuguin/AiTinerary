import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiKeys } from "../../config/apiKeys";

export default function DashboardActivitesCarousel({ steps, activities, cities }) {
  const PEXELS_API_KEY  = apiKeys.pexels;
  const UNSPLASH_ACCESS_KEY = apiKeys.unsplash;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesMap, setImagesMap] = useState({});
  const CARD_WIDTH = 260 + 24;
  const fallbackImage = "https://source.unsplash.com/400x300/?travel,tourism";
  const getCityById = (id) => cities.find((c) => c.id === id);

  const allActivities = steps.flatMap((step) =>
    activities
      .filter((a) => a.stepDay === step.day)
      .map((activity) => ({
        ...activity,
        cityId: step.cityId,
        cityName: getCityById(step.cityId)?.name || "Inconnu",
      }))
  );

  function extractVisualKeywords(text) {
    if (!window.Intl || !Intl.Segmenter) return text;
  
    const segmenter = new Intl.Segmenter("fr", { granularity: "word" }); // "fr" = par défaut mais à terme dynamique
    const segments = Array.from(segmenter.segment(text.toLowerCase()));
  
    return segments
      .map(seg => seg.segment.trim())
      .filter(seg => seg && seg.length > 2 && !seg.match(/^[\d\W]+$/)) // ignore nombres, ponctuations
      .slice(0, 6) // limiter pour ne pas trop allonger la requête
      .join(" ");
  }

  function buildQuery(activity) {
    const base = `${activity.id} ${activity.cityName}`;
    const visualWords = extractVisualKeywords(base);
    return `${visualWords} travel`;
  }

  function cleanForPexels(text) {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // supprime les accents
      .replace(/[^a-zA-Z0-9 ]/g, "") // supprime les caractères spéciaux
      .trim();
  }
  
  
  

  // Récupération d’images Pexels
  useEffect(() => {
    allActivities.forEach((activity) => {
      if (imagesMap[activity.id]) return;
  
      const query = cleanForPexels(buildQuery(activity));
      const cacheKey = `pexels_activity_${activity.id}`;
  
      const cached = localStorage.getItem(cacheKey);
  
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) { // moins de 24h
          setImagesMap((prev) => ({ ...prev, [activity.id]: parsed.url }));
          return;
        }
      }
  
      fetch(`/api/pexels?query=${encodeURIComponent(query)}&per_page=3`)
        .then((res) => res.json())
        .then((pexelsData) => {
          const photos = pexelsData.photos || [];
          const random = photos[Math.floor(Math.random() * photos.length)];
          const url = random?.src?.medium || fallbackImage;
  
          setImagesMap((prev) => ({ ...prev, [activity.id]: url }));
  
          localStorage.setItem(cacheKey, JSON.stringify({
            url,
            timestamp: Date.now(),
          }));
        })
        .catch(() => {
          setImagesMap((prev) => ({
            ...prev,
            [activity.id]: fallbackImage,
          }));
  
          localStorage.setItem(cacheKey, JSON.stringify({
            url: fallbackImage,
            timestamp: Date.now(),
          }));
        });
    });
  }, [allActivities, imagesMap]);
  
  
  
  
  
  

  const scroll = (dir) => {
    setCurrentIndex((prev) =>
      dir === "left" ? (prev - 1 + allActivities.length) % allActivities.length : (prev + 1) % allActivities.length
    );
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -100) scroll("right");
    else if (info.offset.x > 100) scroll("left");
  };

  return (
    <div className="relative w-full overflow-hidden pt-6">
      <button
        onClick={() => scroll("left")}
        className="absolute top-1/2 -translate-y-1/2 left-2 z-20 bg-primary text-white px-3 py-2 rounded-full shadow-lg hover:bg-secondary hover:text-black transition-all"
      >
        ◀
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute top-1/2 -translate-y-1/2 right-2 z-20 bg-primary text-white px-3 py-2 rounded-full shadow-lg hover:bg-secondary hover:text-black transition-all"
      >
        ▶
      </button>

      <div className="overflow-hidden px-2 sm:px-6 md:px-12 mx-auto">
        <motion.div
          className="flex gap-6"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={{ x: -CARD_WIDTH * currentIndex }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          {allActivities.map((activity, index) => {
            const isCenter = index === currentIndex;
            const imageUrl = imagesMap[activity.id] || "https://source.unsplash.com/400x300/?travel";

            return (
              <motion.div
                key={activity.id}
                className="w-[260px] bg-card rounded-xl shadow-xl p-4 flex-shrink-0 origin-center"
                style={{
                  scale: isCenter ? 1.05 : 0.95,
                  opacity: isCenter ? 1 : 0.7,
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <div className="h-40 w-full rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-primary to-secondary">
                  <img src={imageUrl} alt={activity.title} className="object-cover h-full w-full" />
                </div>
                <h3 className="text-sm text-secondary font-semibold mb-1">
                  {activity.cityName} – Jour {activity.stepDay}
                </h3>
                <p className="text-lg font-bold text-white mb-1">{activity.title}</p>
                <p className="text-sm text-gray-400">{activity.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="flex justify-center mt-4">
        <div className="flex gap-1">
          {allActivities.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                i === currentIndex ? "bg-primary" : "bg-gray-500"
              } transition-all duration-300`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
