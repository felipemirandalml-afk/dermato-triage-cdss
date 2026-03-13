/**
 * context_modifiers.js - Ajustes por contexto clínico del paciente
 */

export function applyContextModifiers(helper, currentResult) {
    const { has, get } = helper;
    const priority = currentResult.priority;

    // A. CONTEXTO DIABÉTICO / ISQUÉMICO
    if (has('riesgo_metabolico') && (has('lesion_ulcera') || has('lesion_escara')) && (has('topog_ext_inf') || has('topo_pies'))) {
        return { 
            priority: priority > 1 ? 1 : priority, 
            modifier: priority > 1 ? "Riesgo de Isquemia Crítica / Pie Diabético en Riesgo" : null,
            match: true 
        };
    }

    // B. CONTEXTO DE INMUNOSUPRESIÓN
    if (has('inmunosupresion') && (has('patron_generalizado') || has('topog_cabeza') || has('tiempo_agudo'))) {
        return { 
            priority: priority > 2 ? 2 : priority, 
            modifier: priority > 2 ? "Evaluación Prioritaria por Estado de Inmunocompromiso" : null,
            match: true 
        };
    }

    // C. CONTEXTO DE ITS SISTÉMICA
    if (has('patron_acral') && has('patron_generalizado') && !has('tiempo_cronico')) {
        return { 
            priority: priority > 2 ? 2 : priority, 
            modifier: priority > 2 ? "Sospecha de ITS Sistémica (Patrón Acral/Generalizado)" : null,
            match: true 
        };
    }

    // D. CONTEXTO DE MALIGNIDAD ACRAL
    if ((has('patron_acral') || has('topo_pies')) && has('tiempo_cronico') && (has('lesion_mancha') || has('lesion_nodulo'))) {
        return { 
            priority: priority > 2 ? 2 : priority, 
            modifier: priority > 2 ? "Sospecha de Malignidad en Localización Acral" : null,
            match: true 
        };
    }

    // E. CONTEXTO GERIÁTRICO / VULNERABILIDAD
    const ageVal = get('edad'); 
    if (ageVal > 0.75 && has('patron_generalizado') && (has('lesion_costra') || has('lesion_escama'))) {
        return { 
            priority: priority > 2 ? 2 : priority, 
            modifier: priority > 2 ? "Vulnerabilidad Geriátrica: Cuadro Generalizado Costroso" : null,
            match: true 
        };
    }

    return null;
}

/**
 * Reglas de refinamiento (Downscales)
 * Se ejecutan al final solo si nada más escaló la prioridad.
 */
export function applyRefinementModifiers(helper, currentResult) {
    const { has, get } = helper;
    const priority = currentResult.priority;
    const ageVal = get('edad');

    // F. DOWNSCALES DE SEGURIDAD
    // Lactantes con fiebre y solo máculas (Exantema Súbito)
    if (priority === 1 && has('signo_fiebre') && has('lesion_macula') && ageVal > 0 && ageVal <= 0.02) {
        if (!has('signo_dolor') && !has('signo_mucosas') && !has('lesion_ampolla')) {
            return { priority: 3, modifier: "Exantema Viral Benigno Probable (Pediátrico)", match: true };
        }
    }

    // Cuadros inflamatorios locales o generalizados estables
    if (priority === 2 && !has('signo_fiebre') && !has('signo_dolor') && !has('farmacos_recientes')) {
        if (!has('lesion_ampolla') && !has('lesion_purpura') && !has('lesion_erosion')) {
            if (!has('patron_generalizado') || has('tiempo_subagudo') || has('tiempo_cronico')) {
                return { priority: 3, modifier: "Cuadro Inflamatorio Estable (Manejo Ambulatorio)", match: true };
            }
        }
    }

    return null;
}
