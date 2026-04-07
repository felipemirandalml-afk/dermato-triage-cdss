/**
 * model.js - Orquestador del Motor Clínico CDSS
 * Arquitectura modular recalibrada v1.0 (Phase 15)
 */

import { FEATURE_INDEX, FEATURE_MAP_LABELS, CLINICAL_GUI } from './constants.js';
import { encodeFeatures, createFeatureHelper } from './feature_encoder.js';
import { predictBaseline } from './baseline_model.js';
import { applySafetyModifiers, applyBlockModifiers } from './safety_modifiers.js';
import { applyContextModifiers, applyRefinementModifiers } from './context_modifiers.js';
import { interpretResult, explain, buildResult } from './interpreter.js';
import { predictProbabilisticSyndrome } from './probabilistic_model.js';
import { rankDifferentials } from './differential_ranker.js';
import { CARDINAL_FEATURE_RULES } from './cardinal_feature_rules.js';
import { recalibrationEngine } from './recalibration_engine.js';

// Re-exports para compatibilidad
export { FEATURE_INDEX, FEATURE_MAP_LABELS, CLINICAL_GUI, encodeFeatures, explain, interpretResult };

/**
 * Función principal de inferencia (Orquestación del Pipeline)
 */
export function predict(X, helper) {
    const baseline = predictBaseline(X, FEATURE_INDEX);
    const triggered_rules = [];
    
    let currentPriority = baseline.priority;
    let currentModifier = baseline.modifier;

    // 1. Capa de Seguridad Crítica (Morfología)
    const safety = applySafetyModifiers(helper, { priority: currentPriority, modifier: currentModifier });
    if (safety.match) {
        currentPriority = safety.priority;
        currentModifier = safety.modifier;
        triggered_rules.push(...safety.rules);
    }
    
    // 2. Capa de Contexto Sistémico
    const context = applyContextModifiers(helper, { priority: currentPriority, modifier: currentModifier });
    if (context.match) {
        currentPriority = context.priority;
        currentModifier = context.modifier;
        triggered_rules.push(...context.rules);
    }
    
    // 3. Capa de Bloqueo (Escudos)
    const block = applyBlockModifiers(helper, { priority: currentPriority, modifier: currentModifier });
    if (block.match) {
        currentPriority = block.priority;
        currentModifier = block.modifier;
        triggered_rules.push(...block.rules);
    }
    
    // 4. Capa de Refinamiento
    const refinement = applyRefinementModifiers(helper, { priority: currentPriority, modifier: currentModifier });
    if (refinement.match) {
        currentPriority = refinement.priority;
        currentModifier = refinement.modifier;
        triggered_rules.push(...refinement.rules);
    }
    
    const finalResult = buildResult(currentPriority, currentModifier, baseline);
    finalResult.triggered_rules = triggered_rules;
    return finalResult;
}

/**
 * Refina las probabilidades del modelo ML usando Gestalts Estadísticos y Reglas Cardinales.
 */
function refineSyndromeReasoning(analysis, helper) {
    if (!analysis.top_candidates) return analysis;
    let hasChanges = false;

    // A0. Nivelación Basal (Class-wise Bias Recovery)
    let totalLevelled = 0;
    analysis.top_candidates.forEach(cand => {
        const factor = recalibrationEngine.getBiasCorrection(cand.syndrome);
        cand.probability *= factor;
        totalLevelled += cand.probability;
    });

    // Re-normalización post-nivelación
    if (totalLevelled > 0) {
        analysis.top_candidates.forEach(cand => {
            cand.probability /= totalLevelled;
        });
        hasChanges = true;
    }

    // A1. Recalibración Basal (Anclas Individuales)
    const activeFeats = Object.keys(helper.featureMap || {}).filter(k => helper.featureMap[k] === 1 || helper.featureMap[k] === true);
    activeFeats.forEach(f => {
        const weight = recalibrationEngine.getBaseWeight(f);
        const targetSynd = recalibrationEngine.getSyndromeForFeature(f);
        if (weight > 0 && targetSynd) {
            const cand = analysis.top_candidates.find(x => x.syndrome === targetSynd);
            if (cand) {
                cand.probability = Math.min(1.0, cand.probability + weight);
                hasChanges = true;
            }
        }
    });

    // B. Reglas Cardinales (Manual)
    CARDINAL_FEATURE_RULES.forEach(rule => {
        if (rule.conditions(helper)) {
            if (rule.boost_syndromes) {
                rule.boost_syndromes.forEach(synd => {
                    const c = analysis.top_candidates.find(x => x.syndrome === synd);
                    if (c) { c.probability = Math.min(1.0, c.probability + 0.4); hasChanges = true; }
                });
            }
        }
    });

    // B. Gestalts Estadísticos (Phase 15)
    const active = Object.keys(helper.featureMap || {}).filter(k => helper.featureMap[k] === 1 || helper.featureMap[k] === true);
    const boosts = recalibrationEngine.getSyndromeBoosts(active);
    boosts.forEach(b => {
        const c = analysis.top_candidates.find(x => x.syndrome === b.syndrome);
        if (c) { c.probability = Math.min(1.0, c.probability + b.boost); hasChanges = true; }
    });

    if (hasChanges) {
        analysis.top_candidates.sort((a, b) => b.probability - a.probability);
        const top1 = analysis.top_candidates[0];
        analysis.top_syndrome = top1.probability >= 0.15 ? top1.syndrome : null;
        analysis.top_probability = top1.probability;
        analysis.confidence_level = analysis.top_probability > 0.8 ? "high" : (analysis.top_probability > 0.3 ? "medium" : "low");
    }
    return analysis;
}

/**
 * Punto de entrada principal para Triage/Diagnóstico
 */
export function runTriage(formData) {
    const { X, featureMap, helper } = encodeFeatures(formData);
    const prediction = predict(X, helper);
    let probabilisticAnalysis = predictProbabilisticSyndrome(X);
    
    // Refinamiento Híbrido
    probabilisticAnalysis = refineSyndromeReasoning(probabilisticAnalysis, helper);

    // Selección de Diferenciales
    const topCandidates = probabilisticAnalysis.top_candidates || [];
    let diffCandidates = [];
    if (topCandidates.length > 0) {
        const t1 = topCandidates[0];
        const t2 = topCandidates[1];
        const isAmbiguous = (probabilisticAnalysis.confidence_level !== 'high') || (t2 && (t1.probability - t2.probability < 0.20));
        diffCandidates = (isAmbiguous && t2 && t2.probability > 0.05) ? [t1, t2] : [t1];
    }

    const differentialRanking = rankDifferentials(diffCandidates, helper);
    const result = interpretResult(X, prediction, probabilisticAnalysis.top_syndrome, differentialRanking);
    result.probabilistic_analysis = probabilisticAnalysis;
    result.differential_ranking = differentialRanking;
    
    return result;
}

export function applyClinicalModifiers(X, result) {
    const helper = createFeatureHelper(X);
    return predict(X, helper);
}
