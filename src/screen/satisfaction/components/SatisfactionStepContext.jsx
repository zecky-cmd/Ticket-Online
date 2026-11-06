import { ArrowRight } from 'lucide-react';
import Button from '../../../globalComponents/ui/Button';
import SearchSelect from '../../../globalComponents/ui/SearchSelect';

/**
 * Étape Contexte — Agence, Service puis Prestation (réutilise nos endpoints déjà publics)
 */
export default function SatisfactionStepContext({
  agencies = [],
  agenciesLoading = false,
  selectedAgencyId,
  onSelectAgencyId,
  services = [],
  servicesLoading = false,
  selectedServiceId,
  onSelectServiceId,
  selectedPrestationId,
  onSelectPrestationId,
  onNext,
  theme,
}) {
  const currentService = services.find((s) => s.id === selectedServiceId) || null;
  const prestations = currentService?.prestations || [];
  const canContinue = Boolean(selectedAgencyId && selectedServiceId && selectedPrestationId);

  return (
    <div className="space-y-4">
      <SearchSelect
        id="sat-agency-select"
        label="1. Votre agence"
        placeholder={agenciesLoading ? 'Chargement des agences…' : 'Sélectionner une agence…'}
        options={agencies}
        valueKey="id"
        labelKey="name"
        renderLabel={(a) => (a.commune ? `${a.name} — ${a.commune}` : a.name)}
        value={selectedAgencyId ?? null}
        onChange={(id) => id !== null && onSelectAgencyId(id)}
        disabled={agenciesLoading}
      />

      <SearchSelect
        id="sat-service-select"
        label="2. Le service concerné"
        placeholder={
          servicesLoading
            ? 'Chargement des services…'
            : selectedAgencyId
              ? 'Sélectionner un service…'
              : 'Choisissez d\'abord une agence'
        }
        options={services}
        valueKey="id"
        labelKey="name"
        renderLabel={(s) => `${s.name} — ${s.serviceType === 'caisse' ? 'Caisse' : 'Gestionnaire'}`}
        value={selectedServiceId ?? null}
        onChange={(id) => id !== null && onSelectServiceId(id)}
        disabled={servicesLoading || !selectedAgencyId}
      />

      <SearchSelect
        id="sat-prestation-select"
        label="3. La prestation concernée"
        placeholder={selectedServiceId ? 'Sélectionner une prestation…' : 'Choisissez d\'abord un service'}
        options={prestations}
        valueKey="id"
        labelKey="name"
        value={selectedPrestationId ?? null}
        onChange={(id) => id !== null && onSelectPrestationId(id)}
        disabled={!selectedServiceId}
      />

      <div className="pt-2">
        <Button
          type="button"
          size="lg"
          variant="primary"
          primaryColor={theme?.colors?.primary || '#008056'}
          iconEnd={ArrowRight}
          onClick={onNext}
          disabled={!canContinue}
          className="w-full min-h-[50px] font-bold text-sm sm:text-base"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}
