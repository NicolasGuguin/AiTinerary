import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import { useMemo, useRef } from "react";

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
  });
}

export default function StoryMap({ steps, cities }) {
  const mapRef = useRef(null);

  const { cityPositions, center, zoom } = useMemo(() => {
    const uniqueCities = [];
    const cityPositions = [];

    steps.forEach((step) => {
      const city = cities.find((c) => c.id === step.cityId);
      if (city && !uniqueCities.includes(city.id)) {
        uniqueCities.push(city.id);
        cityPositions.push([city.lat, city.lng]);
      }
    });

    const lats = cityPositions.map(p => p[0]);
    const lngs = cityPositions.map(p => p[1]);

    if (cityPositions.length === 0) {
      return { cityPositions: [], center: [0, 0], zoom: 2 };
    }

    const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

    const maxDiff = Math.max(...lats) - Math.min(...lats);
    
    let zoom;
    if (maxDiff < 0.1) zoom = 10;
    else if (maxDiff < 0.5) zoom = 9;
    else if (maxDiff < 1) zoom = 8;
    else if (maxDiff < 3) zoom = 7;
    else if (maxDiff < 7) zoom = 6;
    else zoom = 6;
    
    const verticalShift = 1.0;
    const shiftedLat = avgLat + verticalShift;
    

    return { cityPositions, center: [shiftedLat, avgLng], zoom };
  }, [steps, cities]);

  if (cityPositions.length === 0) return null;

  return (
    <div
      className="relative bg-[#f9fafb] rounded-2xl overflow-hidden shadow-lg"
      style={{ width: "720px", height: "960px", margin: "0 auto" }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
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
