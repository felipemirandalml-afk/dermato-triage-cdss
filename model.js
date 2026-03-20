/**
 * model.js - Orquestador del Motor Clínico CDSS
 * Arquitectura modular FASE 1
 */

import { FEATURE_INDEX, FEATURE_MAP_LABELS, CLINICAL_GUI } from './engine/constants.js';
import { encodeFeatures, createFeatureHelper } from './engine/feature_encoder.js';
import { predictBaseline } from './engine/baseline_model.js';
import { applySafetyModifiers, applyBlockModifiers } from './engine/safety_modifiers.js';
import { applyContextModifiers, applyRefinementModifiers } from './engine/context_modifiers.js';
import { interpretResult, explain, buildResult } from './engine/interpreter.js';
import { predictProbabilisticSyndrome } from './engine/probabilistic_model.js';
import { rankDifferentials } from './engine/differential_ranker.js';
import { CARDINAL_FEATURE_RULES } from './engine/cardinal_feature_rules.js';

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

    // Pipeline de Modificadores (Secuencial y Aditivo para Explicabilidad)
    
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
    
    // 3. Capa de Bloqueo (Escudos de Malignidad/Reacciones Urgentes)
    const block = applyBlockModifiers(helper, { priority: currentPriority, modifier: currentModifier });
    if (block.match) {
        currentPriority = block.priority;
        currentModifier = block.modifier;
        triggered_rules.push(...block.rules);
    }
    
    // 4. Capa de Refinamiento (Downscales controlados)
    const refinement = applyRefinementModifiers(helper, { priority: currentPriority, modifier: currentModifier });
    if (refinement.match) {
        currentPriority = refinement.priority;
        currentModifier = refinement.modifier;
        triggered_rules.push(...refinement.rules);
    }
    
    const finalResult = buildResult(currentPriority, currentModifier, baseline);
    finalResult.triggered_rules = triggered_rules;
    finalResult.baseline_priority = baseline.priority; // Preservar para Alineación Interpretativa

    return finalResult;
}

/**
 * Refina las probabilidades del modelo ML usando conocimiento experto cardinal.
 * Actúa como una capa de "razonamiento clínico" que corrige sesgos del modelo estadístico.
 */
function refineSyndromeReasoning(analysis, helper) {
    if (!analysis.top_candidates) return analysis;

    let hasChanges = false;
    CARDINAL_FEATURE_RULES.forEach(rule => {
        if (rule.conditions(helper)) {
            // Aplicar Boosts
            if (rule.boost_syndromes) {
                rule.boost_syndromes.forEach(syndKey => {
                    const cand = analysis.top_candidates.find(c => c.syndrome === syndKey);
                    if (cand) {
                        cand.probability += 0.40; // Nudge dominante para anclas cardinales
                        hasChanges = true;
                    }
                });
            }
            // Aplicar Supresiones
            if (rule.suppress_syndromes) {
                rule.suppress_syndromes.forEach(syndKey => {
                    const cand = analysis.top_candidates.find(c => c.syndrome === syndKey);
                    if (cand) {
                        cand.probability = Math.max(0, cand.probability - 0.40);
                        hasChanges = true;
                    }
                });
            }
        }
    });

    if (hasChanges) {
        // Normalizar y reordenar
        analysis.top_candidates.sort((a, b) => b.probability - a.probability);
        
        const top1 = analysis.top_candidates[0];
        // Mantener síndrome si supera el umbral dinámico (alineado con probabilistic_model.js)
        analysis.top_syndrome = top1.probability >= 0.15 ? top1.syndrome : null;
        analysis.top_probability = top1.probability;
        
        // Recalibrar nivel de confianza tras el refinamiento
        analysis.confidence_level = analysis.top_probability > 0.8 ? "high" : (analysis.top_probability > 0.3 ? "medium" : "low");
    }

    return analysis;
}

/**
 * API de alto nivel para triage: Punto de entrada principal
 */
export function runTriage(formData) {
    // 1. Encoding Único (Single Source of Truth)
    const { X, featureMap, helper } = encodeFeatures(formData);

    // 2. Predicción de Prioridad (Híbrida: Baseline + Modificadores)
    const prediction = predict(X, helper);
    
    // 3. Inferencia de Síndrome Probabilístico (ML)
    let probabilisticAnalysis = predictProbabilisticSyndrome(X);

    // 4. Capa de Refinamiento Clínico (Remediación de errores estadísticos)
    probabilisticAnalysis = refineSyndromeReasoning(probabilisticAnalysis, helper);

    // 5. Selección de Candidatos para Diferencial (Manejo de Ambigüedad)
    const topCandidates = probabilisticAnalysis.top_candidates || [];
    let differentialCandidates = [];

    if (topCandidates.length > 0) {
        const top1 = topCandidates[0];
        const top2 = topCandidates[1];

        // Regla de Ambigüedad (Post-Refinamiento)
        const isAmbiguous = (probabilisticAnalysis.confidence_level !== 'high') || 
                           (top2 && (top1.probability - top2.probability < 0.20));

        if (isAmbiguous && top2 && top2.probability > 0.05) {
            differentialCandidates = [top1, top2];
            probabilisticAnalysis.is_multi_syndrome = true;
        } else {
            differentialCandidates = [top1];
        }
    }

    // 6. Cálculo de Diagnóstico Diferencial Clínico (Top 3) - Ahora Multi-Síndrome
    const differentialRanking = rankDifferentials(differentialCandidates, helper);

    // 7. Construcción del Resultado Básico e Interpretación (Pasando diferenciales para alineación)
    const result = interpretResult(X, prediction, probabilisticAnalysis.top_syndrome, differentialRanking);
    result.probabilistic_analysis = probabilisticAnalysis;
    result.differential_ranking = differentialRanking;
    
    return result;
}

// Compatibilidad con validadores y utilidades
export function applyClinicalModifiers(X, result) {
    const helper = createFeatureHelper(X);
    return predict(X, helper);
}
