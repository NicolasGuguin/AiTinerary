import { useState, useEffect } from "react";

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h en millisecondes

type CacheEntry = {
  url: string;
  timestamp: number;
};

export function usePexelsImage(query: string) {
  const [url, setUrl] = useState<string | null>(null);
  const fallbackUrl = "https://source.unsplash.com/400x300/?travel";

  useEffect(() => {
    if (!query) return;

    const cacheKey = `pexels_${query}`;

    const fetchImage = async () => {
      try {
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
          const parsed: CacheEntry = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            setUrl(parsed.url);
            return;
          }
        }

        const res = await fetch(`/api/pexels?query=${encodeURIComponent(query)}&per_page=3`);
        const data = await res.json();

        const photos = data.photos || [];
        const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
        const imageUrl = randomPhoto?.src?.medium || fallbackUrl;

        setUrl(imageUrl);

        localStorage.setItem(cacheKey, JSON.stringify({
          url: imageUrl,
          timestamp: Date.now(),
        }));

      } catch (err) {
        setUrl(fallbackUrl);
      }
    };

    fetchImage();
  }, [query]);

  return url;
}
