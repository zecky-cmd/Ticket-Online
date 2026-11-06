import { ArrowRight, ArrowLeft, SkipForward } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';

const NPS_OPTIONS = Array.from({ length: 11 }, (_, score) => {
  let color = '#dc2626';
  if (score >= 4 && score <= 6) color = '#f97316';
  else if (score >= 7 && score <= 8) color = '#d97706';
  else if (score >= 9) color = '#16a34a';
  return { score, color };
});

/**
 * Étape Recommandation — NPS de 0 à 10 (skippable)
 */
export default function SatisfactionStepNps({ npsNote, setNpsNote, onBack, onNext, theme }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Recommanderiez-vous notre banque à un ami ?
        </label>
        <p className="text-[11px] text-slate-500 mb-3">
          De 0 (pas du tout probable) à 10 (très probable).
        </p>

        <div className="grid grid-cols-6 gap-2">
          {NPS_OPTIONS.map((opt) => {
            const isSelected = npsNote === opt.score;
            return (
              <button
                key={opt.score}
                type="button"
                onClick={() => setNpsNote(opt.score)}
                className={`py-2.5 rounded-xl border-2 text-sm font-extrabold transition-all cursor-pointer ${
                  isSelected
                    ? 'text-white border-transparent scale-105 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
                style={isSelected ? { backgroundColor: opt.color } : {}}
              >
                {opt.score}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold mt-2 px-1">
          <span className="text-rose-600">0 = pas du tout probable</span>
          <span className="text-emerald-600">10 = très probable</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
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
          variant="secondary"
          iconStart={SkipForward}
          onClick={onNext}
          className="min-h-[50px] font-bold text-sm sm:text-base cursor-pointer px-4"
        >
          Passer
        </Button>
        <Button
          type="button"
          size="lg"
          variant="primary"
          primaryColor={theme?.colors?.primary || '#008056'}
          iconEnd={ArrowRight}
          onClick={onNext}
          disabled={npsNote === null}
          className="flex-1 min-h-[50px] font-bold text-sm sm:text-base cursor-pointer"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}
