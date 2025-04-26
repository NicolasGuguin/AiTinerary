export default async function handler(req: Request): Promise<Response> {
    try {
      const { searchParams } = new URL(req.url);
      const query = searchParams.get("query");
  
      if (!query) {
        return new Response(JSON.stringify({ error: "Missing query parameter" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const perPage = 3;
  
      // Clés API à lire via process.env
      const PEXELS_API_KEY = process.env.VITE_PEXELS_API_KEY!;
      const UNSPLASH_ACCESS_KEY = process.env.VITE_UNSPLASH_ACCESS_KEY!;
      const PIXABAY_API_KEY = process.env.VITE_PIXABAY_API_KEY!;
  
      // 1. Essayer Pexels
      const pexelsRes = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`, {
        headers: {
          Authorization: `Bearer ${PEXELS_API_KEY}`,
        },
      });
  
      if (pexelsRes.ok) {
        const pexelsData = await pexelsRes.json();
        if (pexelsData.photos && pexelsData.photos.length > 0) {
          const random = pexelsData.photos[Math.floor(Math.random() * pexelsData.photos.length)];
          return new Response(JSON.stringify({ url: random.src.medium }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
  
      // 2. Sinon essayer Unsplash
      const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      });
  
      if (unsplashRes.ok) {
        const unsplashData = await unsplashRes.json();
        if (unsplashData.results && unsplashData.results.length > 0) {
          const random = unsplashData.results[Math.floor(Math.random() * unsplashData.results.length)];
          return new Response(JSON.stringify({ url: random.urls.small }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
  
      // 3. Sinon essayer Pixabay
      const pixabayRes = await fetch(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=${perPage}`);
  
      if (pixabayRes.ok) {
        const pixabayData = await pixabayRes.json();
        if (pixabayData.hits && pixabayData.hits.length > 0) {
          const random = pixabayData.hits[Math.floor(Math.random() * pixabayData.hits.length)];
          return new Response(JSON.stringify({ url: random.webformatURL }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
  
      // 4. Si rien trouvé => fallback d'urgence
      return new Response(JSON.stringify({ url: "https://source.unsplash.com/400x300/?travel,tourism" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  
    } catch (err) {
      console.error("Erreur getImage:", err);
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }