export function applyContextModifiers(helper, currentResult) {
    const { has, get } = helper;
    const priority = currentResult.priority;

    // A. CONTEXTO DIABÉTICO / ISQUÉMICO
    if (has('diabetes') && (has('ulcera') || has('escara')) && (has('topog_ext_inf') || has('topo_pies'))) {
        return { 
            priority: priority > 1 ? 1 : priority, 
            modifier: priority > 1 ? "Riesgo de Isquemia Crítica / Pie Diabético en Riesgo" : null,
            match: true 
        };
    }

    // B. CONTEXTO DE INMUNOSUPRESIÓN
    if (has('inmunosupresion') && (has('generalizado') || has('topog_cabeza') || has('agudo'))) {
        return { 
            priority: priority > 2 ? 2 : priority, 
            modifier: priority > 2 ? "Evaluación Prioritaria por Estado de Inmunocompromiso" : null,
            match: true 
        };
    }

    // C. CONTEXTO DE ITS SISTÉMICA
    if (has('patron_acral') && has('generalizado') && !has('cronico')) {
        return { 
            priority: priority > 2 ? 2 : priority, 
            modifier: priority > 2 ? "Sospecha de ITS Sistémica (Patrón Acral/Generalizado)" : null,
            match: true 
        };
    }

    // D. CONTEXTO DE MALIGNIDAD ACRAL
    if ((has('patron_acral') || has('topo_pies')) && has('cronico') && (has('mancha') || has('nodulo'))) {
        return { 
            priority: priority > 2 ? 2 : priority, 
            modifier: priority > 2 ? "Sospecha de Malignidad en Localización Acral" : null,
            match: true 
        };
    }

    // E. CONTEXTO GERIÁTRICO / VULNERABILIDAD
    const ageVal = get('edad'); 
    if (ageVal > 0.75 && has('generalizado') && (has('costra') || has('escama'))) {
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
    // Nota: ageVal en el vector X es la edad raw, no normalizada.
    // 0.02 * 100 = 2 años aprox. Pero en el nuevo encoder, edad es raw.
    // Si ageVal era (parseFloat/100), entonces 0.02 era 2 años.
    // Ahora ageVal es raw, así que debería ser <= 2.
    if (priority === 1 && has('fiebre') && has('macula') && ageVal > 0 && ageVal <= 2) {
        if (!has('dolor') && !has('signo_mucosas') && !has('bula_ampolla')) {
            return { priority: 3, modifier: "Exantema Viral Benigno Probable (Pediátrico)", match: true };
        }
    }

    // Cuadros inflamatorios locales o generalizados estables
    if (priority === 2 && !has('fiebre') && !has('dolor') && !has('farmacos_recientes')) {
        if (!has('bula_ampolla') && !has('purpura') && !has('erosion')) {
            if (!has('generalizado') || has('subagudo') || has('cronico')) {
                return { priority: 3, modifier: "Cuadro Inflamatorio Estable (Manejo Ambulatorio)", match: true };
            }
        }
    }

    return null;
}
