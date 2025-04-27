// components/Results/StoryMap.jsx
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet-polylinedecorator";
import { useEffect, useRef } from "react";

// 🔥 Icône custom pour les étapes numérotées
function createCustomIcon(index) {
  return new L.DivIcon({
    html: `
      <div style="
        width: 30px; height: 30px; background-color: #F43F5E;
        border: 2px solid white; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: white; font-weight: bold; font-size: 14px;
        box-shadow: 0 0 10px #F43F5E;
      ">
        ${index + 1}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

export default function StoryMap({ steps, cities }) {
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

  useEffect(() => {
    if (mapRef.current && positions.length > 0) {
      mapRef.current.fitBounds(positions, { padding: [40, 40] });
    }
  }, [positions]);

  if (positions.length === 0) return null;

  return (
    <div className="w-full h-[500px] overflow-hidden rounded-2xl shadow-lg">
      <MapContainer
        center={positions[0]}
        zoom={5}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
        attributionControl={false}
        className="w-full h-full rounded-2xl"
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          if (positions.length > 0) {
            mapInstance.fitBounds(positions, { padding: [40, 40] });
          }
        }}
      >
        <TileLayer
          url="https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=WU6TJdxzyeSkRDOh1rujsv1StIDjTRnL4h3uFGr597sDtHhfGpvejbH1YDYVwuBK"
        />
        <Polyline positions={positions} color="#F43F5E" weight={4} />
        {positions.map((pos, idx) => (
          <Marker key={idx} position={pos} icon={createCustomIcon(idx)} />
        ))}
      </MapContainer>
    </div>
  );
}
