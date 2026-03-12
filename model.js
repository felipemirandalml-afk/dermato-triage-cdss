/**
 * model.js - Motor Clínico Canónico CDSS v6.0
 * Arquitectura de "Única Fuente de Verdad"
 */

// 1. DICCIONARIO MAESTRO DE VARIABLES (120+ Features)
export const FEATURE_INDEX = {};
export const FEATURE_LABELS = {};

const featureGroups = {
    basics: ['edad', 'fototipo', 'sexo_male', 'sexo_female'],
    red_flags: ['inmunosupresion', 'farmacos_recientes', 'riesgo_metabolico', 'signo_fiebre', 'signo_dolor', 'signo_mucosas'],
    primarias: ['lesion_macula', 'lesion_mancha', 'lesion_papula', 'lesion_placa', 'lesion_nodulo', 'lesion_habon', 'lesion_eritema', 'lesion_purpura', 'lesion_telangiectasia', 'lesion_comedon', 'lesion_quiste', 'lesion_tumor', 'lesion_vegetacion'],
    liquidas: ['lesion_vesicula', 'lesion_ampolla', 'lesion_bula', 'lesion_pustula'],
    secundarias: ['lesion_escama', 'lesion_costra', 'lesion_escara', 'lesion_erosion', 'lesion_ulcera', 'lesion_excoriacion', 'lesion_fisura', 'lesion_atrofia', 'lesion_esclerosis', 'lesion_liquenificacion', 'lesion_cicatriz'],
    topografia: [
        'topog_cabeza', 'topo_cuero_cabelludo', 'topo_cara_centro', 'topo_cuello',
        'topog_tronco', 'topo_pecho', 'topo_abdomen', 'topo_espalda', 'topo_axilas',
        'topog_ext_inf', 'topo_muslos', 'topo_rodillas', 'topo_espinillas', 'topo_pantorrillas', 'topo_tobillos', 'topo_pies', 'topo_plantas', 'topo_dorso_pies'
    ],
    patrones: ['patron_acral', 'patron_dermatomal', 'patron_seborreica', 'patron_fotoexpuesto', 'patron_simetrico', 'patron_extensoras', 'patron_flexoras', 'patron_generalizado'],
    timing: ['tiempo_agudo', 'tiempo_subagudo', 'tiempo_cronico']
};

// Inicialización automática del índice
let i = 0;
Object.values(featureGroups).flat().forEach(f => {
    FEATURE_INDEX[f] = i++;
});

// Mapeo de etiquetas para el motor de explicabilidad
export const FEATURE_MAP_LABELS = {
    farmacos_recientes: "Exposición a Fármacos Sistémicos",
    signo_fiebre: "Respuesta Inflamatoria Sistémica",
    lesion_ampolla: "Formación de Ampollas",
    lesion_bula: "Dermatosis Ampollosa Mayor",
    lesion_ulcera: "Pérdida de Continuidad Tisular",
    lesion_purpura: "Extravasación Hemática (Púrpura)",
    patron_generalizado: "Compromiso Extenso de Superficie",
    tiempo_agudo: "Instauración Hiperaguda",
    inmunosupresion: "Estado de Inmunocompromiso",
    tiempo_cronico: "Evolución Crónica (>6 sem)",
    lesion_escama: "Descamación Superficial",
    signo_dolor: "Dolor Intenso / Progresivo",
    signo_mucosas: "Compromiso de Mucosas",
    lesion_nodulo: "Lesión Nodular",
    lesion_tumor: "Lesión Tumoral / Masa",
    lesion_erosion: "Erosiones Cutáneas",
    lesion_ulcera: "Ulceración Profunda"
};

