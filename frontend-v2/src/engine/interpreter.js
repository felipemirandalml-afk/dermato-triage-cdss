/**
 * interpreter.js - Traduccion de resultados tecnicos a lenguaje clinico.
 */
import { CLINICAL_GUI, PRIORITY_LABELS, FEATURE_INDEX } from './constants.js';
import { t } from './i18n_utils.js';

import REASONING_MAP from './dermatology_reasoning_map.json' with { type: 'json' };

export function buildResult(priority, modifier, originalResult) {
    const label = PRIORITY_LABELS[priority] || 'DESCONOCIDO';
    return {
        ...originalResult,
        priority,
        label: `Prioridad ${priority} - ${label}`,
        modifier
    };
}

function enrichWithReasoning(syndromeKey) {
    const mapEntry = REASONING_MAP[syndromeKey];
    if (!mapEntry) return null;

    return {
        summary: mapEntry.reasoning_summary,
        expected_red_flags: mapEntry.red_flags,
        clinical_subgroup: mapEntry.subgroup.replace(/_/g, ' '),
        pearl: getClinicalPearl(mapEntry.clinical_group)
    };
}

function getClinicalPearl(group) {
    const pearls = {
        inflammatory_dermatoses: 'En dermatosis inflamatorias, la simetria y el tiempo de evolucion cronico orientan a causas endogenas.',
        infectious_diseases: 'La progresion rapida y el dolor desproporcionado deben hacer sospechar compromiso de tejidos profundos.',
        neoplastic_disorders: 'Cualquier lesion pigmentada nueva o cambiante en un adulto debe ser evaluada con dermatoscopia.',
        immune_mediated_disorders: 'El compromiso de mucosas es un signo de alarma critico en farmacodermias.'
    };
    return pearls[group] || 'Evalue siempre la estabilidad hemodinamica en cuadros extensos.';
}

export function interpretResult(X, prediction, syndromeKey = null, differentialRanking = [], lang = 'es') {
    const priority = prediction.priority;
    const rec = CLINICAL_GUI.recommendations[priority];

    const redFlags = [];
    const rfMap = {
        mucosas: t('rf.mucosa', lang),
        fiebre: t('rf.fever', lang),
        dolor: t('rf.pain', lang),
        bula_ampolla: t('rf.blister', lang),
        purpura_palpable: t('rf.purpura', lang),
        inmunosupresion: t('rf.immuno', lang),
        farmacos_recientes: t('rf.drugs', lang)
    };

    Object.keys(rfMap).forEach((key) => {
        const idx = FEATURE_INDEX[key];
        if (idx !== undefined && X[idx] === 1) {
            redFlags.push(rfMap[key]);
        }
    });

    const topDifferential = differentialRanking?.[0]?.disease_name || '';
    const isShielded = prediction.modifier && prediction.priority < (prediction.baseline_priority || 3);
    const criticalDifferentials = ['Melanoma', 'Carcinoma', 'Stevens-Johnson', 'Necrotizing', 'Vasculitis'];
    const hasCriticalDiff = criticalDifferentials.some((differential) => topDifferential.toLowerCase().includes(differential.toLowerCase()));
    const isBenignSyndrome = syndromeKey === 'benign_cutaneous_tumor' || syndromeKey === 'inflammatory_dermatosis_other';

    const hasMalignancyRisk = (FEATURE_INDEX.nodulo !== undefined && X[FEATURE_INDEX.nodulo] === 1)
        || (FEATURE_INDEX.tumor !== undefined && X[FEATURE_INDEX.tumor] === 1)
        || (FEATURE_INDEX.ulcera !== undefined && X[FEATURE_INDEX.ulcera] === 1);
    const isElderlyHigh = (X[0] || 0) >= 55;

    const malignancyMismatch = isBenignSyndrome && (hasCriticalDiff || (hasMalignancyRisk && isElderlyHigh));
    const atypicalPattern = syndromeKey === 'inflammatory_dermatosis_other' && prediction.priority <= 2 && !prediction.modifier;

    // Las señales que justifican la prioridad ahora son las reglas disparadas
    // (Capa 1 severidad + Capa 2 banderas rojas), no pesos hand-tuned.
    const ruleSignals = (prediction.triggered_rules || []).map((rule) => rule.replace(/^\[[^\]]*\]\s*/, ''));
    let justification;

    if (prediction.modifier) {
        justification = `${t('ui.alert_security', lang)} ${prediction.modifier}.`;
    } else if (malignancyMismatch) {
        justification = `${t('ui.alert_mismatch', lang)} Riesgo de neoplasia invasiva detectado por criterios de seguridad, pese a patron probabilistico inespecifico.`;
    } else if (ruleSignals.length > 0) {
        justification = `${t('ui.priority_based_on', lang)} ${ruleSignals.join('; ')}.`;
    } else {
        const synText = syndromeKey ? syndromeKey.replace(/_/g, ' ') : 'patron clinico inespecifico';
        justification = `Prioridad segun urgencia basal del sindrome (${synText}).`;
    }

    if (ruleSignals.length > 0 && (prediction.modifier || malignancyMismatch)) {
        justification += ` ${t('ui.front_findings', lang)} ${ruleSignals.join('; ')}.`;
    }

    let reasoningInsights = syndromeKey ? enrichWithReasoning(syndromeKey) : null;

    if (reasoningInsights) {
        if (malignancyMismatch) {
            reasoningInsights.summary = `ATENCION: Presentacion atipica. Aunque la morfologia predominante sugiere un proceso estable, el contexto clinico (edad y tipo de lesion) obliga a descartar ${topDifferential || 'neoplasia maligna'} de forma prioritaria.`;
        } else if (isShielded && isBenignSyndrome) {
            reasoningInsights.summary = `VIGILANCIA: El patron probabilistico sugiere benignidad, pero existen hallazgos de alarma (p. ej. ${prediction.modifier}) que elevan obligatoriamente la prioridad de atencion.`;
        } else if (atypicalPattern) {
            reasoningInsights.summary += ' NOTA: Este patron es polimorfico; considere mimetizadores (lues, farmacos o atipias) si no hay respuesta a tratamiento.';
        }
    }

    return {
        ...prediction,
        conduct: rec.conduct,
        timeframe: rec.timeframe,
        redFlags,
        justification,
        alignment_note: malignancyMismatch ? 'Mismatch detectado: patron benigno vs diferencial critico' : null,
        reasoning_insights: reasoningInsights,
        ui: { color: rec.color, bg: rec.bg },
        disclaimer: CLINICAL_GUI.warnings
    };
}
