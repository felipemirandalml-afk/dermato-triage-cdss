/**
 * safety_modifiers.js - Reglas de seguridad basadas en morfología y señales críticas
 */

export function applySafetyModifiers(helper, currentResult) {
    const { has } = helper;
    const priority = currentResult.priority;

    // A. RIESGO OCULAR / PERIOCULAR
    if (has('topog_cabeza') && has('topo_cara_centro') && (has('lesion_vesicula') || has('signo_dolor'))) {
        return { 
            priority: priority > 1 ? 1 : priority, 
            modifier: priority > 1 ? "Riesgo Ocular / Compromiso de Cara Centrofacial" : null,
            match: true 
        };
    }

    // B. ISQUEMIA O NECROSIS TISULAR
    if ((has('lesion_escara') || has('lesion_ulcera') || has('lesion_purpura')) && has('tiempo_agudo')) {
        return { 
            priority: priority > 1 ? 1 : priority, 
            modifier: priority > 1 ? "Signos de Isquemia o Necrosis Tisular Aguda" : null,
            match: true 
        };
    }

    // C. SOSPECHA AUTOINMUNE / AMPOLLOSA GRAVE
    if ((has('lesion_ampolla') || has('lesion_erosion')) && 
        (has('signo_mucosas') || has('signo_dolor') || has('patron_generalizado') || has('patron_seborreica')) &&
        !has('tiempo_cronico')) {
        return { 
            priority: priority > 1 ? 1 : priority, 
            modifier: priority > 1 ? "Sospecha de Dermatosis Ampollosa o Compromiso Sistémico" : null,
            match: true 
        };
    }

    return null;
}

/**
 * Modificadores de bloqueo (previenen downscales o fuerzan prioridades intermedias)
 * Se ejecutan DESPUÉS de los modificadores de contexto si no hubo match previo.
 */
export function applyBlockModifiers(helper, currentResult) {
    const { has } = helper;
    const priority = currentResult.priority;

    // I. SOSPECHA DE MALIGNIDAD (Shield)
    const isSuspectTime = has('tiempo_cronico') || has('tiempo_subagudo');
    const isMalignantLesion = has('lesion_nodulo') || has('lesion_tumor') || has('lesion_ulcera');
    if (isSuspectTime && isMalignantLesion) {
        return { 
            priority: priority > 2 ? 2 : priority, 
            modifier: priority > 2 ? "Sospecha de Lesión Maligna / Neoplasia (Alta Prioridad)" : null,
            match: true 
        };
    }

    // E. REACCIONES ESPECÍFICAS (Acrales / Farmacodermias Simples)
    if (has('patron_acral') && has('tiempo_agudo')) {
        return { 
            priority: priority > 2 ? 2 : priority, 
            modifier: priority > 2 ? "Reacción Acral Aguda (Estudio de Gatillante)" : null,
            match: true 
        };
    }

    if (priority === 1 && has('farmacos_recientes') && !has('signo_fiebre') && !has('signo_dolor') && !has('signo_mucosas') && !has('lesion_ampolla')) {
        return { priority: 2, modifier: "Exantema Medicamentoso Simple (Vigilancia Estándar)", match: true };
    }

    return null;
}
