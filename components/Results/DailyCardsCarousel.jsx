import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { apiKeys } from "../../config/apiKeys";

export default function DailyCardsCarousel({ steps, cities, tripData, isFullscreen }) {
  const AUTO_SCROLL = true;
  const AUTO_SCROLL_INTERVAL = 10000;
  const fallbackImage = "https://source.unsplash.com/400x300/?travel,tourism";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesMap, setImagesMap] = useState({});
  const [loadingCities, setLoadingCities] = useState(new Set());
  const pendingLoads = useRef(new Set());

  const CARD_WIDTH = 260 + 24;

  const getCityById = (id) => cities.find((c) => c.id === id);

  useEffect(() => {
    const loadImages = async () => {
      const uniqueCityIds = [...new Set(steps.map((step) => step.cityId))];

      for (const cityId of uniqueCityIds) {
        const city = getCityById(cityId);
        if (!city) continue;

        const cityName = city.name;
        const cacheKey = `city_image_${cityName}`;

        if (imagesMap[cityName] || pendingLoads.current.has(cityName)) continue;

        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            console.log(`📦 [CACHE] Ville "${cityName}" chargée du cache.`);
            setImagesMap((prev) => ({ ...prev, [cityName]: parsed.url }));
            continue;
          }
        }

        try {
          pendingLoads.current.add(cityName);
          setLoadingCities(prev => new Set(prev).add(cityName));

          const country = tripData.countries[0];
          const query = `${cityName} ${country}`.trim();
          console.log(`🔍 [FETCH] Image pour "${cityName}"...`);

          const res = await fetch(`/api/getImage?query=${encodeURIComponent(query)}`);
          const data = await res.json();
          const url = data?.url || fallbackImage;

          console.log(`✅ [OK] Image trouvée pour "${cityName}" :`, url);
          setImagesMap((prev) => ({ ...prev, [cityName]: url }));

          localStorage.setItem(cacheKey, JSON.stringify({
            url,
            timestamp: Date.now(),
          }));
        } catch (error) {
          console.error(`❌ [ERROR] Ville "${cityName}"`, error);
          setImagesMap((prev) => ({ ...prev, [cityName]: fallbackImage }));

          localStorage.setItem(cacheKey, JSON.stringify({
            url: fallbackImage,
            timestamp: Date.now(),
          }));
        } finally {
          pendingLoads.current.delete(cityName);
          setLoadingCities(prev => {
            const next = new Set(prev);
            next.delete(cityName);
            return next;
          });
        }
      }
    };

    loadImages();
  }, [steps, cities, tripData]);

  useEffect(() => {
    if (!AUTO_SCROLL || isFullscreen) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % steps.length);
    }, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(interval);
  }, [steps.length, isFullscreen]);

  const scroll = (dir) => {
    setCurrentIndex((prev) =>
      dir === "left" ? (prev - 1 + steps.length) % steps.length : (prev + 1) % steps.length
    );
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -100) scroll("right");
    else if (info.offset.x > 100) scroll("left");
  };

  return (
    <div className="relative w-full overflow-hidden pt-6">
      {!isFullscreen && (
        <>
          <button onClick={() => scroll("left")} className="absolute top-1/2 -translate-y-1/2 left-2 z-20 bg-primary text-white px-3 py-2 rounded-full shadow-lg hover:bg-secondary hover:text-black transition-all">
            ◀
          </button>
          <button onClick={() => scroll("right")} className="absolute top-1/2 -translate-y-1/2 right-2 z-20 bg-primary text-white px-3 py-2 rounded-full shadow-lg hover:bg-secondary hover:text-black transition-all">
            ▶
          </button>
        </>
      )}

      <div className="overflow-hidden px-2 sm:px-6 md:px-12 mx-auto">
        <motion.div
          className="flex gap-6"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={{ x: -CARD_WIDTH * currentIndex }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          {steps.map((step, index) => {
            const city = getCityById(step.cityId);
            if (!city) return null;

            const isCenter = index === currentIndex;
            const cityName = city.name;
            const imageUrl = imagesMap[cityName] || fallbackImage;
            const isLoading = loadingCities.has(cityName);

            return (
              <motion.div
                key={`${city.id}-${index}`}
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
                    alt={cityName}
                    className={`object-cover h-full w-full transition-all duration-500 ${
                      isLoading ? "blur-md grayscale" : "blur-0 grayscale-0"
                    }`}
                  />
                </div>
                <h3 className="text-secondary text-sm font-semibold mb-1">Jour {step.day}</h3>
                <p className="text-lg font-bold text-white mb-1">{cityName}</p>
                {step.activities && step.activities.length > 0 && (
                  <ul className="text-sm text-gray-300 list-disc list-inside space-y-1 mt-2">
                    {step.activities.map((activity, idx) => (
                      <li key={idx}>{activity}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="flex justify-center mt-4">
        {steps.length <= 20 ? (
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${i === currentIndex ? "bg-primary" : "bg-gray-500"} transition-all duration-300`}
              />
            ))}
          </div>
        ) : (
          <div className="w-1/2 h-2 bg-gray-800 rounded-full overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
