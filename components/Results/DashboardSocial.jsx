import { useEffect, useState, useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import axios from "axios";

export default function DashboardSocial({ cities }) {
  const [index, setIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const API_KEY = "AIzaSyDO_UayqES07-0prT3Qo2FYSpzgfrSTLmo";
  const scrollRef = useRef(null);

  const city = cities[index];

  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1280) setCardsPerView(4);
      else if (width >= 1024) setCardsPerView(3);
      else if (width >= 640) setCardsPerView(2);
      else setCardsPerView(1);
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

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
    const newIndex = dir === "left"
      ? Math.max(0, videoIndex - cardsPerView)
      : Math.min(videos.length - cardsPerView, videoIndex + cardsPerView);
    setVideoIndex(newIndex);
    scrollRef.current?.scrollTo({
      left: newIndex * 270,
      behavior: "smooth"
    });
  };

  const changeCity = (dir) => {
    setIndex((prev) =>
      dir === "left" ? (prev - 1 + cities.length) % cities.length : (prev + 1) % cities.length
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => changeCity("left")} className="p-2 rounded-full bg-primary text-white hover:bg-secondary hover:text-black">
          <MdChevronLeft size={24} />
        </button>
        <h3 className="text-xl sm:text-2xl font-bold text-secondary">📍 {city.name}</h3>
        <button onClick={() => changeCity("right")} className="p-2 rounded-full bg-primary text-white hover:bg-secondary hover:text-black">
          <MdChevronRight size={24} />
        </button>
      </div>

      {/* Défilement horizontal */}
      <div className="relative w-full">
        <button
          onClick={() => scroll("left")}
          className="absolute top-1/2 left-2 z-10 transform -translate-y-1/2 p-2 bg-primary text-white rounded-full shadow hover:bg-secondary hover:text-black"
        >
          <MdChevronLeft />
        </button>
        <div
          ref={scrollRef}
          className="overflow-hidden w-full px-10"
        >
          <div className="flex transition-all gap-4">
            {videos.map((v) => (
              <div key={v.id.videoId} className="w-[260px] flex-shrink-0 bg-[#1B2233] rounded-xl overflow-hidden shadow-md hover:scale-[1.03] hover:shadow-lg transition-transform duration-300">
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${v.id.videoId}`}
                  title={v.snippet.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-t-xl"
                ></iframe>
                <div className="p-3 space-y-1">
                  <p className="text-sm font-medium text-white line-clamp-2">{v.snippet.title}</p>
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
    </div>
  );
}
