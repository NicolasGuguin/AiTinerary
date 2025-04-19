import { useEffect, useState } from "react";
import lantern from "../assets/lantern.png";

const StylizedLanterns = () => {
  const [lanterns, setLanterns] = useState([]);

  useEffect(() => {
    const count = 7;
    const minDistance = 12;
    const lanternsTemp = [];
  
    let attempts = 0;
    const maxAttempts = 100;
  
    while (lanternsTemp.length < count && attempts < maxAttempts) {
      attempts++;
  
      const side = Math.random() < 0.5 ? "left" : "right";
      const left = side === "left"
        ? 0 + Math.random() * 10  // 5% à 20%
        : 80 + Math.random() * 15 // 80% à 95%
  
      const isTooClose = lanternsTemp.some(
        (l) => Math.abs(l.left - left) < minDistance
      );
  
      if (!isTooClose) {
        lanternsTemp.push({
          id: lanternsTemp.length,
          left,
          delay: Math.random() * 20,
          duration: 50 + Math.random() * 20,
          size: 180 + Math.random() * 30,
        });
      }
    }
  
    setLanterns(lanternsTemp);
  }, []);
  
  

  return (
    <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
      {lanterns.map((lanternData) => (
        <img
          key={lanternData.id}
          src={lantern}
          alt="lantern"
          style={{
            position: "absolute",
            left: `${lanternData.left}%`,
            width: `${lanternData.size}px`,
            animation: `floatLantern ${lanternData.duration}s ease-in-out infinite`,
            animationDelay: `${lanternData.delay}s`,
            bottom: `-50px`,
            opacity: 0.9,
            filter: "drop-shadow(0 0 10px rgba(255, 85, 85, 0.5))",
          }}
        />
      ))}
      <style>
        {`
          @keyframes floatLantern {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            50% {
              transform: translateY(-50vh) scale(1.05);
              opacity: 0.8;
            }
            100% {
              transform: translateY(-100vh) scale(1.1);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default StylizedLanterns;