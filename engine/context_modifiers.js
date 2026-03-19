// Umbrales etarios clínicos para modificadores de contexto (años reales)
const AGE_THRESHOLD_GERIATRIC = 75; // Alta vulnerabilidad geriátrica
const AGE_THRESHOLD_INFANT = 2;     // Período de lactantes

export function applyContextModifiers(helper, currentResult) {
    const { has, get } = helper;
    let priority = currentResult.priority;
    let modifier = currentResult.modifier || null;
    const rules = [];

    // A. CONTEXTO DIABÉTICO / ISQUÉMICO
    if (has('diabetes') && (has('ulcera') || has('escara')) && (has('topog_ext_inf') || has('topo_pies'))) {
        const desc = "Riesgo de Isquemia Crítica / Pie Diabético en Riesgo";
        rules.push(`🚨 Contexto: ${desc}`);
        if (priority > 1) {
            priority = 1;
            modifier = desc;
        }
    }

    // B. CONTEXTO DE INMUNOSUPRESIÓN
    if (has('inmunosupresion') && (has('generalizado') || has('topog_cabeza') || has('agudo'))) {
        const desc = "Evaluación Prioritaria por Estado de Inmunocompromiso";
        rules.push(`⚠️ Contexto: ${desc}`);
        if (priority > 2) {
            priority = 2;
            modifier = desc;
        }
    }

    // C. CONTEXTO DE ITS SISTÉMICA
    if (has('patron_acral') && has('generalizado') && !has('cronico')) {
        const desc = "Sospecha de ITS Sistémica (Patrón Acral/Generalizado)";
        rules.push(`⚠️ Contexto: ${desc}`);
        if (priority > 2) {
            priority = 2;
            modifier = desc;
        }
    }

    // D. CONTEXTO DE MALIGNIDAD ACRAL
    if ((has('patron_acral') || has('topo_pies')) && has('cronico') && (has('mancha') || has('nodulo'))) {
        const desc = "Sospecha de Malignidad en Localización Acral";
        rules.push(`ℹ️ Contexto: ${desc}`);
        if (priority > 2) {
            priority = 2;
            modifier = desc;
        }
    }

    // E. CONTEXTO GERIÁTRICO / VULNERABILIDAD
    const ageVal = get('edad'); 
    if (ageVal >= AGE_THRESHOLD_GERIATRIC && has('generalizado') && (has('costra') || has('escama'))) {
        const desc = "Vulnerabilidad Geriátrica: Cuadro Generalizado Costroso";
        rules.push(`ℹ️ Contexto: ${desc}`);
        if (priority > 2) {
            priority = 2;
            modifier = desc;
        }
    }

    return { priority, modifier, rules, match: rules.length > 0 };
}

/**
 * Reglas de refinamiento (Downscales)
 * Se ejecutan al final solo si nada más escaló la prioridad.
 */
export function applyRefinementModifiers(helper, currentResult) {
    const { has, get } = helper;
    let priority = currentResult.priority;
    let modifier = currentResult.modifier || null;
    const rules = [];
    const ageVal = get('edad');

    // F. DOWNSCALES DE SEGURIDAD
    // Lactantes con fiebre y solo máculas (Exantema Súbito)
    if (priority === 1 && has('fiebre') && has('macula') && ageVal > 0 && ageVal <= AGE_THRESHOLD_INFANT) {
        if (!has('dolor') && !has('signo_mucosas') && !has('bula_ampolla')) {
            const desc = "Exantema Viral Benigno Probable (Pediátrico)";
            rules.push(`✨ Refinamiento: ${desc}`);
            priority = 3;
            modifier = desc;
        }
    }

    // Cuadros inflamatorios locales o generalizados estables
    // BLOQUEO DE REFINAMIENTO: No bajar si hay sospecha de malignidad o compromiso sistémico específico
    if (priority === 2 && !has('fiebre') && !has('dolor') && !has('farmacos_recientes')) {
        const isSuspectMalignancy = has('nodulo') || has('tumor') || has('mancha');
        const isHighConcernPattern = has('patron_acral') || has('patron_lineal') || has('inmunosupresion');
        
        if (isSuspectMalignancy || isHighConcernPattern) {
            return { priority, modifier, rules, match: false };
        }

        if (!has('bula_ampolla') && !has('purpura') && !has('erosion')) {
            if (!has('generalizado') || has('subagudo') || has('cronico')) {
                const desc = "Cuadro Inflamatorio Estable (Manejo Ambulatorio)";
                rules.push(`✨ Refinamiento: ${desc}`);
                priority = 3;
                modifier = desc;
            }
        }
    }

    return { priority, modifier, rules, match: rules.length > 0 };
}
