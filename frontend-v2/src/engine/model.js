/**
 * model.js - Orquestador del Motor Clinico CDSS.
 */

import { FEATURE_INDEX, FEATURE_MAP_LABELS, CLINICAL_GUI, PRIORITY_LABELS } from './constants.js';
import { encodeFeatures, createFeatureHelper } from './feature_encoder.js';
import { predictBaseline } from './baseline_model.js';
import { applySafetyModifiers, applyBlockModifiers } from './safety_modifiers.js';
import { applyContextModifiers, applyRefinementModifiers } from './context_modifiers.js';
import { interpretResult, explain, buildResult } from './interpreter.js';
import { predictProbabilisticSyndrome } from './probabilistic_model.js';
import { rankDifferentials } from './differential_ranker.js';
import { CARDINAL_FEATURE_RULES } from './cardinal_feature_rules.js';
import { recalibrationEngine } from './recalibration_engine.js';
import { auditLogger } from './audit_logger.js';

export { FEATURE_INDEX, FEATURE_MAP_LABELS, CLINICAL_GUI, encodeFeatures, explain, interpretResult };

function normalizePriority(priority) {
    if (typeof priority === 'number' && priority >= 1 && priority <= 3) return priority;
    if (typeof priority === 'string') {
        const match = priority.match(/P?([1-3])/i);
        if (match) return Number(match[1]);
    }
    return 3;
}

function createEmptyProbabilisticAnalysis(topSyndrome = null) {
    return {
        top_syndrome: topSyndrome,
        top_probability: 0,
        top_candidates: [],
        confidence_level: 'low',
        feature_importance: {
            positive: [],
            negative: []
        },
        message: null,
        syndrome_probabilities: {}
    };
}

function getConfidenceLevel(probability) {
    return probability > 0.70 ? 'high' : (probability >= 0.40 ? 'medium' : 'low');
}

function snapshotRawProbabilisticAnalysis(analysis) {
    if (!analysis.raw_top_candidates) {
        analysis.raw_top_candidates = (analysis.top_candidates || []).map((candidate) => ({ ...candidate }));
    }
    if (!analysis.raw_syndrome_probabilities) {
        analysis.raw_syndrome_probabilities = { ...(analysis.syndrome_probabilities || {}) };
    }
    if (analysis.raw_top_probability === undefined) {
        analysis.raw_top_probability = analysis.top_probability ?? 0;
    }
    if (analysis.raw_top_syndrome === undefined) {
        analysis.raw_top_syndrome = analysis.top_syndrome ?? null;
    }
    if (analysis.raw_confidence_level === undefined) {
        analysis.raw_confidence_level = analysis.confidence_level ?? 'low';
    }
}

function synchronizeProbabilisticAnalysis(analysis, candidates) {
    const normalizedCandidates = candidates
        .map((candidate) => ({ ...candidate }))
        .sort((a, b) => b.probability - a.probability);

    const syndromeProbabilities = {};
    normalizedCandidates.forEach((candidate) => {
        syndromeProbabilities[candidate.syndrome] = candidate.probability;
    });

    const topCandidate = normalizedCandidates[0] || { syndrome: null, probability: 0 };
    const topProbability = topCandidate.probability || 0;

    analysis.top_candidates = normalizedCandidates;
    analysis.syndrome_probabilities = syndromeProbabilities;
    analysis.top_probability = topProbability;
    analysis.top_syndrome = topProbability >= 0.15 ? topCandidate.syndrome : null;
    analysis.confidence_level = getConfidenceLevel(topProbability);
    analysis.message = analysis.confidence_level === 'low'
        ? 'Patron ambiguo (baja confianza tras recalibracion) - Evaluacion clinica indispensable'
        : null;

    return analysis;
}

export function normalizeTriageResult(rawResult = {}, { status = 'ok' } = {}) {
    const priority = normalizePriority(rawResult.priority);
    const recommendation = CLINICAL_GUI.recommendations[priority] || CLINICAL_GUI.recommendations[3];
    const primarySyndrome = rawResult.primary_syndrome ?? rawResult.probabilistic_analysis?.top_syndrome ?? null;
    const probabilisticAnalysis = rawResult.probabilistic_analysis || createEmptyProbabilisticAnalysis(primarySyndrome);

    return {
        ...rawResult,
        status: rawResult.status || status,
        priority,
        priority_code: rawResult.priority_code || `P${priority}`,
        label: rawResult.label || `Prioridad ${priority} - ${PRIORITY_LABELS[priority] || 'DESCONOCIDO'}`,
        conduct: rawResult.conduct || recommendation.conduct,
        timeframe: rawResult.timeframe || recommendation.timeframe,
        modifier: rawResult.modifier || null,
        primary_syndrome: primarySyndrome,
        probabilistic_analysis: {
            ...createEmptyProbabilisticAnalysis(primarySyndrome),
            ...probabilisticAnalysis,
            top_syndrome: probabilisticAnalysis.top_syndrome ?? primarySyndrome
        },
        differential_ranking: Array.isArray(rawResult.differential_ranking) ? rawResult.differential_ranking : [],
        triggered_rules: Array.isArray(rawResult.triggered_rules) ? rawResult.triggered_rules : [],
        redFlags: Array.isArray(rawResult.redFlags) ? rawResult.redFlags : [],
        justification: rawResult.justification || '',
        alignment_note: rawResult.alignment_note || null,
        reasoning_insights: rawResult.reasoning_insights || null,
        ui: rawResult.ui || { color: recommendation.color, bg: recommendation.bg },
        disclaimer: rawResult.disclaimer || CLINICAL_GUI.warnings,
        error: rawResult.error || null
    };
}

