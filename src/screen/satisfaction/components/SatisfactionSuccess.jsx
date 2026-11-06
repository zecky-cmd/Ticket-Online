import { CheckCircle2 } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';

/**
 * Écran de confirmation de l'évaluation transmise
 * La modale se ferme automatiquement après quelques secondes (compte à rebours).
 */
export default function SatisfactionSuccess({ theme, secondsLeft = 0, onClose }) {
  return (
    <div className="py-8 text-center space-y-4">
      <div 
        className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white shadow-xl animate-in zoom-in duration-300"
        style={{ backgroundColor: theme?.colors?.primary }}
      >
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-1">
        <h4 className="text-xl font-black text-slate-900">Merci pour votre retour !</h4>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          Votre avis a été transmis à la direction qualité pour améliorer en continu votre expérience en agence.
        </p>
      </div>

      <div className="pt-4 max-w-xs mx-auto space-y-3">
        <Button
          variant="secondary"
          size="md"
          onClick={onClose}
          className="w-full min-h-[48px]"
        >
          Fermer
        </Button>

        {secondsLeft > 0 && (
          <p className="text-[11px] text-slate-400">
            Fermeture automatique dans <b className="text-slate-600">{secondsLeft}s</b>
          </p>
        )}
      </div>
    </div>
  );
}
