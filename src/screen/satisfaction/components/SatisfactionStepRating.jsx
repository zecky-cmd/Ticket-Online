import { useState } from 'react';
import { Angry, Frown, Meh, Smile, Laugh, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';
import { resolveSatisfactionImageUrl } from '../../../services/satisfactionService';

const ORDER_ICONS = { 1: Angry, 2: Frown, 3: Meh, 4: Smile, 5: Laugh };

/** Rendu d'une émoticône : image API si disponible, sinon visage lucide coloré */
function EmoticonVisual({ satis }) {
  const [imgError, setImgError] = useState(false);
  const imgUrl = resolveSatisfactionImageUrl(satis.image);
  const Icon = ORDER_ICONS[satis.order] || Meh;

  return (
    <div
      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
      style={{ backgroundColor: satis.colorSec }}
    >
      {imgUrl && !imgError ? (
        <img
          src={imgUrl}
          alt={satis.label}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain"
        />
      ) : (
        <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: satis.color }} />
      )}
    </div>
  );
}

/**
 * Étape Avis — Émoticônes + justificatif unique + commentaire optionnel
 */
export default function SatisfactionStepRating({
  satisfactions = [],
  satisfactionsLoading = false,
  selectedSatis,
  onSelectSatis,
  justificatifs = [],
  justificatifsLoading = false,
  selectedJustificatif,
  onSelectJustificatif,
  comment,
  setComment,
  onBack,
  onNext,
  theme,
  hideActions = false,
}) {
  const isAutreSelected = Boolean(selectedJustificatif?.isAutre);

  return (
    <div className="space-y-5">
      {/* Émoticônes */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Comment avez-vous trouvé le service ?
        </label>
        {satisfactionsLoading ? (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            Chargement des avis…
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {satisfactions.map((satis) => {
              const isSelected = selectedSatis?.id === satis.id;
              return (
                <button
                  key={satis.id}
                  type="button"
                  onClick={() => onSelectSatis(satis)}
                  className={`p-2 sm:p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected ? 'scale-105 shadow-md bg-white' : 'border-transparent hover:bg-white/70'
                  }`}
                  style={isSelected ? { borderColor: satis.color } : {}}
                >
                  <EmoticonVisual satis={satis} />
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 text-center leading-tight">
                    {satis.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Justificatifs + commentaire */}
      {selectedSatis && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Pour quelles raisons ?{' '}
            <span className="text-slate-400 font-normal normal-case">(optionnel)</span>
          </label>

          {justificatifsLoading ? (
            <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Chargement des motifs…
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {justificatifs.map((justif) => {
                const isChecked = selectedJustificatif?.id === justif.id;
                return (
                  <button
                    key={justif.id}
                    type="button"
                    onClick={() => onSelectJustificatif(isChecked ? null : justif)}
                    className={`px-3.5 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                      isChecked
                        ? 'text-white border-transparent shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                    style={isChecked ? { backgroundColor: theme?.colors?.primary } : {}}
                  >
                    {justif.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Champ libre affiché UNIQUEMENT si le motif « Autre » est choisi */}
          {isAutreSelected && (
            <div>
              <label htmlFor="sat-comment" className="block text-xs font-bold text-slate-700 mb-1.5">
                Précisez votre motif
              </label>
              <textarea
                id="sat-comment"
                rows={2}
                maxLength={150}
                placeholder="Ex: temps de traitement un peu long…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 focus:border-primary-500 rounded-xl text-base sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 shadow-2xs resize-none"
              />
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {!hideActions && (
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
            variant="primary"
            primaryColor={theme?.colors?.primary || '#008056'}
            iconEnd={ArrowRight}
            onClick={onNext}
            disabled={!selectedSatis}
            className="flex-1 min-h-[50px] font-bold text-sm sm:text-base cursor-pointer"
          >
            Continuer
          </Button>
        </div>
      )}
    </div>
  );
}
