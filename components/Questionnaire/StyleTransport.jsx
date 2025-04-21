export default function StyleTransport({ formData, setFormData }) {
    const styles = ["culture", "aventure", "détente", "gastronomie", "photo", "nature", "immersion", "plage", "randonnée","festif"];
    const transports = ["train", "voiture", "avion", "bus", "marche", "vélo", "bateau", "taxi", "scooter"];
  
    const toggle = (field, value) => {
      setFormData((prev) => {
        const current = prev[field];
        return {
          ...prev,
          [field]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      });
    };
  
    return (
      <div className="space-y-10">
        <div>
          <label className="block text-sm text-secondary font-semibold mb-2">
            Rythme de voyage
          </label>
          <select
            className="w-full bg-[#1E293B] text-white px-5 py-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            value={formData.rhythm}
            onChange={(e) => setFormData({ ...formData, rhythm: e.target.value })}
          >
            <option value="chill">Chill</option>
            <option value="modéré">Modéré</option>
            <option value="intensif">Intensif</option>
          </select>
        </div>
  
        <div>
          <label className="block text-sm text-secondary font-semibold mb-2">
            Style(s) de voyage
          </label>
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => (
              <button
                key={style}
                type="button"
                className={`px-4 py-2 rounded-full border transition-all ${
                  formData.style.includes(style)
                    ? "bg-primary text-white"
                    : "bg-[#1E293B] text-white hover:bg-primary/30"
                }`}
                onClick={() => toggle("style", style)}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
  
        <div>
          <label className="block text-sm text-secondary font-semibold mb-2">
            Moyens de transport
          </label>
          <div className="flex flex-wrap gap-2">
            {transports.map((t) => (
              <button
                key={t}
                type="button"
                className={`px-4 py-2 rounded-full border transition-all ${
                  formData.transportPreferences.includes(t)
                    ? "bg-secondary text-black"
                    : "bg-[#1E293B] text-white hover:bg-secondary/30"
                }`}
                onClick={() => toggle("transportPreferences", t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
            <label className="block text-sm text-secondary font-semibold mb-2">
                Durée maximale d'un trajet
            </label>
            <select
                className="w-full bg-[#1E293B] text-white px-5 py-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                value={formData.maxTravelDuration}
                onChange={(e) =>
                setFormData({ ...formData, maxTravelDuration: e.target.value })
                }
            >
                <option value="illimité">Peu importe</option>
                <option value="4h">Maximum 4h</option>
                <option value="6h">Maximum 6h</option>
                <option value="10h">Maximum 10h</option>
                <option value="20h">Maximum 20h</option>
            </select>
            </div>
      </div>
    );
  }
  