export function predict(X, helper) {
    const baseline = predictBaseline(X, FEATURE_INDEX);
    const triggered_rules = [];

    let currentPriority = baseline.priority;
    let currentModifier = baseline.modifier;

    const safety = applySafetyModifiers(helper, { priority: currentPriority, modifier: currentModifier });
    if (safety.match) {
        currentPriority = safety.priority;
        currentModifier = safety.modifier;
        triggered_rules.push(...safety.rules);
    }

    const context = applyContextModifiers(helper, { priority: currentPriority, modifier: currentModifier });
    if (context.match) {
        currentPriority = context.priority;
        currentModifier = context.modifier;
        triggered_rules.push(...context.rules);
    }

    const block = applyBlockModifiers(helper, { priority: currentPriority, modifier: currentModifier });
    if (block.match) {
        currentPriority = block.priority;
        currentModifier = block.modifier;
        triggered_rules.push(...block.rules);
    }

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

function refineSyndromeReasoning(analysis, helper) {
    if (!analysis.top_candidates?.length) return analysis;

    snapshotRawProbabilisticAnalysis(analysis);

    const activeFeatures = Object.keys(helper.featureMap || {}).filter((key) => helper.featureMap[key] === 1 || helper.featureMap[key] === true);
    const recalibratedCandidates = analysis.top_candidates.map((candidate) => {
        return {
            ...candidate,
            raw_probability: candidate.raw_probability ?? candidate.probability ?? 0,
            recalibrated_score: Math.max(candidate.probability || 0, 0)
        };
    });

    activeFeatures.forEach((feature) => {
        const weight = recalibrationEngine.getBaseWeight(feature);
        const targetSyndrome = recalibrationEngine.getSyndromeForFeature(feature);
        if (weight > 0 && targetSyndrome) {
            const candidate = recalibratedCandidates.find((item) => item.syndrome === targetSyndrome);
            if (candidate) {
                candidate.recalibrated_score += weight;
            }
        }
    });

    CARDINAL_FEATURE_RULES.forEach((rule) => {
        if (rule.conditions(helper) && rule.boost_syndromes) {
            rule.boost_syndromes.forEach((syndrome) => {
                const candidate = recalibratedCandidates.find((item) => item.syndrome === syndrome);
                if (candidate) {
                    candidate.recalibrated_score += 0.4;
                }
            });
        }
    });

    const syndromeBoosts = recalibrationEngine.getSyndromeBoosts(activeFeatures);
    syndromeBoosts.forEach((boostEntry) => {
        const candidate = recalibratedCandidates.find((item) => item.syndrome === boostEntry.syndrome);
        if (candidate) {
            candidate.recalibrated_score += boostEntry.boost;
        }
    });

    const totalScore = recalibratedCandidates.reduce((sum, candidate) => sum + Math.max(candidate.recalibrated_score || 0, 0), 0);
    const normalizedCandidates = totalScore > 0
        ? recalibratedCandidates.map((candidate) => ({
            ...candidate,
            probability: Math.max(candidate.recalibrated_score || 0, 0) / totalScore
        }))
        : analysis.raw_top_candidates.map((candidate) => ({
            ...candidate,
            raw_probability: candidate.probability ?? 0,
            recalibrated_score: candidate.probability ?? 0
        }));

    analysis.recalibrated = true;
    return synchronizeProbabilisticAnalysis(analysis, normalizedCandidates);
}

export function runTriage(formData, lang = 'es') {
    try {
        const { X, helper } = encodeFeatures(formData);
        const prediction = predict(X, helper);
        let probabilisticAnalysis = predictProbabilisticSyndrome(X);

        probabilisticAnalysis = refineSyndromeReasoning(probabilisticAnalysis, helper);

        const topCandidates = probabilisticAnalysis.top_candidates || [];
        let diffCandidates = [];
        if (topCandidates.length > 0) {
            const t1 = topCandidates[0];
            const t2 = topCandidates[1];
            const isAmbiguous = (probabilisticAnalysis.confidence_level !== 'high')
                || (t2 && (t1.probability - t2.probability < 0.20));
            diffCandidates = (isAmbiguous && t2 && t2.probability > 0.05) ? [t1, t2] : [t1];
        }

        const differentialRanking = rankDifferentials(diffCandidates, helper);
        const result = normalizeTriageResult({
            ...interpretResult(X, prediction, probabilisticAnalysis.top_syndrome, differentialRanking, lang),
            primary_syndrome: probabilisticAnalysis.top_syndrome,
            probabilistic_analysis: probabilisticAnalysis,
            differential_ranking: differentialRanking
        });

        auditLogger.logTriage(formData, result);

        return result;
    } catch (error) {
        console.error('CRITICAL_ENGINE_ERROR:', error);
        return normalizeTriageResult({
            priority: 'P3',
            label: 'Error en Procesamiento',
            conduct: 'Falla tecnica. Por favor, reinicie el flujo o consulte soporte.',
            status: 'error',
            error: error.message
        }, { status: 'error' });
    }
}

export function applyClinicalModifiers(X) {
    const helper = createFeatureHelper(X);
    return predict(X, helper);
}
