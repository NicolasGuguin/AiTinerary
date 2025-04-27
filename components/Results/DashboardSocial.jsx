import { useEffect, useState, useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import axios from "axios";

export default function DashboardSocial({ cities }) {
  const [index, setIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);
  const scrollRef = useRef(null);

  const CARD_WIDTH = 270; // carte
  const CARD_GAP = 16;     // gap entre cartes
  const TOTAL_CARD_WIDTH = CARD_WIDTH + CARD_GAP; // ⚡ largeur totale d'une carte

  const API_KEY = "AIzaSyDO_UayqES07-0prT3Qo2FYSpzgfrSTLmo";

  const city = cities[index];

  useEffect(() => {
    const fetchVideos = async () => {
      const query = `${city.name} travel vlog`;
      try {
        const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
          params: {
            part: "snippet",
            maxResults: 12,
            q: query,
            type: "video",
            videoDuration: "short",
            videoEmbeddable: "true",
            key: API_KEY,
          },
        });
        setVideos(res.data.items || []);
        setVideoIndex(0);
      } catch (err) {
        console.error("Erreur API YouTube:", err);
        setVideos([]);
      }
    };

    fetchVideos();
  }, [city]);

  const scroll = (dir) => {
    const total = videos.length;
    const maxIndex = total - 1;
    const newIndex = dir === "left"
      ? Math.max(0, videoIndex - 1)
      : Math.min(maxIndex, videoIndex + 1);

    setVideoIndex(newIndex);
    scrollRef.current?.scrollTo({
      left: newIndex * TOTAL_CARD_WIDTH,
      behavior: "smooth",
    });
  };

  const changeCity = (dir) => {
    setIndex((prev) =>
      dir === "left"
        ? (prev - 1 + cities.length) % cities.length
        : (prev + 1) % cities.length
    );
  };

  return (
    <div className="relative space-y-6 bg-[#121827] p-6 rounded-2xl shadow-inner">
      {/* Ville actuelle */}
      <div className="flex items-center justify-center gap-4 relative">
        <button
          onClick={() => changeCity("left")}
          className="bg-primary text-white px-3 py-2 rounded-full shadow-lg hover:bg-secondary hover:text-black transition-all"
        >
          <MdChevronLeft size={24} />
        </button>

        <h3 className="text-xl sm:text-2xl font-bold text-secondary">
          📍 {city.name}
        </h3>

        <button
          onClick={() => changeCity("right")}
          className="bg-primary text-white px-3 py-2 rounded-full shadow-lg hover:bg-secondary hover:text-black transition-all"
        >
          <MdChevronRight size={24} />
        </button>
      </div>

      {/* Carousel des vidéos */}
      <div className="relative w-full">
        <button
          onClick={() => scroll("left")}
          className="absolute top-1/2 left-2 z-10 transform -translate-y-1/2 p-2 bg-primary text-white rounded-full shadow hover:bg-secondary hover:text-black"
        >
          <MdChevronLeft />
        </button>

        <div ref={scrollRef} className="overflow-hidden w-full">
          <div
            className="flex gap-4"
            style={{
              width: `${videos.length * TOTAL_CARD_WIDTH}px`,
              transform: `translateX(-${videoIndex * TOTAL_CARD_WIDTH}px)`,
              transition: "transform 0.5s ease",
            }}
          >
            {videos.map((v) => (
              <div
                key={v.id.videoId}
                className="w-[270px] flex-shrink-0 rounded-2xl overflow-hidden shadow-xl relative group bg-[#1C2431] transition-transform duration-300 hover:scale-105"
              >
                <div className="relative h-[200px] overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${v.id.videoId}?origin=${window.location.origin}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="rounded-t-2xl"
                  ></iframe>

                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-50 transition duration-300 flex items-end pointer-events-none">
                    <div className="text-white p-3 text-sm font-medium line-clamp-2 w-full bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                      {v.snippet.title}
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400">@{v.snippet.channelTitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute top-1/2 right-2 z-10 transform -translate-y-1/2 p-2 bg-primary text-white rounded-full shadow hover:bg-secondary hover:text-black"
        >
          <MdChevronRight />
        </button>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-1">
        {Array.from({ length: videos.length }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === videoIndex
                ? "bg-primary shadow-[0_0_6px_rgba(244,63,94,0.8)] scale-110"
                : "bg-gray-600 opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
