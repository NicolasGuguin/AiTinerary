// components/Results/StoryMap.jsx
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef } from "react";

function createCustomIcon(index) {
  return new L.DivIcon({
    html: `
      <div style="
        width: 24px; height: 24px; background-color: #F43F5E;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: white; font-weight: bold; font-size: 12px;
        box-shadow: 0 0 8px #F43F5E;
      ">
        ${index + 1}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export default function StoryMap({ steps, cities }) {
  const mapRef = useRef(null);

  const enrichedSteps = steps.map((step) => {
    const cityInfo = cities.find((c) => c.id === step.cityId);
    return cityInfo ? [cityInfo.lat, cityInfo.lng] : null;
  }).filter(Boolean);

  useEffect(() => {
    if (mapRef.current && enrichedSteps.length > 0) {
      mapRef.current.fitBounds(enrichedSteps, { padding: [20, 20] });
    }
  }, [enrichedSteps]);

  if (enrichedSteps.length === 0) return null;

  return (
    <MapContainer
      center={enrichedSteps[0]}
      zoom={5}
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
      doubleClickZoom={false}
      touchZoom={false}
      keyboard={false}
      attributionControl={false}
      className="w-full h-full rounded-xl overflow-hidden"
      whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
    >
      <TileLayer
        url="https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=WU6TJdxzyeSkRDOh1rujsv1StIDjTRnL4h3uFGr597sDtHhfGpvejbH1YDYVwuBK"
      />
      <Polyline positions={enrichedSteps} color="#F43F5E" weight={4} />
      {enrichedSteps.map((pos, index) => (
        <Marker key={index} position={pos} icon={createCustomIcon(index)} />
      ))}
    </MapContainer>
  );
}
