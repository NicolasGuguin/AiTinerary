import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useMapContext } from "../../context/MapContext";
import { useEffect, useRef, useState } from "react";
import "leaflet-polylinedecorator";

// 🔥 Icône custom avec animation pop
function createCustomIcon(index) {
  return new L.DivIcon({
    className: 'custom-marker group',
    html: `
      <div style="
        width: 34px; height: 34px; background-color: #F43F5E;
        border: 2px solid white; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: white; font-weight: bold; font-size: 14px;
        box-shadow: 0 0 12px #F43F5E;
        animation: pop 0.4s ease forwards;
      ">
        ${index + 1}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

// 🔥 Polyline avec flèches
function PolylineArrows({ positions }) {
  const map = useMap();
  useEffect(() => {
    const arrowHead = L.polylineDecorator(L.polyline(positions, { color: "#F43F5E" }), {
      patterns: [
        {
          offset: 0,
          repeat: 100,
          symbol: L.Symbol.arrowHead({
            pixelSize: 10,
            pathOptions: { fillOpacity: 1, weight: 0, color: "#F43F5E" },
          }),
        },
      ],
    });
    arrowHead.addTo(map);
    return () => map.removeLayer(arrowHead);
  }, [positions, map]);
  return null;
}

// 🔥 Group steps by location (évite doublons sur même ville)
function groupStepsByCity(steps) {
  const grouped = [];
  const seen = new Set();
  for (const step of steps) {
    if (!step.location || !step.location.lat || !step.location.lng) continue;
    const key = `${step.city}_${step.location.lat}_${step.location.lng}`;
    if (!seen.has(key)) {
      grouped.push({
        city: step.city,
        location: step.location,
        days: [],
      });
      seen.add(key);
    }
    const last = grouped[grouped.length - 1];
    last.days.push({ day: step.day, activity: step.activities?.[0] ?? "" });
  }
  return grouped;
}

export default function ItineraryMap({ steps, cities }) {
  const { isFullscreen, setIsFullscreen } = useMapContext();
  const [replayIndex, setReplayIndex] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);
  const [currentLine, setCurrentLine] = useState([]);
  const mapRef = useRef(null);

  const enrichedSteps = steps.map((step) => {
    const cityInfo = cities.find((c) => c.id === step.cityId);
    return {
      ...step,
      city: cityInfo?.name ?? step.cityId,
      location: cityInfo ? { lat: cityInfo.lat, lng: cityInfo.lng } : null,
    };
  });

  const positions = enrichedSteps
    .filter((step) => step.location)
    .map((step) => [step.location.lat, step.location.lng]);

  // Centrage automatique au chargement
  useEffect(() => {
    if (mapRef.current && positions.length > 0) {
      mapRef.current.fitBounds(positions, { padding: [50, 50] });
      setCurrentLine([]);
    }
  }, [positions]);

  const startReplay = () => {
    if (positions.length === 0) return;
    setIsReplaying(true);
    setReplayIndex(1);
    setCurrentLine([positions[0]]);
  };

  // 🔥 Animation du tracé + flyTo à chaque étape
  useEffect(() => {
    if (!isReplaying) return;
    if (replayIndex >= positions.length) {
      setIsReplaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentLine((prev) => [...prev, positions[replayIndex]]);
      if (mapRef.current && positions[replayIndex]) {
        mapRef.current.flyTo(positions[replayIndex], 7, { duration: 1 });
      }
      setReplayIndex((prev) => prev + 1);
    }, 800);
    return () => clearTimeout(timer);
  }, [replayIndex, isReplaying, positions]);

  function getTooltipHTML(city, days) {
    const content = days.map((d) => `Jour ${d.day} – ${d.activity}`).join("<br/>");
    return `
      <div class="relative group w-8 h-8">
        <div style="
          width: 100%; height: 100%; background-color: #F43F5E;
          border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px #F43F5E;
          cursor: pointer;
        "></div>
        <div class="absolute -top-24 left-1/2 -translate-x-1/2 bg-[#141A2A] text-[#FDBA74] px-4 py-2 text-sm rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1000] pointer-events-none w-max max-w-[240px] text-left">
          <strong>${city}</strong><br/>
          ${content}
        </div>
      </div>
    `;
  }

  return (
    <div className="space-y-4 relative z-10">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
        <button
          onClick={startReplay}
          className="w-full sm:w-auto px-4 py-2 text-sm rounded bg-secondary text-black hover:bg-primary hover:text-white transition-all"
        >
          ▶ Rejouer l’itinéraire
        </button>

        <button
          onClick={() => setIsFullscreen(true)}
          className="w-full sm:w-auto px-4 py-2 text-sm rounded bg-primary text-white hover:bg-secondary hover:text-black transition-all"
        >
          Agrandir la carte
        </button>
      </div>

      <MapContainer
        center={positions[0]}
        zoom={6}
        scrollWheelZoom={false}
        className="w-full h-[300px] rounded-xl z-10"
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          if (positions.length > 0) {
            mapInstance.fitBounds(positions, { padding: [50, 50] });
          }
        }}
      >
        <TileLayer
          url="https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=WU6TJdxzyeSkRDOh1rujsv1StIDjTRnL4h3uFGr597sDtHhfGpvejbH1YDYVwuBK"
          attribution='&copy; <a href="https://www.jawg.io">Jawg</a> contributors'
        />
        {/* Tracé progressif */}
        <Polyline positions={currentLine.length > 0 ? currentLine : positions} color="#F43F5E" weight={5} />
        <PolylineArrows positions={currentLine.length > 0 ? currentLine : positions} />

        {/* Marqueurs visibles selon replay */}
        {groupStepsByCity(enrichedSteps)
          .filter((_, index) => !isReplaying || index < currentLine.length)
          .map((step, index) => (
            <Marker
              key={index}
              position={[step.location.lat, step.location.lng]}
              icon={createCustomIcon(index)}
            >
              <Popup>
                <strong>{step.city}</strong><br />
                {step.days.map((d, i) => (
                  <div key={i}>Jour {d.day} – {d.activity}</div>
                ))}
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Version fullscreen */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade">
          <div className="w-full h-full relative animate-zoom">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-[10000] px-4 py-2 rounded bg-secondary text-black hover:bg-primary hover:text-white"
            >
              ✕ Fermer
            </button>

            <MapContainer
              center={positions[0]}
              zoom={6}
              scrollWheelZoom={true}
              className="w-full h-full z-0"
              whenCreated={(mapInstance) => {
                if (positions.length > 0) {
                  mapInstance.fitBounds(positions, { padding: [50, 50] });
                }
              }}
            >
              <TileLayer
                url="https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=WU6TJdxzyeSkRDOh1rujsv1StIDjTRnL4h3uFGr597sDtHhfGpvejbH1YDYVwuBK"
                attribution='&copy; <a href="https://www.jawg.io">Jawg</a> contributors'
              />
              <Polyline positions={positions} color="#F43F5E" weight={5} />
              <PolylineArrows positions={positions} />
              {groupStepsByCity(enrichedSteps).map((step, index) => (
                <Marker
                  key={index}
                  position={[step.location.lat, step.location.lng]}
                  icon={createCustomIcon(index)}
                >
                  <Popup>
                    <strong>{step.city}</strong><br />
                    {step.days.map((d, i) => (
                      <div key={i}>Jour {d.day} – {d.activity}</div>
                    ))}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}
