/**
 * ontology_service.js - Capa de integración con la ontología Derm1M
 * Provee mapeos entre síndromes del modelo y la estructura taxonómica oficial.
 * Refactorizado: Síncrono y Determinista.
 */

import { SYNDROME_TO_ONTOLOGY_MAP } from './syndrome_to_ontology_map.js';

/**
 * Obtiene la información enriquecida de la ontología para un síndrome detectado.
 * @param {string} syndromeKey - Clave única del síndrome (ej. 'eczema_dermatitis')
 * @returns {Object|null}
 */
export function getOntologyInfoForSyndrome(syndromeKey) {
    return SYNDROME_TO_ONTOLOGY_MAP[syndromeKey] || null;
}