// 2. CONFIGURACIÓN DEL MODELO (Pesos Estratégicos)
export const MODEL_WEIGHTS = {
    labels: ["Prioridad 3 - Estable", "Prioridad 2 - Derivación", "Prioridad 1 - URGENCIAL"],
    biases: [4.0, 0.0, -12.0],
    
    // Motor de pesos dinámico para escala de 120+ variables
    getWeight: (priorityIdx, featureIdx) => {
        const featureKey = Object.keys(FEATURE_INDEX).find(k => FEATURE_INDEX[k] === featureIdx);
        if (!featureKey) return 0;

        // PRIORIDAD 1: ALTA (Rojo)
        if (priorityIdx === 2) { 
            if (featureKey.includes('ampolla') || featureKey.includes('bula')) return 12;
            if (featureKey.includes('ulcera') || featureKey.includes('erosion')) return 8;
            if (featureKey.includes('farmacos')) return 10;
            if (featureKey.includes('fiebre')) return 12; // Calibrado: Flag crítico
            if (featureKey.includes('agudo')) return 6; // Calibrado: requiere red flags para P1
            if (featureKey.includes('purpura')) return 10;
            if (featureKey.includes('generalizado')) return 6; // Calibrado: requiere red flags para P1
            if (featureKey.includes('inmunosupresion')) return 6;
            if (featureKey.includes('dolor')) return 10; // Calibrado: Flag crítico
            if (featureKey.includes('mucosas')) return 8;
        }
        
        // PRIORIDAD 3: BAJA (Verde)
        if (priorityIdx === 0) { 
            if (featureKey.includes('cronico')) return 4; // Ajustado para no bloquear neoplasias
            if (featureKey.includes('cicatriz') || featureKey.includes('atrofia')) return 3;
            if (featureKey.includes('escama')) return 1.5;
        }

        // PRIORIDAD 2: MEDIA (Ámbar)
        if (priorityIdx === 1) {
            if (featureKey.includes('nodulo') || featureKey.includes('tumor')) return 10; // Calibrado para Neoplasia
            if (featureKey.includes('telangiectasia')) return 5; // Calibrado para Neoplasia
            if (featureKey.includes('subagudo')) return 2; // Reducido para evitar Acné a P2
            if (featureKey.includes('cabeza')) return 0.5; // Reducido para evitar Acné a P2
            if (featureKey.includes('dolor')) return 8;
            if (featureKey.includes('vesicula')) return 5;
            if (featureKey.includes('purpura')) return 6;
            if (featureKey.includes('generalizado')) return 4;
            if (featureKey.includes('agudo')) return 4; // Agregado para urgencias no vitales (Celulitis)
        }

        return 0.1; // Ruido base para estabilidad numérica
    }
};

// 3. FUNCIONES DE INFERENCIA
export function encodeFeatures(formData) {
    const X = new Array(Object.keys(FEATURE_INDEX).length).fill(0);
    
    // Mapeo dinámico: busca IDs del formData en el FEATURE_INDEX
    for (const [key, value] of Object.entries(formData)) {
        // Mapeos especiales
        if (key === 'age') {
            X[FEATURE_INDEX.edad] = (parseFloat(value) || 0) / 100;
            continue;
        }
        if (key === 'fitzpatrick') {
            X[FEATURE_INDEX.fototipo] = parseInt(value) || 1;
            continue;
        }

        if (FEATURE_INDEX[key] !== undefined) {
            if (typeof value === 'boolean') {
                X[FEATURE_INDEX[key]] = value ? 1 : 0;
            }
        }
    }

    // Mapeo de Timing radiogroup
    if (formData.timing) {
        if (formData.timing === 'acute') X[FEATURE_INDEX.tiempo_agudo] = 1;
        if (formData.timing === 'subacute') X[FEATURE_INDEX.tiempo_subagudo] = 1;
        if (formData.timing === 'chronic') X[FEATURE_INDEX.tiempo_cronico] = 1;
    }

    return X;
}

function softmax(scores) {
    const maxZ = Math.max(...scores);
    const exps = scores.map(zi => Math.exp(zi - maxZ));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(ei => ei / sumExps);
}

export function predict(X) {
    const scores = [0, 1, 2].map(priorityIdx => {
        let sum = MODEL_WEIGHTS.biases[priorityIdx];
        X.forEach((val, fIdx) => {
            sum += val * MODEL_WEIGHTS.getWeight(priorityIdx, fIdx);
        });
        return sum;
    });

    const probs = softmax(scores);
    const winIdx = probs.indexOf(Math.max(...probs));
    
    return {
        classIdx: winIdx,
        probabilities: probs,
        priority: [3, 2, 1][winIdx],
        label: MODEL_WEIGHTS.labels[winIdx]
    };
}

