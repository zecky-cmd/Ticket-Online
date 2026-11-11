import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Créneaux horaires types en agence (de 08h30 à 16h30)
 * Tranches de 15 minutes.
 */
const DEFAULT_TIMESLOTS = [
  '08:30', '08:45',
  '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45',
  '11:00', '11:15', '11:30', '11:45',
  '12:00', '12:15', '14:00', '14:15',
  '14:30', '14:45', '15:00', '15:15',
  '15:30', '15:45', '16:00', '16:15',
  '16:30',
];

/** Nombre de créneaux visibles par défaut (2 lignes de 7 = 14) */
const INITIAL_VISIBLE_COUNT = 14;

/**
 * Formate le libellé du mois et de l'année (ex: "Novembre 2026")
 */
function formatMonthYear(date) {
  const label = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Formate le nom court du jour (Today, Tomorrow, ou Mer, Jeu...)
 */
function formatDayHeader(targetDate, todayDate) {
  const isToday =
    targetDate.getDate() === todayDate.getDate() &&
    targetDate.getMonth() === todayDate.getMonth() &&
    targetDate.getFullYear() === todayDate.getFullYear();

  if (isToday) return 'Aujourd\'hui';

  const tomorrow = new Date(todayDate);
  tomorrow.setDate(todayDate.getDate() + 1);
  const isTomorrow =
    targetDate.getDate() === tomorrow.getDate() &&
    targetDate.getMonth() === tomorrow.getMonth() &&
    targetDate.getFullYear() === tomorrow.getFullYear();

  if (isTomorrow) return 'Demain';

  const dayStr = targetDate.toLocaleDateString('fr-FR', { weekday: 'short' });
  return dayStr.charAt(0).toUpperCase() + dayStr.slice(1).replace('.', '');
}

/**
 * Étape 4 : Choix Date et Heure — Réplique exacte de la maquette
 * 
 * - Sélecteur de mois avec flèches < Mois, Année >
 * - Sélecteur de jours horizontal avec flèches < et > sur les côtés
 * - Style tab/souligné noir sur le jour actif posé sur la ligne de séparation
 * - Grille de créneaux en tuiles douces
 * - Bouton "Afficher plus de créneaux ⌵ (X disponibles)"
 */
export default function StepTimeslot({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  availableSlots = DEFAULT_TIMESLOTS,
  theme,
}) {
  const primaryColor = theme?.colors?.primary || '#008056';
  const today = useMemo(() => new Date(), []);

  // Décalage du jour de début du carousel (par pas de 7 jours)
  const [dayOffset, setDayOffset] = useState(0);
  const [showAllSlots, setShowAllSlots] = useState(false);

  // Génération de 28 jours ouvrés consécutifs (hors dimanches)
  const daysList = useMemo(() => {
    const list = [];
    let current = new Date(today);
    current.setHours(0, 0, 0, 0);

    let count = 0;
    while (count < 28) {
      if (current.getDay() !== 0) {
        const iso = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(
          current.getDate()
        ).padStart(2, '0')}`;
        list.push({
          date: new Date(current),
          iso,
          dayNumber: current.getDate(),
          header: formatDayHeader(current, today),
        });
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return list;
  }, [today]);

  // Sélection automatique du premier jour si rien n'est sélectionné
  useMemo(() => {
    if (!selectedDate && daysList.length > 0) {
      setSelectedDate(daysList[0].iso);
    }
  }, [selectedDate, daysList, setSelectedDate]);

  // Fenêtre de 7 jours affichée
  const visibleDaysCount = 7;
  const maxOffset = Math.max(0, daysList.length - visibleDaysCount);
  const visibleDays = daysList.slice(dayOffset, dayOffset + visibleDaysCount);

  // Mois actif calculé à partir du jour sélectionné ou premier jour visible
  const activeMonthDate = useMemo(() => {
    if (selectedDate) {
      const [y, m, d] = selectedDate.split('-');
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
    return visibleDays[0]?.date || today;
  }, [selectedDate, visibleDays, today]);

  // Navigation de mois : avance ou recule de ~30 jours
  const handlePrevMonth = () => {
    setDayOffset((prev) => Math.max(0, prev - 7));
  };
  const handleNextMonth = () => {
    setDayOffset((prev) => Math.min(maxOffset, prev + 7));
  };

  // Créneaux affichés (accordéon)
  const displayedSlots = showAllSlots
    ? availableSlots
    : availableSlots.slice(0, INITIAL_VISIBLE_COUNT);
  const remainingSlotsCount = Math.max(0, availableSlots.length - INITIAL_VISIBLE_COUNT);

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      {/* ── 1. EN-TÊTE : TITRE À GAUCHE & NAVIGATION DU MOIS À DROITE ── */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Choisissez la date et l'heure
        </h3>

        {/* Bouton de mois avec ses flèches < Novembre, 2026 > */}
        <div className="flex items-center border border-slate-200/90 rounded-xl px-2 py-1.5 bg-white text-slate-700 shadow-2xs select-none">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={dayOffset === 0}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer transition-colors"
            title="Mois précédent"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs sm:text-sm font-semibold text-slate-800 px-3 min-w-[120px] text-center">
            {formatMonthYear(activeMonthDate)}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            disabled={dayOffset >= maxOffset}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer transition-colors"
            title="Mois suivant"
            aria-label="Mois suivant"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── 2. SÉLECTEUR DE JOURS HORIZONTAL AVEC FLÈCHES < ET > LATÉRALES ── */}
      <div className="pt-2">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Flèche gauche pour défiler les jours */}
          <button
            type="button"
            onClick={() => setDayOffset((prev) => Math.max(0, prev - 1))}
            disabled={dayOffset === 0}
            className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-20 cursor-pointer transition-colors shrink-0"
            title="Jour précédent"
            aria-label="Jour précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Grille des 7 jours */}
          <div className="flex-1 grid grid-cols-7 gap-1">
            {visibleDays.map((d) => {
              const isSelected = selectedDate === d.iso;

              return (
                <div
                  key={d.iso}
                  onClick={() => setSelectedDate(d.iso)}
                  className="flex flex-col items-center justify-center cursor-pointer select-none group relative pb-2"
                >
                  {/* Libellé haut (Today, Tomorrow, Wed...) */}
                  <span
                    className={`text-[11px] sm:text-xs font-medium tracking-tight transition-colors ${
                      isSelected ? 'font-bold text-slate-900' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {d.header}
                  </span>

                  {/* Numéro du jour (10, 11, 12...) */}
                  <span
                    className={`text-base sm:text-lg tracking-tight mt-1 transition-colors ${
                      isSelected ? 'font-black text-slate-950 scale-105' : 'font-bold text-slate-700 group-hover:text-slate-900'
                    }`}
                  >
                    {d.dayNumber}
                  </span>

                  {/* Ligne noire marquée sous le jour actif (exactement comme sur la maquette) */}
                  {isSelected && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-slate-900 rounded-full z-10 animate-in fade-in-50 duration-150" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Flèche droite pour défiler les jours */}
          <button
            type="button"
            onClick={() => setDayOffset((prev) => Math.min(maxOffset, prev + 1))}
            disabled={dayOffset >= maxOffset}
            className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-20 cursor-pointer transition-colors shrink-0"
            title="Jour suivant"
            aria-label="Jour suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Ligne continue de séparation sur laquelle reposent les jours */}
        <div className="w-full border-b border-slate-200/90 -mt-[1px]" />
      </div>

      {/* ── 3. GRILLE DE CRÉNEAUX HORAIRES (TIME SLOTS) ── */}
      <div className="pt-2">
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {displayedSlots.map((slot) => {
            const isSelected = selectedTime === slot;

            return (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTime(slot)}
                className={`py-2 px-1 rounded-xl text-xs sm:text-[13px] tracking-tight font-medium text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'text-white font-bold shadow-xs'
                    : 'bg-slate-100/70 hover:bg-slate-200/70 text-slate-800'
                }`}
                style={{
                  backgroundColor: isSelected ? primaryColor : undefined,
                }}
              >
                {slot}
              </button>
            );
          })}
        </div>

        {/* Bouton Accordéon : « Show more slots ⌵ (X available) » */}
        {remainingSlotsCount > 0 && (
          <div className="pt-2.5">
            <button
              type="button"
              onClick={() => setShowAllSlots((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer hover:opacity-85"
              style={{ color: primaryColor }}
            >
              <span>
                {showAllSlots
                  ? 'Afficher moins de créneaux'
                  : `Show more slots ⌵  (${remainingSlotsCount} available)`}
              </span>
              {showAllSlots ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : null}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
