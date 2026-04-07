/**
 * safety_modifiers.js - Reglas de seguridad basadas en morfología y señales críticas
 */
import { t } from './i18n_utils.js';

export function applySafetyModifiers(helper, currentResult) {
    const { has } = helper;
    let priority = currentResult.priority;
    let modifier = currentResult.modifier || null;
    const rules = [];

    // A. RIESGO OCULAR / PERIOCULAR
    if (has('topog_cabeza') && has('topo_cara_centro') && (has('vesicula') || has('dolor'))) {
        const desc = t('safety.ocular_risk');
        rules.push(`🚨 Alerta: ${desc}`);
        if (priority > 1) {
            priority = 1;
            modifier = desc;
        }
    }

    // B. ISQUEMIA O NECROSIS TISULAR
    if ((has('escara') || has('ulcera') || has('purpura')) && has('agudo')) {
        const desc = t('safety.ischemia');
        rules.push(`🚨 Alerta: ${desc}`);
        if (priority > 1) {
            priority = 1;
            modifier = desc;
        }
    }

    // C. SOSPECHA AUTOINMUNE / AMPOLLOSA GRAVE
    if ((has('bula_ampolla') || has('erosion') || has('ampolla_nikolsky')) && 
        (has('signo_mucosas') || has('dolor') || has('generalizado') || has('patron_seborreica') || has('ampolla_nikolsky')) &&
        !has('cronico')) {
        const desc = t('safety.blister_autoimmune');
        rules.push(`🚨 Alerta: ${desc}`);
        if (priority > 1) {
            priority = 1;
            modifier = desc;
        }
    }

    // D. NIKOLSKY DIRECTO POSITIVO
    if (has('ampolla_nikolsky') && has('agudo')) {
        const desc = t('safety.nikolsky');
        rules.push(`🚨 Alerta: ${desc}`);
        priority = 1;
        modifier = desc;
    }

    return { priority, modifier, rules, match: rules.length > 0 };
}

/**
 * Modificadores de bloqueo (previenen downscales o fuerzan prioridades intermedias)
 * Se ejecutan DESPUÉS de los modificadores de contexto si no hubo match previo.
 */
export function applyBlockModifiers(helper, currentResult) {
    const { has } = helper;
    let priority = currentResult.priority;
    let modifier = currentResult.modifier || null;
    const rules = [];

    // I. SOSPECHA DE MALIGNIDAD (Shield)
    const isSuspectTime = has('cronico') || has('subagudo');
    const isMalignantLesion = has('nodulo') || has('tumor') || has('ulcera') || has('signo_abcde');
    
    // Alerta específica: Nódulo centrofacial en paciente geriátrico o melanoma abcde
    const isElderly = (helper.get && helper.get('edad') >= 65);
    const isFaceNodule = has('topog_cabeza') && has('topo_cara_centro') && has('nodulo');

    if (has('signo_abcde') || (isSuspectTime && isMalignantLesion) || (isElderly && isFaceNodule)) {
        const desc = t('safety.malignancy');
        rules.push(`⚠️ Bloqueo: ${desc}`);
        if (priority > 2) {
            priority = 2;
            modifier = desc;
        }
    }

    // E. REACCIONES ESPECÍFICAS (Acrales / Farmacodermias Simples)
    if (has('patron_acral') && has('agudo')) {
        const desc = t('safety.acral');
        rules.push(`⚠️ Bloqueo: ${desc}`);
        if (priority > 2) {
            priority = 2;
            modifier = desc;
        }
    }

    // F. INFECCIÓN CRÓNICA / SUPURATIVA
    if (has('fistulas_supuracion')) {
        const desc = t('safety.suppurative');
        rules.push(`⚠️ Bloqueo: ${desc}`);
        if (priority > 2) {
            priority = 2;
            modifier = desc;
        }
    }

    if (priority === 1 && has('farmacos_recientes') && !has('fiebre') && !has('dolor') && !has('signo_mucosas') && !has('bula_ampolla')) {
        const desc = t('safety.drug_rash');
        rules.push(`ℹ️ Ajuste: ${desc}`);
        priority = 2;
        modifier = desc;
    }

    return { priority, modifier, rules, match: rules.length > 0 };
}
