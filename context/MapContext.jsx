import { createContext, useContext, useState } from "react";

const MapContext = createContext();

export const useMapContext = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <MapContext.Provider value={{ isFullscreen, setIsFullscreen }}>
      {children}
    </MapContext.Provider>
  );
};
