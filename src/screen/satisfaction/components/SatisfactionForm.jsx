import React from 'react';
import { Star } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';

/**
 * Formulaire d'évaluation de satisfaction
 * Optimisé pour l'interaction tactile : étoiles larges avec zone de clic élargie.
 */
export default function SatisfactionForm({
  rating,
  setRating,
  hoverRating,
  setHoverRating,
  criterion,
  setCriterion,
  comment,
  setComment,
  isSubmitting,
  onSubmit,
  theme
}) {
  const criteria = [
    { id: 'accueil', label: "Qualité de l'accueil" },
    { id: 'rapidite', label: "Rapidité du service" },
    { id: 'efficacite', label: "Prise en charge" },
    { id: 'proprete', label: "Cadre & Confort" },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* 1. Évaluation par étoiles géantes pour mobile */}
      <div className="text-center py-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Votre niveau de satisfaction global
        </label>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = (hoverRating || rating) >= star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-2 sm:p-2.5 rounded-2xl hover:bg-slate-100 transition-transform active:scale-90 cursor-pointer"
                aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${
                    isFilled ? 'fill-amber-400 text-amber-400 drop-shadow-xs' : 'text-slate-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="text-xs font-bold mt-2 text-slate-600">
          {rating === 5 && '🌟 Exceptionnel !'}
          {rating === 4 && '😊 Très satisfaisant'}
          {rating === 3 && '😐 Correct'}
          {rating === 2 && '😕 Décevant'}
          {rating === 1 && '😞 Très insatisfaisant'}
        </div>
      </div>

      {/* 2. Critère principal */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Quel point vous a le plus marqué ?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {criteria.map((c) => {
            const isSelected = criterion === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCriterion(c.id)}
                className={`min-h-[44px] p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-transparent text-white shadow-xs scale-[1.02]'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                style={{
                  backgroundColor: isSelected ? theme?.colors?.primary : 'transparent'
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Commentaire libre */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Votre retour d'expérience
        </label>
        <textarea
          rows={3}
          required
          placeholder="Partagez votre appréciation ou une remarque pour nous aider à progresser..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-primary-500 shadow-2xs resize-none"
        />
      </div>

      <div className="pt-1">
        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          primaryColor={theme?.colors?.primary}
          className="w-full min-h-[50px] text-base"
        >
          {isSubmitting ? 'Transmission en cours...' : 'Transmettre mon Évaluation'}
        </Button>
      </div>
    </form>
  );
}
