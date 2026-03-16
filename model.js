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
import { getOntologyInfoForSyndrome } from './engine/ontology_service.js';
import { rankDifferentials } from './engine/differential_ranker.js';

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

    return finalResult;
}

/**
 * API de alto nivel para triage: Punto de entrada principal
 */
export function runTriage(formData) {
    // 1. Encoding Único (Single Source of Truth)
    const { X, featureMap, helper } = encodeFeatures(formData);

    // 2. Predicción de Prioridad (Híbrida: Baseline + Modificadores)
    const prediction = predict(X, helper);
    
    // 3. Construcción del Resultado Básico e Interpretación
    const result = interpretResult(X, prediction);
    
    // 4. Inferencia de Síndrome Probabilístico (ML)
    const probabilisticAnalysis = predictProbabilisticSyndrome(X);
    result.probabilistic_analysis = probabilisticAnalysis;
    
    // 5. Enriquecimiento con Ontología y Ranker de Hallazgos
    const ontologyInfo = getOntologyInfoForSyndrome(probabilisticAnalysis.top_syndrome);
    if (ontologyInfo) {
        result.ontology_info = ontologyInfo;
        // El ranker ya no necesita re-encodear formData, usa el helper
        result.ontology_info = rankDifferentials(helper, result);
    }
    
    return result;
}

// Compatibilidad con validadores y utilidades
export function applyClinicalModifiers(X, result) {
    const helper = createFeatureHelper(X);
    return predict(X, helper);
}
