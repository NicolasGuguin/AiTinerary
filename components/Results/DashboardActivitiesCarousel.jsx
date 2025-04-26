import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { apiKeys } from "../../config/apiKeys";

export default function DashboardActivitesCarousel({ steps, activities, cities }) {
  const fallbackImage = "https://source.unsplash.com/400x300/?travel,tourism";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesMap, setImagesMap] = useState({});
  const [loadedIds, setLoadedIds] = useState(new Set());
  const [loadingIds, setLoadingIds] = useState(new Set());
  const CARD_WIDTH = 260 + 24;
  const visibleBuffer = 2;

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

  const buildQuery = (activity) => {
    const base = `${activity.id} ${activity.cityName}`;
    return base
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      + " travel";
  };

  useEffect(() => {
    const preloadImages = async () => {
      const toLoad = [];

      for (let i = currentIndex - visibleBuffer; i <= currentIndex + visibleBuffer; i++) {
        const realIndex = (i + allActivities.length) % allActivities.length;
        const activity = allActivities[realIndex];
        if (!activity) continue;
        if (!loadedIds.has(activity.id) && !loadingIds.has(activity.id)) {
          toLoad.push(activity);
        }
      }

      for (const activity of toLoad) {
        const query = buildQuery(activity);
        const cacheKey = `activity_image_${activity.id}`;

        setLoadingIds(prev => new Set(prev).add(activity.id));

        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            console.log(`📦 [CACHE] Activité "${activity.title}" chargée du cache.`);
            setImagesMap((prev) => ({ ...prev, [activity.id]: parsed.url }));
            setLoadedIds(prev => new Set(prev).add(activity.id));
            setLoadingIds(prev => {
              const next = new Set(prev);
              next.delete(activity.id);
              return next;
            });
            continue;
          }
        }

        try {
          console.log(`🔍 [FETCH] Recherche d'image pour "${activity.title}"...`);
          const res = await fetch(`/api/getImage?query=${encodeURIComponent(query)}`);
          const data = await res.json();
          const url = data?.url || fallbackImage;

          console.log(`✅ [OK] Image trouvée pour "${activity.title}" :`, url);
          setImagesMap((prev) => ({ ...prev, [activity.id]: url }));
          setLoadedIds(prev => new Set(prev).add(activity.id));

          localStorage.setItem(cacheKey, JSON.stringify({
            url: url,
            timestamp: Date.now(),
          }));
        } catch (error) {
          console.error(`❌ [ERREUR] Impossible de charger "${activity.title}"`, error);
          setImagesMap((prev) => ({ ...prev, [activity.id]: fallbackImage }));
          setLoadedIds(prev => new Set(prev).add(activity.id));
        } finally {
          setLoadingIds(prev => {
            const next = new Set(prev);
            next.delete(activity.id);
            return next;
          });
        }
      }
    };

    preloadImages();
  }, [currentIndex, allActivities]);

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
            const imageUrl = imagesMap[activity.id] || fallbackImage;
            const isLoading = loadingIds.has(activity.id);

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
                <div className="relative h-40 w-full rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-primary to-secondary">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={imageUrl}
                    alt={activity.title}
                    className={`object-cover h-full w-full transition-all duration-500 ${
                      isLoading ? "blur-md grayscale" : "blur-0 grayscale-0"
                    }`}
                  />
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
