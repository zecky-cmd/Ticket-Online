import { ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';
import FormField from '../../../globalComponents/ui/FormField';

/**
 * Étape 4 : Choix du créneau (date + heure simples)
 *
 * @param {Object} props
 * @param {string} props.selectedDate
 * @param {(date: string) => void} props.setSelectedDate
 * @param {string} props.selectedTime
 * @param {(time: string) => void} props.setSelectedTime
 * @param {() => void} props.onBack
 * @param {() => void} props.onNext
 * @param {any} [props.theme]
 */
export default function StepTimeslot({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onBack,
  onNext,
  theme,
}) {
  const today = new Date().toISOString().split('T')[0];
  const canContinue = Boolean(selectedDate && selectedTime);

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          4. Choisissez votre date et votre heure
        </label>
        <p className="text-[11px] text-slate-500 mb-3">
          Sélectionnez le moment de votre passage en agence.
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          <FormField
            id="slot-date"
            label="Date"
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="min-h-[50px] bg-white"
          />

          <FormField
            id="slot-time"
            label="Heure"
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="min-h-[50px] bg-white"
          />
        </div>
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
          disabled={!canContinue}
          className="flex-1 min-h-[50px] font-bold text-sm sm:text-base cursor-pointer"
        >
          Valider le créneau
        </Button>
      </div>
    </div>
  );
}
