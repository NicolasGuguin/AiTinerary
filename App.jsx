import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateTrip from "./pages/CreateTrip";
import ViewTrip from "./pages/ViewTrip";
import Header from "./components/Header";
import Results from "./pages/Results"
import LanternsBackground from "./components/LanternsBackground";

function App() {
  return (

    <div className="min-h-screen bg-background text-text font-sans px-0 py-12 sm:px-4 md:px-6">
      <Header />
      <div className="min-h-screen relative font-sans">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateTrip />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    
    </div>
    </div>
  );
}

export default App;