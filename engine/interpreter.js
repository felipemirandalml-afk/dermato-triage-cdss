/**
 * interpreter.js - Traducción de resultados técnicos a lenguaje clínico
 */
import { FEATURE_MAP_LABELS, CLINICAL_GUI, PRIORITY_LABELS, FEATURE_INDEX } from './constants.js';
import { getWeight } from './baseline_model.js';

export function buildResult(priority, modifier, originalResult) {
    const label = PRIORITY_LABELS[priority] || "DESCONOCIDO";
    return {
        ...originalResult,
        priority: priority,
        label: `Prioridad ${priority} - ${label}`,
        modifier: modifier
    };
}

export function explain(X, winningClassIdx) {
    const featureKeys = Object.keys(FEATURE_INDEX);
    const contribs = featureKeys.map(fKey => {
        const fIdx = FEATURE_INDEX[fKey];
        return {
            name: FEATURE_MAP_LABELS[fKey] || fKey.replace('lesion_','').replace('topo_','').replace('patron_','').toUpperCase().replace('_',' '),
            val: getWeight(winningClassIdx, fKey) * X[fIdx]
        };
    }).filter(c => Math.abs(c.val) > 0.5)
      .sort((a,b) => Math.abs(b.val) - Math.abs(a.val))
      .slice(0, 5);

    return contribs;
}

export function interpretResult(X, prediction) {
    const priority = prediction.priority;
    const rec = CLINICAL_GUI.recommendations[priority];
    
    // Detección de Red Flags para UI
    const redFlags = [];
    const rfMap = {
        signo_mucosas: "Compromiso de Mucosas (Riesgo SJS/NET)",
        signo_fiebre: "Fiebre / Respuesta Inflamatoria Sistémica",
        signo_dolor: "Dolor Intenso (Sospecha de Infección Profunda/Necrosis)",
        lesion_ampolla: "Dermatosis Ampollosa",
        lesion_bula: "Presencia de Bulas Masivas",
        lesion_purpura: "Púrpura Palpable (Sospecha Vasculitis)",
        inmunosupresion: "Paciente Inmunocompromedido",
        farmacos_recientes: "Antecedente de Fármacos Sistémicos Críticos"
    };

    Object.keys(rfMap).forEach(key => {
        if (X[FEATURE_INDEX[key]] === 1) {
            redFlags.push(rfMap[key]);
        }
    });

    // Justificación Dinámica
    const topSignals = explain(X, prediction.classIdx);
    let justification = "";
    
    if (prediction.modifier) {
        justification = `[Ajuste Clínico] ${prediction.modifier}. Basado en `;
    } else {
        justification = "Priorización basada en ";
    }

    if (topSignals.length > 0) {
        justification += topSignals.map(s => s.name.toLowerCase()).join(", ") + ".";
    } else {
        justification = "Presentación clínica sin señales de alarma dominantes.";
    }

    return {
        ...prediction,
        conduct: rec.conduct,
        timeframe: rec.timeframe,
        redFlags: redFlags,
        justification: justification,
        ui: { color: rec.color, bg: rec.bg },
        disclaimer: CLINICAL_GUI.warnings
    };
}
