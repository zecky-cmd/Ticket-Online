import { Building2, Ticket } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';

/**
 * Formulaire de réservation de ticket en ligne
 * Optimisé pour le mobile : contrôles tactiles >= 48px, typographie anti-zoom iOS (16px).
 */
export default function TicketForm({
  agency,
  setAgency,
  agencies,
  serviceCategory,
  setServiceCategory,
  fullName,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  isSubmitting,
  onSubmit,
  theme
}) {
  const categories = [
    { id: 'reclamation', label: 'Réclamation' },
    { id: 'commercial', label: 'Conseil' },
    { id: 'caisse', label: 'Caisse' }
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* 1. Sélection de l'agence */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          1. Agence de passage
        </label>
        <div className="relative">
          <Building2 className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            className="w-full pl-11 pr-4 min-h-[50px] bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-primary-500 cursor-pointer shadow-2xs"
          >
            {agencies.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name} ({a.currentWaitTime} d'attente)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Type d'opération */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          2. Type d'opération souhaitée
        </label>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => {
            const isSelected = serviceCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setServiceCategory(cat.id)}
                className={`min-h-[48px] px-2 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all border cursor-pointer select-none ${
                  isSelected
                    ? 'text-white border-transparent shadow-xs scale-[1.02]'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                style={{
                  backgroundColor: isSelected ? theme?.colors?.primary : 'transparent'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Coordonnées client */}
      <div className="space-y-3.5 pt-1">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nom & Prénoms
          </label>
          <input
            type="text"
            required
            placeholder="ex: Jean Koffi"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 min-h-[50px] bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-primary-500 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Numéro de Téléphone (reception du SMS)
          </label>
          <input
            type="tel"
            required
            placeholder="07 00 00 00 00"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 min-h-[50px] bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-primary-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Bouton de soumission tactile plein format */}
      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          primaryColor={theme?.colors?.primary}
          iconStart={Ticket}
          className="w-full min-h-[52px] text-base"
        >
          {isSubmitting ? 'Génération en cours...' : 'Valider et Générer le Ticket'}
        </Button>
      </div>
    </form>
  );
}
