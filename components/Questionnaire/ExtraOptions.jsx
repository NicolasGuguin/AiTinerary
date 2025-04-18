export default function ExtraOptions({ formData, setFormData }) {
    return (
      <div className="space-y-10">
        <div>
          <label className="block text-sm text-secondary font-semibold mb-2">
            Vie nocturne importante ?
          </label>
          <select
            className="w-full bg-[#1E293B] text-white px-5 py-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            value={formData.nightlife}
            onChange={(e) =>
              setFormData({ ...formData, nightlife: e.target.value })
            }
          >
            <option value="indifférent">Peu importe</option>
            <option value="oui">Oui</option>
            <option value="non">Non</option>
          </select>
        </div>
  
        <div>
          <label className="block text-sm text-secondary font-semibold mb-2">
            Lieux ou contextes à éviter
          </label>
          <textarea
            className="w-full bg-[#1E293B] text-white px-5 py-4 rounded-xl placeholder:text-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="Ex : grandes villes, zones très touristiques, zones trop chaudes"
            value={formData.avoid}
            onChange={(e) =>
              setFormData({ ...formData, avoid: e.target.value })
            }
          />
        </div>
  
        <div>
          <label className="block text-sm text-secondary font-semibold mb-2">
            But principal de ce voyage
          </label>
          <textarea
            className="w-full bg-[#1E293B] text-white px-5 py-4 rounded-xl placeholder:text-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="Ex : se reconnecter à la nature, faire une pause, découvrir une culture, etc."
            value={formData.purpose}
            onChange={(e) =>
              setFormData({ ...formData, purpose: e.target.value })
            }
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="circularTrip"
            checked={formData.circularTrip}
            onChange={(e) =>
              setFormData({ ...formData, circularTrip: e.target.checked })
            }
            className="accent-primary w-5 h-5"
          />
          <label htmlFor="circularTrip" className="text-sm text-secondary font-semibold">
            Souhaitez-vous un itinéraire circulaire ?
          </label>
        </div>


      </div>
      
    );
  }
  