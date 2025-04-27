import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef } from "react";

function createCustomIcon(index) {
  return new L.DivIcon({
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: #F43F5E;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 16px;
        box-shadow: 0 0 8px #F43F5E;
      ">
        ${index + 1}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    className: "" // <= pas besoin de classe spéciale
  });
}

export default function StoryMap({ steps, cities }) {
  const mapRef = useRef(null);

  // 🔥 Construire une liste unique des villes (cityId), dans l'ordre du trip
  const uniqueCities = [];
  const cityPositions = [];

  steps.forEach((step) => {
    const city = cities.find((c) => c.id === step.cityId);
    if (city && !uniqueCities.includes(city.id)) {
      uniqueCities.push(city.id);
      cityPositions.push([city.lat, city.lng]);
    }
  });

  useEffect(() => {
    if (mapRef.current && cityPositions.length > 0) {
      const map = mapRef.current;
      const container = map.getContainer();
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
  
      // 🔥 Définir un padding intelligent : plus haut que large
      const paddingX = Math.max(20, containerWidth * 0.05); // 5% minimum
      const paddingY = Math.max(20, containerHeight * 0.12); // 12% minimum
  
      map.fitBounds(cityPositions, {
        paddingTopLeft: [paddingX, paddingY],
        paddingBottomRight: [paddingX, paddingY],
      });
    }
  }, [cityPositions]);
  
  

  if (cityPositions.length === 0) return null;

  return (
    <div
      className="relative bg-[#f9fafb] rounded-2xl overflow-hidden shadow-lg"
      style={{ width: "720px", height: "960px", margin: "0 auto" }}
    >
      <MapContainer
        center={cityPositions[0]}
        zoom={6}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
        attributionControl={false}
        className="w-full h-full"
        whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
      >
        <TileLayer
          url="https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=WU6TJdxzyeSkRDOh1rujsv1StIDjTRnL4h3uFGr597sDtHhfGpvejbH1YDYVwuBK"
        />
        <Polyline positions={cityPositions} color="#F43F5E" weight={4} />
        {cityPositions.map((pos, index) => (
          <Marker key={index} position={pos} icon={createCustomIcon(index)} />
        ))}
      </MapContainer>
    </div>
  );
}
