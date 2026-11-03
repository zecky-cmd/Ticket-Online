import { useState } from 'react';
import { MessageSquareHeart, X } from 'lucide-react';
import { satisfactionService } from '../../services/satisfactionService';
import SatisfactionForm from './components/SatisfactionForm';
import SatisfactionSuccess from './components/SatisfactionSuccess';

/**
 * Screen / Modal Évaluation de la Satisfaction Client
 * Mode Mobile Optimal : Bottom Sheet fluide sur mobile avec poignée tactile.
 */
export default function SatisfactionScreen({ isOpen, onClose, theme }) {
  const [rating, setRating]             = useState(5);
  const [hoverRating, setHoverRating]   = useState(0);
  const [criterion, setCriterion]       = useState('accueil');
  const [comment, setComment]           = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]       = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await satisfactionService.submitSatisfaction({ rating, criterion, comment });
      setSubmitted(true);
    } catch (err) {
      console.error('Erreur soumission satisfaction:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setComment('');
    setRating(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center sm:p-4 bg-slate-950/70 backdrop-blur-md transition-all">
      {/* Conteneur Hybride : Bottom Sheet mobile / Modale centrée desktop */}
      <div className="bg-white w-full rounded-t-[32px] sm:rounded-3xl shadow-2xl sm:max-w-lg max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden border-t sm:border border-slate-100 animate-in slide-in-from-bottom duration-300 sm:zoom-in-95">

        {/* Poignée tactile de glissement mobile */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden flex-shrink-0" />

        {/* Header Modal */}
        <div
          className="px-6 py-4 sm:py-5 flex items-center justify-between text-white flex-shrink-0"
          style={{ backgroundColor: theme?.colors?.primary }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs flex-shrink-0">
              <MessageSquareHeart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-snug">Satisfaction Client</h3>
              <p className="text-xs text-white/85">Donnez votre avis en 30 secondes</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Corps défilable */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8">
          {submitted ? (
            <SatisfactionSuccess theme={theme} onClose={handleClose} />
          ) : (
            <SatisfactionForm
              rating={rating}
              setRating={setRating}
              hoverRating={hoverRating}
              setHoverRating={setHoverRating}
              criterion={criterion}
              setCriterion={setCriterion}
              comment={comment}
              setComment={setComment}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              theme={theme}
            />
          )}
        </div>
      </div>
    </div>
  );
}
