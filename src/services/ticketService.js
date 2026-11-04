import { s2qApiClient } from './api';
import { S2Q_SERVICES } from './serveur';

/**
 * Service Métier : Gestion des Tickets / Rendez-vous en ligne S2Q
 */
export const ticketService = {
  /**
   * Crée une demande de rendez-vous (ticket) en ligne.
   * Route réelle : POST admin-service/public/rendezvous
   *
   * @param {Object} [payload]
   * @param {any} [payload.agency] - Objet Agence (id, name…)
   * @param {any} [payload.service] - Objet Service du catalogue
   * @param {any} [payload.prestation] - Objet Prestation sélectionnée
   * @param {any} [payload.gestionnaire] - Objet Gestionnaire (usrid, name, isAuto)
   * @param {any} [payload.timeslot] - { day, date, time }
   * @param {boolean} [payload.isClient] - Client existant ou non
   * @param {string} [payload.accountNumber] - Numéro de compte client
   * @param {string} [payload.fullName] - Nom complet du client
   * @param {string} [payload.lastName] - Nom de famille
   * @param {string} [payload.firstName] - Prénoms
   * @param {string} [payload.phoneNumber] - Téléphone du client
   * @param {string} [payload.email] - Email du client
   * @returns {Promise<any>} Fiche ticket créée
   */
  async createTicket(payload = {}) {
    const {
      agency,
      service,
      prestation,
      gestionnaire,
      timeslot,
      isClient = false,
      accountNumber = '',
      fullName,
      lastName,
      firstName,
      phoneNumber,
      email,
    } = payload;

    const resolvedFullName = fullName || [lastName, firstName].filter(Boolean).join(' ') || 'Client';

    // Payload conforme au contrat backend S2Q (POST /rendezvous)
    const body = {
      lg_ageid: String(agency?.id ?? ''),
      lg_presid: String(prestation?.id ?? ''),
      lg_usrid: String(gestionnaire?.usrid ?? ''),
      int_ticclient: isClient ? '1' : '0',
      timeslot: {
        day: timeslot?.day || '',
        date: timeslot?.date || '',
        time: timeslot?.time || '',
      },
      serviceName: prestation?.name || '',
      str_ncompteclient: isClient ? accountNumber : '',
      str_ticemail: email || '',
      str_ticlangueclient: 'fr',
      str_ticnom: lastName || '',
      str_ticprenoms: firstName || '',
      str_ticphone: phoneNumber || '',
    };

    const response = await s2qApiClient.post(`/${S2Q_SERVICES.admin}/public/rendezvous`, body);
    const data = response.data?.data || response.data;

    return {
      id: data.lg_ticid || null,
      rdvId: data.lg_rdvid || null,
      code: data.str_ticnumero || '',
      agency: data.str_agedescription || agency?.name || '',
      serviceName: data.str_sername || service?.name || '',
      prestationName: data.str_presname || prestation?.name || '',
      gestionnaire: gestionnaire?.isAuto
        ? 'Premier disponible (Attribution auto)'
        : gestionnaire?.name || '',
      isClient: Boolean(isClient),
      accountNumber: isClient ? accountNumber : '',
      appointmentTime: timeslot?.date && timeslot?.time
        ? `${timeslot.day || timeslot.date} à ${timeslot.time}`
        : 'Créneau à confirmer',
      fullName: resolvedFullName,
      phoneNumber: phoneNumber || '',
      email: email || '',
      date: timeslot?.date || '',
      time: timeslot?.time || '',
      status: data.str_rdvstatut || 'pending',
      createdAt: data.dt_created || null,
    };
  },
};
