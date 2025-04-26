export default async function handler(req, res) {
  const debugLogs = [];

  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const query = searchParams.get("query");

    debugLogs.push(`🌍 [API] getImage appelée avec query: "${query}"`);

    if (!query) {
      debugLogs.push("🚫 [API] Query manquante");
      return res.status(400).json({ error: "Missing query", debug: debugLogs });
    }

    const getRandomItem = (array) => {
      if (!array || array.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
    };

    // --- Pexels ---
    try {
      debugLogs.push("🔵 [API] Tentative Pexels...");
      const pexelsRes = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3`, {
        headers: { Authorization: `Bearer ${process.env.PEXELS_API_KEY || ''}` },
      });

      if (pexelsRes.ok) {
        const pexelsData = await pexelsRes.json();
        const photo = getRandomItem(pexelsData.photos);
        const url = photo?.src?.medium;
        if (url) {
          debugLogs.push(`✅ [API] Image trouvée via Pexels: ${url}`);
          return res.status(200).json({ url, debug: debugLogs });
        }
        debugLogs.push("⚠️ [API] Pexels OK mais pas d'image trouvée");
      } else {
        debugLogs.push(`⚠️ [API] Pexels erreur HTTP ${pexelsRes.status}`);
      }
    } catch (pexelsError) {
      debugLogs.push(`❌ [API] Erreur Pexels: ${pexelsError}`);
    }

    // --- Pixabay (Avant Unsplash) ---
    try {
      debugLogs.push("🟢 [API] Tentative Pixabay...");
      const pixabayRes = await fetch(`https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY || ''}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`);

      if (pixabayRes.ok) {
        const pixabayData = await pixabayRes.json();
        const photo = getRandomItem(pixabayData.hits);
        const url = photo?.webformatURL;
        if (url) {
          debugLogs.push(`✅ [API] Image trouvée via Pixabay: ${url}`);
          return res.status(200).json({ url, debug: debugLogs });
        }
        debugLogs.push("⚠️ [API] Pixabay OK mais pas d'image trouvée");
      } else {
        debugLogs.push(`⚠️ [API] Pixabay erreur HTTP ${pixabayRes.status}`);
      }
    } catch (pixabayError) {
      debugLogs.push(`❌ [API] Erreur Pixabay: ${pixabayError}`);
    }

    // --- Unsplash (Après Pixabay) ---
    try {
      debugLogs.push("🟠 [API] Tentative Unsplash...");
      const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3`, {
        headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY || ''}` },
      });

      if (unsplashRes.ok) {
        const unsplashData = await unsplashRes.json();
        const photo = getRandomItem(unsplashData.results);
        const url = photo?.urls?.regular;
        if (url) {
          debugLogs.push(`✅ [API] Image trouvée via Unsplash: ${url}`);
          return res.status(200).json({ url, debug: debugLogs });
        }
        debugLogs.push("⚠️ [API] Unsplash OK mais pas d'image trouvée");
      } else {
        debugLogs.push(`⚠️ [API] Unsplash erreur HTTP ${unsplashRes.status}`);
      }
    } catch (unsplashError) {
      debugLogs.push(`❌ [API] Erreur Unsplash: ${unsplashError}`);
    }

    // --- Fallback ---
    debugLogs.push("🚨 [API] Fallback utilisé");
    return res.status(200).json({ url: "https://source.unsplash.com/400x300/?travel,tourism", debug: debugLogs });

  } catch (globalError) {
    debugLogs.push(`❌ [API] Erreur globale: ${globalError}`);
    return res.status(500).json({ error: "Server error", debug: debugLogs });
  }
}
