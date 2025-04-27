// ItineraryMap.jsx
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import "leaflet-polylinedecorator";

// 🔥 Icône custom numérotée
function createCustomIcon(index) {
  return new L.DivIcon({
    className: 'custom-marker group',
    html: `<div style="
      width: 34px; height: 34px; background-color: #F43F5E;
      border: 2px solid white; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: bold; font-size: 14px;
      box-shadow: 0 0 12px #F43F5E;
      animation: pop 0.4s ease forwards;
    ">${index + 1}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

// 🔥 Ajout de flèches sur le tracé
function PolylineArrows({ positions }) {
  const map = useMap();
  useEffect(() => {
    const arrowHead = L.polylineDecorator(L.polyline(positions, { color: "#F43F5E" }), {
      patterns: [
        { offset: 0, repeat: 100, symbol: L.Symbol.arrowHead({ pixelSize: 10, pathOptions: { fillOpacity: 1, weight: 0, color: "#F43F5E" } }) },
      ],
    });
    arrowHead.addTo(map);
    return () => map.removeLayer(arrowHead);
  }, [positions, map]);
  return null;
}

// 🔥 Groupement des villes uniques (avec liste de jours par ville)
function groupStepsByCity(steps) {
  const grouped = [];
  const seen = new Set();
  for (const step of steps) {
    if (!step.location || !step.location.lat || !step.location.lng) continue;
    const key = `${step.city}_${step.location.lat}_${step.location.lng}`;
    if (!seen.has(key)) {
      grouped.push({ city: step.city, location: step.location, days: [] });
      seen.add(key);
    }
    const last = grouped[grouped.length - 1];
    last.days.push({ day: step.day, activity: step.activities?.[0] ?? "" });
  }
  return grouped;
}

export default function ItineraryMap({ steps, cities, compact = false, isFullscreen, setIsFullscreen }) {
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

  const groupedCities = groupStepsByCity(enrichedSteps);

  const cityPositions = groupedCities.map((g) => [g.location.lat, g.location.lng]);

  useEffect(() => {
    if (mapRef.current && cityPositions.length > 0) {
      mapRef.current.fitBounds(cityPositions, { padding: [50, 50] });
      setCurrentLine([]);
    }
  }, [cityPositions]);

  const startReplay = () => {
    if (cityPositions.length === 0) return;
    setIsReplaying(true);
    setReplayIndex(1);
    setCurrentLine([cityPositions[0]]);
  };

  useEffect(() => {
    if (!isReplaying) return;
    if (replayIndex >= cityPositions.length) {
      setIsReplaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentLine((prev) => [...prev, cityPositions[replayIndex]]);
      if (mapRef.current && cityPositions[replayIndex]) {
        mapRef.current.flyTo(cityPositions[replayIndex], 7, { duration: 1 });
      }
      setReplayIndex((prev) => prev + 1);
    }, 800);
    return () => clearTimeout(timer);
  }, [replayIndex, isReplaying, cityPositions]);

  return (
    <div className="space-y-4 relative z-10">
      {!compact && (
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
      )}

      <MapContainer
        center={cityPositions[0]}
        zoom={6}
        scrollWheelZoom={false}
        className={`w-full ${compact ? "h-[200px]" : "h-[300px]"} rounded-xl z-10`}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          if (cityPositions.length > 0) {
            mapInstance.fitBounds(cityPositions, { padding: [50, 50] });
          }
        }}
      >
        <TileLayer
          url="https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=WU6TJdxzyeSkRDOh1rujsv1StIDjTRnL4h3uFGr597sDtHhfGpvejbH1YDYVwuBK"
          attribution='&copy; Jawg'
        />
        <Polyline positions={currentLine.length > 0 ? currentLine : cityPositions} color="#F43F5E" weight={5} />
        <PolylineArrows positions={currentLine.length > 0 ? currentLine : cityPositions} />

        {groupedCities
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

      {/* Fullscreen mode */}
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
              center={cityPositions[0]}
              zoom={6}
              scrollWheelZoom={true}
              className="w-full h-full z-0"
              whenCreated={(mapInstance) => {
                if (cityPositions.length > 0) {
                  mapInstance.fitBounds(cityPositions, { padding: [50, 50] });
                }
              }}
            >
              <TileLayer
                url="https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=WU6TJdxzyeSkRDOh1rujsv1StIDjTRnL4h3uFGr597sDtHhfGpvejbH1YDYVwuBK"
                attribution='&copy; Jawg'
              />
              <Polyline positions={cityPositions} color="#F43F5E" weight={5} />
              <PolylineArrows positions={cityPositions} />
              {groupedCities.map((step, index) => (
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
