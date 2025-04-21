import { useState, useEffect, useRef } from "react";
import { useMapContext } from "../../context/MapContext";
import { motion } from "framer-motion";
import { apiKeys } from "../../config/apiKeys";

export default function DailyCardsCarousel({ steps, cities, tripData }) {
  const { isFullscreen } = useMapContext();
  const AUTO_SCROLL = true;
  const AUTO_SCROLL_INTERVAL = 10000;
  const API_KEY = apiKeys.pexels;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesMap, setImagesMap] = useState({});
  const CARD_WIDTH = 260 + 24; // 260px + 24px de gap

  const getCityById = (id) => cities.find((c) => c.id === id);

  // Chargement des images
  useEffect(() => {
    const uniqueCityIds = [...new Set(steps.map((step) => step.cityId))];
  
    uniqueCityIds.forEach((cityId) => {
      const city = getCityById(cityId);
      if (!city || imagesMap[city.name]) return;

      const page = Math.floor(Math.random() * 3) + 1; // page 1 à 3
      const country = tripData.countries[0];      
      const query = `${city.name} ${country || ""} travel`;
      fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&page=${page}`, {
      
        headers: { Authorization: API_KEY },
      })
        .then((res) => res.json())
        .then((data) => {
          const photos = data.photos || [];
          const randomIndex = Math.floor(Math.random() * photos.length);
          const url = photos[randomIndex]?.src?.medium || "https://source.unsplash.com/400x300/?travel,tourism";
          setImagesMap((prev) => ({ ...prev, [city.name]: url }));
        })
        .catch(() => {
          setImagesMap((prev) => ({
            ...prev,
            [city.name]: "https://source.unsplash.com/400x300/?travel,tourism",
          }));
        });
    });
  }, [steps, cities, imagesMap]);
  
  

  // Auto scroll
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
            const imageUrl = imagesMap[city.name] || "https://source.unsplash.com/400x300/?travel,nature";

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
                <div className="h-40 w-full rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-primary to-secondary">
                  <img src={imageUrl} alt={city.name} className="object-cover h-full w-full" />
                </div>
                <h3 className="text-secondary text-sm font-semibold mb-1">Jour {step.day}</h3>
                <p className="text-lg font-bold text-white mb-1">{city.name}</p>
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
                className={`w-2.5 h-2.5 rounded-full ${
                  i === currentIndex ? "bg-primary" : "bg-gray-500"
                } transition-all duration-300`}
              />
            ))}
          </div>
        ) : (
          <div className="w-1/2 h-2 bg-gray-800 rounded-full overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
              style={{
                width: `${(currentIndex / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
