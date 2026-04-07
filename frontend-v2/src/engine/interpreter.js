/**
 * interpreter.js - Traducción de resultados técnicos a lenguaje clínico
 */
import { FEATURE_MAP_LABELS, CLINICAL_GUI, PRIORITY_LABELS, FEATURE_INDEX } from './constants.js';
import { t } from './i18n_utils.js';
import { getWeight } from './baseline_model.js';

import REASONING_MAP from './dermatology_reasoning_map.json' with { type: 'json' };

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
            name: FEATURE_MAP_LABELS[fKey] || fKey.replace('lesion_','').replace('topo_','').replace('patron_','').toUpperCase().replace(/_/g, ' '),
            val: (getWeight(winningClassIdx, fKey) || 0) * X[fIdx]
        };
    }).filter(c => Math.abs(c.val) > 0.5)
      .sort((a,b) => Math.abs(b.val) - Math.abs(a.val))
      .slice(0, 5);

    return contribs;
}

/**
 * Enriquece el resultado con insights del Reasoning Map.
 */
function enrichWithReasoning(syndromeKey, X) {
    const mapEntry = REASONING_MAP[syndromeKey];
    if (!mapEntry) return null;

    return {
        summary: mapEntry.reasoning_summary,
        expected_red_flags: mapEntry.red_flags,
        clinical_subgroup: mapEntry.subgroup.replace(/_/g, ' '),
        // Perla clínica dinámica según el grupo
        pearl: getClinicalPearl(mapEntry.clinical_group)
    };
}

function getClinicalPearl(group) {
    const pearls = {
        'inflammatory_dermatoses': "En dermatosis inflamatorias, la simetría y el tiempo de evolución crónico orientan a causas endógenas.",
        'infectious_diseases': "La progresión rápida y el dolor desproporcionado deben hacer sospechar compromiso de tejidos profundos.",
        'neoplastic_disorders': "Cualquier lesión pigmentada nueva o cambiante en un adulto debe ser evaluada con dermatoscopia.",
        'immune_mediated_disorders': "El compromiso de mucosas es un signo de alarma crítico en farmacodermias."
    };
    return pearls[group] || "Evalúe siempre la estabilidad hemodinámica en cuadros extensos.";
}

export function interpretResult(X, prediction, syndromeKey = null, differentialRanking = [], lang = 'es') {
    const priority = prediction.priority;
    const rec = CLINICAL_GUI.recommendations[priority];
    
    // Detección de Red Flags para UI
    const redFlags = [];
    const rfMap = {
        signo_mucosas: t('rf.mucosa', lang),
        signo_fiebre: t('rf.fever', lang),
        signo_dolor: t('rf.pain', lang),
        lesion_bula_ampolla: t('rf.blister', lang),
        lesion_purpura: t('rf.purpura', lang),
        inmuno: t('rf.immuno', lang),
        farmacos_recientes: t('rf.drugs', lang)
    };

    Object.keys(rfMap).forEach(key => {
        const idx = FEATURE_INDEX[key];
        if (idx !== undefined && X[idx] === 1) {
            redFlags.push(rfMap[key]);
        }
    });

    // --- ALINEACIÓN INTERPRETATIVA (Interpretation Alignment Hardening) ---
    const topDifferential = differentialRanking?.[0]?.disease_name || "";
    const topDiffCompatibility = differentialRanking?.[0]?.compatibility || "Baja";
    
    // Auditoría de Tensión (Discordancia)
    const isShielded = prediction.modifier && prediction.priority < (prediction.baseline_priority || 3);
    const criticalDifferentials = ["Melanoma", "Carcinoma", "Stevens-Johnson", "Necrotizing", "Vasculitis"];
    const hasCriticalDiff = criticalDifferentials.some(d => topDifferential.toLowerCase().includes(d.toLowerCase()));
    const isBenignSyndrome = syndromeKey === "benign_cutaneous_tumor" || syndromeKey === "inflammatory_dermatosis_other";
    
    // Detección directa de sospecha de malignidad (Independiente del ranking de síndrome)
    const hasMalignancyRisk = (FEATURE_INDEX['nodulo'] !== undefined && X[FEATURE_INDEX['nodulo']] === 1) || 
                             (FEATURE_INDEX['tumor'] !== undefined && X[FEATURE_INDEX['tumor']] === 1) ||
                             (FEATURE_INDEX['ulcera'] !== undefined && X[FEATURE_INDEX['ulcera']] === 1);
    const isElderlyHigh = (X[0] || 0) >= 55; // edad >= 55

    // 1. Tensión de Malignidad vs Patrón Benigno (Famoso caso TC-H2-04)
    // Se activa si hay diferencial crítico O si hay hallazgos sospechosos en edad de riesgo con síndrome benigno
    const malignancyMismatch = isBenignSyndrome && (hasCriticalDiff || (hasMalignancyRisk && isElderlyHigh));
    
    // 2. Tensión de Rareza (TC-H2-02 Lúes / Inespecíficos)
    const atypicalPattern = syndromeKey === "inflammatory_dermatosis_other" && prediction.priority <= 2 && !prediction.modifier;

    // Justificación Dinámica
    const topSignals = explain(X, prediction.classIdx);
    let justification = "";
    
    if (prediction.modifier) {
        justification = `${t('ui.alert_security', lang)} ${prediction.modifier}. `;
    } else if (malignancyMismatch) {
        justification = `${t('ui.alert_mismatch', lang)} Riesgo de neoplasia invasiva detectado por criterios de seguridad, pese a patrón probabilístico inespecífico. `;
    } else {
        justification = `${t('ui.priority_based_on', lang)} `;
    }

    if (topSignals.length > 0) {
        const signalText = topSignals.map(s => s.name.toLowerCase()).join(", ");
        justification += (prediction.modifier || malignancyMismatch ? `${t('ui.front_findings', lang)} ` : "") + signalText + ".";
    }

    // Activación del Reasoning Map
    let reasoningInsights = syndromeKey ? enrichWithReasoning(syndromeKey, X) : null;

    // --- AJUSTE DE NARRATIVA DE REASONING SI HAY MISMATCH ---
    if (reasoningInsights) {
        if (malignancyMismatch) {
            reasoningInsights.summary = `ATENCIÓN: Presentación Atípica. Aunque la morfología predominante sugiere un proceso estable, el contexto clínico (edad y tipo de lesión) obliga a descartar ${topDifferential || 'neoplasia maligna'} de forma prioritaria.`;
        } else if (isShielded && isBenignSyndrome) {
            reasoningInsights.summary = `VIGILANCIA: El patrón probabilístico sugiere benignidad, pero existen hallazgos de alarma (p. ej. ${prediction.modifier}) que elevan obligatoriamente la prioridad de atención.`;
        } else if (atypicalPattern) {
            reasoningInsights.summary += " NOTA: Este patrón es polimórfico; considere mimetizadores (lúes, fármacos o atipias) si no hay respuesta a tratamiento.";
        }
    }

    return {
        ...prediction,
        conduct: rec.conduct,
        timeframe: rec.timeframe,
        redFlags: redFlags,
        justification: justification,
        alignment_note: malignancyMismatch ? "Mismatch Detectado: Patrón Benigno vs Diferencial Crítico" : null,
        reasoning_insights: reasoningInsights,
        ui: { color: rec.color, bg: rec.bg },
        disclaimer: CLINICAL_GUI.warnings
    };
}
