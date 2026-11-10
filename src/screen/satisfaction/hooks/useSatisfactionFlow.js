import { useState, useEffect, useRef } from 'react';
import { catalogService } from '../../../services/catalogService';
import { satisfactionService } from '../../../services/satisfactionService';

/**
 * Hook métier du parcours de satisfaction.
 *
 * Concentre tout l'état et l'orchestration :
 * - Contexte (Agence → Service → Prestation) via les endpoints ;
 * - Avis (émoticônes + justificatif unique + texte « Autre ») ;
 * - Recommandation NPS 0-10 ;
 * - Sauvegarde silencieuse du vote dès l'émoticône (anti-abandon) + update final (lg_satvid) ;
 * - Compte à rebours et fermeture automatique après soumission.
 *
 * L'écran (SatisfactionScreen) ne fait que le rendu.
 *
 * @param {Object} opts
 * @param {boolean} opts.isOpen - La modale est-elle ouverte ?
 * @param {() => void} opts.onClose - Callback de fermeture (dispatch Redux côté écran)
 */
export default function useSatisfactionFlow({ isOpen, onClose }) {
  // ── Navigation & vie de la modale ────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const closeRef = useRef(/** @type {(() => void) | null} */ (null));

  // ── 1. Contexte (Agence → Service → Prestation) ──────────────────────────
  const [selectedAgencyId, setSelectedAgencyId] = useState(null);
  const [services, setServices] = useState(/** @type {any[]} */ ([]));
  const [servicesLoading, setServicesLoading] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedPrestationId, setSelectedPrestationId] = useState(null);

  // ── 2. Avis (émoticône + justificatif + commentaire) ─────────────────────
  const [satisfactions, setSatisfactions] = useState(/** @type {any[]} */ ([]));
  const [satisfactionsLoading, setSatisfactionsLoading] = useState(true);
  const [selectedSatis, setSelectedSatis] = useState(/** @type {any} */ (null));
  const [justificatifs, setJustificatifs] = useState(/** @type {any[]} */ ([]));
  const [justificatifsLoading, setJustificatifsLoading] = useState(false);
  const [selectedJustificatif, setSelectedJustificatif] = useState(/** @type {any} */ (null));
  const [comment, setComment] = useState('');

  // ── 3. Recommandation (NPS 0-10) ─────────────────────────────────────────
  const [npsNote, setNpsNote] = useState(/** @type {number | null} */ (null));

  // ── 4. Coordonnées (optionnel) ───────────────────────────────────────────
  const [clientInfo, setClientInfo] = useState({ nom: '', prenoms: '', tel: '', email: '' });

  // ── Vote & réseau ────────────────────────────────────────────────────────
  const [voteId, setVoteId] = useState(/** @type {string | null} */ (null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Objets résolus
  const currentService = services.find((s) => s.id === selectedServiceId) || null;
  const currentPrestation =
    currentService?.prestations?.find((p) => p.id === selectedPrestationId) || null;

  // ── Effets ───────────────────────────────────────────────────────────────

  // Chargement des émoticônes à l'ouverture de la modale
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    satisfactionService
      .getSatisfactions()
      .then((list) => {
        if (active) setSatisfactions(list);
      })
      .catch((err) => {
        console.error('Chargement des émoticônes échoué.', err);
      })
      .finally(() => {
        if (active) setSatisfactionsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isOpen]);

  // Fermeture automatique après soumission : compte à rebours + fermeture différée
  useEffect(() => {
    if (!submitted) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    const timeout = setTimeout(() => {
      closeRef.current?.();
    }, 6500);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [submitted]);

  // ── Actions ──────────────────────────────────────────────────────────────

  /** Sélectionne l'agence et charge ses services */
  const selectAgency = async (/** @type {string} */ id) => {
    setSelectedAgencyId(id);
    setSelectedServiceId(null);
    setSelectedPrestationId(null);
    setServices([]);
    setServicesLoading(true);
    setErrorMessage('');
    try {
      const list = await catalogService.getAgencyPrestations(id);
      setServices(list);
    } catch (err) {
      console.error('Chargement des services échoué.', err);
      setErrorMessage('Impossible de charger les services de cette agence.');
    } finally {
      setServicesLoading(false);
    }
  };

  /** Sélectionne un service et réinitialise la prestation */
  const selectService = (/** @type {string} */ id) => {
    setSelectedServiceId(id);
    setSelectedPrestationId(null);
  };

  /** Sélectionne la prestation */
  const selectPrestation = (/** @type {string} */ id) => {
    setSelectedPrestationId(id);
  };

  /**
   * Sélectionne l'émoticône : sauvegarde silencieuse du vote (anti-abandon)
   * puis chargement des justificatifs associés.
   */
  const selectSatis = async (/** @type {any} */ satis) => {
    setSelectedSatis(satis);
    setSelectedJustificatif(null);
    setComment('');
    setJustificatifs([]);
    setErrorMessage('');

    try {
      const res = await satisfactionService.saveVote({
        lg_ageid: selectedAgencyId,
        lg_serid: currentService?.id,
        lg_presid: currentPrestation?.id,
        lg_satisid: satis.id,
        int_satisnote: satis.note,
      });
      if (res?.success) setVoteId(res.voteId || null);
    } catch (err) {
      console.warn('Sauvegarde silencieuse échouée.', err);
    }

    setJustificatifsLoading(true);
    try {
      const list = await satisfactionService.getJustificatifs(satis.id, satis.order);
      setJustificatifs(list);
    } catch (err) {
      console.warn('Chargement des justificatifs échoué.', err);
    } finally {
      setJustificatifsLoading(false);
    }
  };

  /** Sélectionne un justificatif (le texte libre est réservé au motif « Autre ») */
  const selectJustificatif = (/** @type {any} */ justif) => {
    setSelectedJustificatif(justif);
    if (!justif?.isAutre) {
      setComment('');
    }
  };

  /** Soumission finale : mise à jour du vote (lg_satvid) avec toutes les données */
  const finish = async (/** @type {boolean} */ withClientInfo) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await satisfactionService.saveVote({
        lg_ageid: selectedAgencyId,
        lg_serid: currentService?.id,
        lg_presid: currentPrestation?.id,
        lg_satisid: selectedSatis?.id,
        int_satisnote: selectedSatis?.note,
        int_npsnote: npsNote,
        lg_jusid: selectedJustificatif?.id || undefined,
        str_satvautre: comment,
        lg_satvid: voteId || undefined,
        clientInfo: withClientInfo ? clientInfo : undefined,
      });
      if (res?.success) {
        setVoteId(res.voteId || voteId);
        setSecondsLeft(6);
        setSubmitted(true);
      } else {
        setErrorMessage("Impossible d'enregistrer votre avis. Veuillez réessayer.");
      }
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'avis :', err);
      setErrorMessage('Impossible de joindre le serveur. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Ferme la modale et réinitialise tout le parcours */
  const close = () => {
    setStep(1);
    setSubmitted(false);
    setSelectedAgencyId(null);
    setServices([]);
    setSelectedServiceId(null);
    setSelectedPrestationId(null);
    setSelectedSatis(null);
    setJustificatifs([]);
    setSelectedJustificatif(null);
    setComment('');
    setNpsNote(null);
    setClientInfo({ nom: '', prenoms: '', tel: '', email: '' });
    setVoteId(null);
    setSecondsLeft(0);
    setErrorMessage('');
    onClose();
  };

  /** Navigation entre les étapes */
  const goTo = (/** @type {number} */ target) => {
    setStep(target);
  };

  // Garde une référence à jour de close pour le timer (évite les fermetures obsolètes)
  useEffect(() => {
    closeRef.current = close;
  });

  return {
    // Navigation
    step,
    submitted,
    secondsLeft,
    // État groupé par domaine
    context: {
      selectedAgencyId,
      services,
      servicesLoading,
      selectedServiceId,
      selectedPrestationId,
    },
    rating: {
      satisfactions,
      satisfactionsLoading,
      selectedSatis,
      justificatifs,
      justificatifsLoading,
      selectedJustificatif,
      comment,
    },
    survey: {
      npsNote,
      clientInfo,
      isSubmitting,
      errorMessage,
    },
    // Actions
    actions: {
      goTo,
      selectAgency,
      selectService,
      selectPrestation,
      selectSatis,
      selectJustificatif,
      setComment,
      setNpsNote,
      setClientInfo,
      finish,
      close,
    },
  };
}
