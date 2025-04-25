export default async function handler(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url || "");
  
    const query = searchParams.get('query');
    const per_page = searchParams.get('per_page') || '3';
  
    if (!query) {
      return new Response(JSON.stringify({ error: 'Missing query parameter' }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${per_page}`, {
        headers: {
          Authorization: `Bearer ${process.env.VITE_PEXELS_API_KEY!}`,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        return new Response(JSON.stringify({ error: errorText }), {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
  
    } catch (error) {
      console.error("Erreur serveur Pexels:", error);
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  