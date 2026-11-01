import { Zap, Calendar, Clock, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';

/**
 * Étape 4 : Choix du créneau (Immédiat ou Rendez-vous programmé)
 * 
 * @param {Object} props
 * @param {'immediate'|'scheduled'} props.timeslotMode
 * @param {(mode: 'immediate'|'scheduled') => void} props.setTimeslotMode
 * @param {string} props.selectedDay
 * @param {(day: string) => void} props.setSelectedDay
 * @param {string} props.selectedTime
 * @param {(time: string) => void} props.setSelectedTime
 * @param {any[]} props.days
 * @param {any[]} props.timeSlots
 * @param {() => void} props.onBack
 * @param {() => void} props.onNext
 * @param {any} [props.theme]
 */
export default function StepTimeslot({
  timeslotMode,
  setTimeslotMode,
  selectedDay,
  setSelectedDay,
  selectedTime,
  setSelectedTime,
  days,
  timeSlots,
  onBack,
  onNext,
  theme,
}) {
  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          4. Choisissez votre créneau de passage
        </label>

        {/* Choix du mode : Immédiat vs Programmé */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setTimeslotMode('immediate')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[76px] ${
              timeslotMode === 'immediate'
                ? 'border-[#008056] bg-emerald-50/50 ring-2 ring-[#008056]/20 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                <Zap className="w-4 h-4 text-[#008056]" />
                Passage immédiat
              </span>
              {timeslotMode === 'immediate' && (
                <div className="w-4 h-4 rounded-full bg-[#008056] text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              File d'attente en temps réel à l'agence
            </p>
          </button>

          <button
            type="button"
            onClick={() => setTimeslotMode('scheduled')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[76px] ${
              timeslotMode === 'scheduled'
                ? 'border-[#008056] bg-emerald-50/50 ring-2 ring-[#008056]/20 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                <Calendar className="w-4 h-4 text-[#008056]" />
                Rendez-vous
              </span>
              {timeslotMode === 'scheduled' && (
                <div className="w-4 h-4 rounded-full bg-[#008056] text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Réservez une heure précise
            </p>
          </button>
        </div>
      </div>

      {/* Détails si Rendez-vous programmé */}
      {timeslotMode === 'scheduled' && (
        <div className="space-y-3.5 pt-1 animate-in fade-in-50 duration-150">
          {/* Sélection du jour */}
          <div>
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Sélectionnez le jour
            </span>
            <div className="grid grid-cols-3 gap-2">
              {days.map((day) => {
                const isSelected = selectedDay === day.id;
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => setSelectedDay(day.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#008056] bg-[#008056] text-white font-bold shadow-2xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="block text-xs font-bold">{day.label}</span>
                    <span className={`block text-[10px] mt-0.5 ${isSelected ? 'text-white/85' : 'text-slate-400'}`}>
                      {day.dateFormatted}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grille des heures */}
          <div>
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Plages horaires disponibles
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                const isBusy = slot.status === 'busy';

                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={isBusy}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-2 px-1 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex flex-col items-center justify-center min-h-[42px] ${
                      isBusy
                        ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-[#008056] border-[#008056] text-white shadow-xs scale-[1.03]'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-[#008056]/50 hover:bg-emerald-50/30'
                    }`}
                  >
                    <span>{slot.time}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Récapitulatif du choix de créneau */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs text-slate-700">
        <Clock className="w-4 h-4 text-[#008056] shrink-0" />
        <span>
          {timeslotMode === 'immediate' ? (
            <>Prise en charge à votre arrivée dès émission du ticket.</>
          ) : (
            <>
              Créneau réservé : <strong>{days.find((d) => d.id === selectedDay)?.label}</strong> à <strong>{selectedTime}</strong>.
            </>
          )}
        </span>
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          size="lg"
          variant="secondary"
          iconStart={ArrowLeft}
          onClick={onBack}
          className="min-h-[50px] font-bold text-sm sm:text-base cursor-pointer px-4 sm:px-6"
        >
          Retour
        </Button>
        <Button
          type="button"
          size="lg"
          variant="primary"
          primaryColor={theme?.colors?.primary || '#008056'}
          iconEnd={ArrowRight}
          onClick={onNext}
          className="flex-1 min-h-[50px] font-bold text-sm sm:text-base cursor-pointer"
        >
          Valider le créneau
        </Button>
      </div>
    </div>
  );
}

