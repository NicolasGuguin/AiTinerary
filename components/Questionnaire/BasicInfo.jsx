export default function BasicInfo({ formData, setFormData }) {
    return (
      <div className="space-y-10">
        {/* Destination */}
        <div>
          <label className="block text-sm text-secondary font-semibold mb-2">
            Destination
          </label>
          <input
            className="w-full bg-[#1E293B] text-white px-5 py-4 rounded-xl placeholder:text-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="Ex : Japon, Amérique du Sud, ou restez ouvert"
            value={formData.destination}
            onChange={(e) =>
              setFormData({ ...formData, destination: e.target.value })
            }
          />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-secondary font-semibold mb-2">
              Date de départ
            </label>
            <input
              type="date"
              className="w-full bg-[#1E293B] text-white px-5 py-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>
  
          <div>
            <label className="block text-sm text-secondary font-semibold mb-2">
              Durée (en jours)
            </label>
            <input
              type="number"
              min="1"
              placeholder="10"
              className="w-full bg-[#1E293B] text-white px-5 py-4 rounded-xl placeholder:text-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            />
          </div>
  
          <div>
            <label className="block text-sm text-secondary font-semibold mb-2">
              Nombre de voyageurs
            </label>
            <input
              type="number"
              min="1"
              placeholder="1"
              className="w-full bg-[#1E293B] text-white px-5 py-4 rounded-xl placeholder:text-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              value={formData.travelers}
              onChange={(e) =>
                setFormData({ ...formData, travelers: e.target.value })
              }
            />
          </div>
        </div>
  
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="flexibleDates"
            checked={formData.flexibleDates}
            onChange={(e) =>
              setFormData({ ...formData, flexibleDates: e.target.checked })
            }
            className="accent-primary w-5 h-5"
          />
          <label htmlFor="flexibleDates" className="text-sm text-secondary font-semibold">
            Dates flexibles ?
          </label>
        </div>
      </div>
    );
  }
  