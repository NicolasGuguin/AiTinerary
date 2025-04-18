import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateTrip from "./pages/CreateTrip";
import ViewTrip from "./pages/ViewTrip";
import Header from "./components/Header";
import Results from "./pages/Results"
import LanternsBackground from "./components/LanternsBackground";

function App() {
  return (

    <div className="min-h-screen bg-background text-text font-sans px-6 py-12">
      <Header />
      <div className="min-h-screen relative font-sans">
      <LanternsBackground />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateTrip />} />
        <Route path="/trip/:id" element={<ViewTrip />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    
    </div>
    </div>
  );
}

export default App;