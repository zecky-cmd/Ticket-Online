import { useState } from 'react';
import { MessageSquareHeart, X, Star, CheckCircle2 } from 'lucide-react';
import Button from './ui/Button';
import { satisfactionService } from '../services/satisfactionService';

export default function SatisfactionModal({ isOpen, onClose, theme }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [criterion, setCriterion] = useState('accueil');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await satisfactionService.submitSatisfaction({
        rating,
        criterion,
        comment,
      });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div 
          className="px-6 py-5 flex items-center justify-between text-white"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <MessageSquareHeart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">Satisfaction Client</h3>
              <p className="text-xs text-white/85">Donnez votre avis en 30 secondes</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Note Globale de la Prestation
                </span>
                
                {/* 5 Etoiles interactives */}
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-9 h-9 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs font-semibold text-slate-600 mt-2">
                  {rating === 5 && '🌟 Exceptionnel — Service irréprochable'}
                  {rating === 4 && '👍 Très satisfaisant — Rien à redire'}
                  {rating === 3 && '😐 Moyen — Des points à perfectionner'}
                  {rating <= 2 && '⚠️ Insatisfait — Nous devons faire mieux'}
                </p>
              </div>

              {/* Critère prédominant */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Quel aspect souhaitez-vous souligner ?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'accueil', label: 'Accueil' },
                    { id: 'rapidite', label: 'Rapidité' },
                    { id: 'solution', label: 'Clarté' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCriterion(tab.id)}
                      className={`text-xs py-2.5 px-3 rounded-xl font-bold transition-all border ${
                        criterion === tab.id
                          ? 'text-white border-transparent shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      style={{
                        backgroundColor: criterion === tab.id ? theme.colors.primary : 'transparent'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

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
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                primaryColor={theme.colors.primary}
                className="w-full"
              >
                {isSubmitting ? 'Transmission en cours...' : 'Transmettre mon Évaluation'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div 
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-2xl font-black text-slate-900">Merci de votre avis !</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                Votre commentaire nous aide à perfectionner en continu la qualité de service dans nos agences.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-8 py-3 rounded-2xl text-white font-bold text-sm shadow-md"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
