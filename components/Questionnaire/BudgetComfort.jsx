export default function BudgetComfort({ formData, setFormData }) {
    return (
      <div className="space-y-10">
        <div>
          <label className="block text-sm text-secondary font-semibold mb-2">
            Budget total (€)
          </label>
          <input
            type="number"
            className="w-full bg-[#1E293B] text-white px-5 py-4 rounded-xl placeholder:text-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="Ex : 2000"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          />
        </div>
  
        <div>
          <label className="block text-sm text-secondary font-semibold mb-2">
            Niveau de confort
          </label>
          <select
            className="w-full bg-[#1E293B] text-white px-5 py-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            value={formData.comfort}
            onChange={(e) => setFormData({ ...formData, comfort: e.target.value })}
          >
            <option value="basique">Basique</option>
            <option value="moyen">Moyen</option>
            <option value="confortable">Confortable</option>
            <option value="premium">Premium</option>
          </select>
        </div>
  
        <div>
          <label className="block text-sm text-secondary font-semibold mb-2">
            Préférence de logement
          </label>
          <select
            className="w-full bg-[#1E293B] text-white px-5 py-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            value={formData.roomType}
            onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
          >
            <option value="private">Chambre privée uniquement</option>
            <option value="mixed">Privé ou dortoir si nécessaire</option>
            <option value="dormitory">Dortoirs acceptés</option>
          </select>
        </div>
  
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="noLodgingNeeded"
            checked={formData.noLodgingNeeded}
            onChange={(e) =>
              setFormData({ ...formData, noLodgingNeeded: e.target.checked })
            }
            className="accent-primary w-5 h-5"
          />
          <label htmlFor="noLodgingNeeded" className="text-sm text-secondary font-semibold">
            Je dors en tente / camping-car (pas besoin de logement)
          </label>
        </div>
  
        {formData.travelers > 1 && !formData.noLodgingNeeded && (
          <div>
            <label className="block text-sm text-secondary font-semibold mb-2">
              Nombre de chambres recherchées
            </label>
            <input
              type="number"
              min="1"
              className="w-full bg-[#1E293B] text-white px-5 py-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Ex : 2"
              value={formData.rooms || ""}
              onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
            />
          </div>
        )}
      </div>
    );
  }
  