export function explain(X, winningClassIdx) {
    const contribs = Object.keys(FEATURE_INDEX).map(fKey => {
        const fIdx = FEATURE_INDEX[fKey];
        return {
            name: FEATURE_MAP_LABELS[fKey] || fKey.replace('lesion_','').replace('topo_','').replace('patron_','').toUpperCase().replace('_',' '),
            val: MODEL_WEIGHTS.getWeight(winningClassIdx, fIdx) * X[fIdx]
        };
    }).filter(c => Math.abs(c.val) > 0.5)
      .sort((a,b) => Math.abs(b.val) - Math.abs(a.val))
      .slice(0, 5);

    return contribs;
}

// 4. CAPA DE INTERPRETACIÓN CLÍNICA ACCIONABLE
export const CLINICAL_GUI = {
    recommendations: {
        1: {
            conduct: "Evaluación urgente / Derivación inmediata a Servicio de Urgencias.",
            timeframe: "Inmediato (Hoy)",
            color: "text-rose-600",
            bg: "bg-rose-50"
        },
        2: {
            conduct: "Derivación prioritaria a Dermatología o evaluación preferente por especialista.",
            timeframe: "Plazo Corto (7-14 días)",
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        3: {
            conduct: "Manejo ambulatorio estándar / Control programado o seguimiento por medicina general.",
            timeframe: "Diferible (Según disponibilidad)",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        }
    },
    warnings: "Esta herramienta es un apoyo a la decisión clínica y no reemplaza el juicio médico presencial. Si el paciente presenta compromiso hemodinámico o insuficiencia respiratoria, actúe según protocolo de emergencia independientemente del resultado."
};

export function interpretResult(X, prediction) {
    // 1. Aplicar Modificadores Clínicos de Seguridad
    const refinedPrediction = applyClinicalModifiers(X, prediction);
    
    const priority = refinedPrediction.priority;
    const rec = CLINICAL_GUI.recommendations[priority];
    
    // 2. Detección de Red Flags para UI
    const redFlags = [];
    const rfMap = {
        signo_mucosas: "Compromiso de Mucosas (Riesgo SJS/NET)",
        signo_fiebre: "Fiebre / Respuesta Inflamatoria Sistémica",
        signo_dolor: "Dolor Intenso (Sospecha de Infección Profunda/Necrosis)",
        lesion_ampolla: "Dermatosis Ampollosa",
        lesion_bula: "Presencia de Bulas Masivas",
        lesion_purpura: "Púrpura Palpable (Sospecha Vasculitis)",
        inmunosupresion: "Paciente Inmunocomprometido",
        farmacos_recientes: "Antecedente de Fármacos Sistémicos Críticos"
    };

    Object.keys(rfMap).forEach(key => {
        if (X[FEATURE_INDEX[key]] === 1) {
            redFlags.push(rfMap[key]);
        }
    });

    // 3. Justificación Dinámica
    const topSignals = explain(X, refinedPrediction.classIdx);
    let justification = "";
    
    if (refinedPrediction.modifier) {
        justification = `[Ajuste Clínico] ${refinedPrediction.modifier}. Basado en `;
    } else {
        justification = "Priorización basada en ";
    }

    if (topSignals.length > 0) {
        justification += topSignals.map(s => s.name.toLowerCase()).join(", ") + ".";
    } else {
        justification = "Presentación clínica sin señales de alarma dominantes.";
    }

    return {
        ...refinedPrediction,
        conduct: rec.conduct,
        timeframe: rec.timeframe,
        redFlags: redFlags,
        justification: justification,
        ui: { color: rec.color, bg: rec.bg },
        disclaimer: CLINICAL_GUI.warnings
    };
}

/**
 * 5. MODIFICADORES DE RIESGO CLÍNICO (Capas Heurísticas de Seguridad)
 */
export function applyClinicalModifiers(X, result) {
    let finalPriority = result.priority;
    let modifierApplied = null;

    const has = (key) => X[FEATURE_INDEX[key]] === 1;

    // A. RIESGO OCULAR / PERIOCULAR
    if (has('topog_cabeza') && has('topo_cara_centro') && (has('lesion_vesicula') || has('signo_dolor'))) {
        if (finalPriority > 1) {
            finalPriority = 1;
            modifierApplied = "Riesgo Ocular / Compromiso de Cara Centrofacial";
        }
    }

    // B. ISQUEMIA O NECROSIS TISULAR
    if ((has('lesion_escara') || has('lesion_ulcera') || has('lesion_purpura')) && has('tiempo_agudo')) {
        if (finalPriority > 1) {
            finalPriority = 1;
            modifierApplied = "Signos de Isquemia o Necrosis Tisular Aguda";
        }
    }

    // C. SOSPECHA AUTOINMUNE / AMPOLLOSA GRAVE
    if ((has('lesion_ampolla') || has('lesion_erosion')) && 
        (has('signo_mucosas') || has('signo_dolor') || has('patron_generalizado') || has('patron_seborreica')) &&
        !has('tiempo_cronico')) {
        if (finalPriority > 1) {
            finalPriority = 1;
            modifierApplied = "Sospecha de Dermatosis Ampollosa o Compromiso Sistémico";
        }
    }

    // D. SOSPECHA DE MALIGNIDAD (Cáncer de Piel) - Bloquea downscales
    const isSuspectTime = has('tiempo_cronico') || has('tiempo_subagudo');
    const isMalignantLesion = has('lesion_nodulo') || has('lesion_tumor') || has('lesion_ulcera');
    if (isSuspectTime && isMalignantLesion) {
        if (finalPriority > 2) {
            finalPriority = 2;
            modifierApplied = "Sospecha de Lesión Maligna / Neoplasia (Alta Prioridad)";
        }
        return buildResult(finalPriority, modifierApplied, result);
    }

    // E. REACCIONES ESPECÍFICAS (Acrales / Farmacodermias Simples) - Bloquea downscales
    if (has('patron_acral') && has('tiempo_agudo') && finalPriority > 2) {
        finalPriority = 2;
        modifierApplied = "Reacción Acral Aguda (Estudio de Gatillante)";
        return buildResult(finalPriority, modifierApplied, result);
    }

    if (finalPriority === 1 && has('farmacos_recientes') && !has('signo_fiebre') && !has('signo_dolor') && !has('signo_mucosas') && !has('lesion_ampolla')) {
        finalPriority = 2;
        modifierApplied = "Exantema Medicamentoso Simple (Vigilancia Estándar)";
        return buildResult(finalPriority, modifierApplied, result);
    }

    // F. DOWNSCALE DE SEGURIDAD (Refinamiento de falsos positivos)
    const ageVal = X[FEATURE_INDEX.edad] || 0;
    
    // Lactantes con fiebre y solo máculas (Exantema Súbito)
    if (finalPriority === 1 && has('signo_fiebre') && has('lesion_macula') && ageVal > 0 && ageVal <= 0.02) {
        if (!has('signo_dolor') && !has('signo_mucosas') && !has('lesion_ampolla')) {
            finalPriority = 3;
            modifierApplied = "Exantema Viral Benigno Probable (Pediátrico)";
            return buildResult(finalPriority, modifierApplied, result);
        }
    }

    // Cuadros inflamatorios locales o generalizados estables (no agudos extremos)
    if (finalPriority === 2 && !has('signo_fiebre') && !has('signo_dolor') && !has('farmacos_recientes')) {
        if (!has('lesion_ampolla') && !has('lesion_purpura') && !has('lesion_erosion')) {
            // Permitimos P3 si es localizado O si es generalizado pero ya subagudo/crónico
            if (!has('patron_generalizado') || has('tiempo_subagudo') || has('tiempo_cronico')) {
                finalPriority = 3;
                modifierApplied = "Cuadro Inflamatorio Estable (Manejo Ambulatorio)";
                return buildResult(finalPriority, modifierApplied, result);
            }
        }
    }

    if (modifierApplied) {
        return buildResult(finalPriority, modifierApplied, result);
    }

    return result;
}

/**
 * Helper para construir el objeto de resultado con el modificador
 */
function buildResult(priority, modifier, originalResult) {
    const labels = { 1: "URGENCIAL", 2: "PRIORITARIO", 3: "ESTABLE" };
    return {
        ...originalResult,
        priority: priority,
        label: `Prioridad ${priority} - ${labels[priority]}`,
        modifier: modifier
    };
}

