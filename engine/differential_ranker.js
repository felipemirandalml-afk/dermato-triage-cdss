/**
 * differential_ranker.js - Motor de Diagnóstico Diferencial Clínico
 * Calcula el Top 3 de enfermedades probables dentro de un síndrome.
 */

import { CARDINAL_FEATURE_RULES } from './cardinal_feature_rules.js';
import { SYNDROME_TO_ONTOLOGY_MAP } from './syndrome_to_ontology_map.js';
import conceptMapper from './concept_mapper.js';
import SEMIOLOGY_PROFILES_RAW from './semiology_profiles.json' with { type: 'json' };

/**
 * Fase de Normalización Canónica de Perfiles
 * Convierte las llaves de Derm1M a IDs canónicos del sistema.
 */
const SEMIOLOGY_PROFILES = {};
for (const [disease, profile] of Object.entries(SEMIOLOGY_PROFILES_RAW)) {
    const canonicalProfile = {};
    for (const [feature, prob] of Object.entries(profile)) {
        const cid = conceptMapper.resolve(feature);
        if (cid) {
            // Fusionar si múltiples descriptores mapean al mismo ID canónico
            canonicalProfile[cid] = Math.max(canonicalProfile[cid] || 0, prob);
        } else {
            // Conservar como orphan para trazabilidad y debug
            canonicalProfile[feature] = prob;
        }
    }
    SEMIOLOGY_PROFILES[disease] = canonicalProfile;
}

/**
 * Realiza el ranking de diagnósticos diferenciales para el síndrome detectado.
 * 
 * @param {string} syndromeKey - El síndrome ganador (ej: 'bacterial_skin_infection')
 * @param {Object} helper - FeatureHelper con los hallazgos del paciente
 * @returns {Array} Top 3 de diagnósticos diferenciales con scoring y justificación
 */
/**
 * Normaliza nombres de enfermedades para maximizar el matching con el dataset Derm1M.
 * Maneja plurales, paréntesis, prefijos redundantes y nombres compuestos.
 */
function normalizeDiseaseName(name) {
    let normalized = name.toLowerCase().trim();
    
    // 1. Manejo de paréntesis (ej: "PUPPP (Pruritic urticarial...)" o "Psoriasis (plaque)")
    if (normalized.includes('(')) {
        const parts = normalized.split(/[()]/).filter(p => p.trim().length > 0);
        // Si hay contenido descriptivo largo en el paréntesis, priorizarlo
        const longPart = parts.find(p => p.split(' ').length > 2);
        if (longPart) return longPart.trim();
        // Si no, tomar la base antes del paréntesis
        normalized = normalized.split(' (')[0].trim();
    }

    // 2. Eliminar descriptores redundantes o de contexto
    normalized = normalized.replace(/^malignant |^benign |^acute |^chronic /g, '').trim();

    // 3. Manejo de nombres compuestos por '/' (ej: "Angioma / Hemangioma")
    if (normalized.includes(' / ')) {
        // En este paso solo devolvemos la parte principal o la primera. 
        // El ranker manejará el split si es necesario.
        normalized = normalized.split(' / ')[0].trim();
    }

    // 4. Normalización simple de plurales (Manejar 'sis' vs 'ses' en PASO POSTERIOR)
    // No transformamos aquí para no romper 'psoriasis' si el JSON lo tiene así.

    return normalized;
}

/**
 * Realiza el ranking de diagnósticos diferenciales para el o los síndromes detectados.
 * Combina conocimiento heurístico (Cardinal Rules) con conocimiento estadístico (Derm1M),
 * ponderando resultados según la probabilidad del síndrome.
 * 
 * @param {string|Array} syndromeInput - El syndromeKey dominante o un array de { syndrome, probability }
 * @param {Object} helper - FeatureHelper con los hallazgos del paciente
 * @returns {Array} Top 3 de diagnósticos diferenciales consolidados
 */
export function rankDifferentials(syndromeInput, helper) {
    // Normalizar entrada para manejar tanto un solo síndrome como múltiples candidatos
    let candidates = [];
    if (typeof syndromeInput === 'string') {
        candidates = [{ syndrome: syndromeInput, probability: 1.0 }];
    } else if (Array.isArray(syndromeInput)) {
        candidates = syndromeInput;
    } else {
        return [];
    }

    const consolidatedScores = new Map();

    // 1. Procesar cada síndrome candidato
    candidates.forEach(cand => {
        const { syndrome: syndromeKey, probability: syndromeProb } = cand;
        const ontology = SYNDROME_TO_ONTOLOGY_MAP[syndromeKey];
        if (!ontology) return;

        ontology.differentials.forEach(diseaseName => {
            // El score base es calculado por semiología y reglas
            let { score, matched_rules, supporting, missing } = calculateBaseClinicalScore(diseaseName, helper);
            
            // EL CAMBIO CLAVE: Ponderar el score clínico por la probabilidad del síndrome
            // Esto asegura que enfermedades en síndromes improbables no queden arriba
            const weightedScore = score * syndromeProb;

            if (consolidatedScores.has(diseaseName)) {
                // Si la enfermedad ya existe en otro síndrome (over-lap), sumar ponderación
                const existing = consolidatedScores.get(diseaseName);
                existing.score += weightedScore;
                existing.source_syndromes.push(syndromeKey);
            } else {
                consolidatedScores.set(diseaseName, {
                    disease_name: diseaseName,
                    score: weightedScore,
                    matched_rules: matched_rules,
                    supporting_features: supporting,
                    missing_critical_features: missing,
                    source_syndromes: [syndromeKey]
                });
            }
        });
    });

    // 2. Aplicar Capa de Reglas Cardinales GLOBALES si no se aplicaron antes
    // (Actualización: cardinal rules ya se aplican dentro de calculateBaseClinicalScore)

    // 3. Convertir Map a Array, ordenar y retornar Top 3
    const finalRanking = Array.from(consolidatedScores.values());
    finalRanking.sort((a, b) => b.score - a.score);

    const top3 = finalRanking.slice(0, 3);
    top3.forEach(item => {
        // Normalización de etiquetas de compatibilidad (ajustada para score ponderado)
        if (item.score > 8) item.compatibility = 'Alta';
        else if (item.score > 3) item.compatibility = 'Media';
        else if (item.score > 0) item.compatibility = 'Baja';
        else item.compatibility = 'No determinada';
    });

    return top3;
}

/**
 * Helper interno para calcular el score clínico crudo (semiología + reglas) para una sola enfermedad
 */
function calculateBaseClinicalScore(diseaseName, helper) {
    let score = 0;
    let matched_rules = [];
    let supporting = [];
    let missing = [];

    // A. Compatibilidad Semiológica (Derm1M)
    let normalizedName = normalizeDiseaseName(diseaseName);
    let profile = SEMIOLOGY_PROFILES[normalizedName];

    // Fallbacks de normalización
    if (!profile && normalizedName.endsWith('ses')) profile = SEMIOLOGY_PROFILES[normalizedName.replace(/ses$/, 'sis')];
    if (!profile && normalizedName.endsWith('sis')) profile = SEMIOLOGY_PROFILES[normalizedName.replace(/sis$/, 'ses')];
    if (!profile && diseaseName.includes(' / ')) {
        for (const p of diseaseName.split(' / ')) {
            const pNorm = normalizeDiseaseName(p);
            if (SEMIOLOGY_PROFILES[pNorm]) { profile = SEMIOLOGY_PROFILES[pNorm]; break; }
        }
    }
    if (!profile) {
        const firstTerm = normalizedName.split(' ')[0];
        if (firstTerm && firstTerm.length > 3 && SEMIOLOGY_PROFILES[firstTerm]) profile = SEMIOLOGY_PROFILES[firstTerm];
    }

    if (profile) {
        for (const [feature, frequency] of Object.entries(profile)) {
            if (helper.has(feature)) {
                score += frequency * 6;
                if (frequency > 0.2) supporting.push(feature);
            } else if (frequency > 0.6) {
                score -= frequency * 3;
                missing.push(feature);
            }
        }
    }

    // B. Reglas Cardinales
    for (const rule of CARDINAL_FEATURE_RULES) {
        if (rule.conditions(helper)) {
            const isBoosted = rule.boost_differentials.some(b => diseaseName.toLowerCase().includes(b.toLowerCase()));
            if (isBoosted) {
                score += 5;
                matched_rules.push(rule.label);
            }
            const isSuppressed = rule.suppress_differentials && rule.suppress_differentials.some(s => diseaseName.toLowerCase().includes(s.toLowerCase()));
            if (isSuppressed) score -= 5;
        }
    }

    return { score, matched_rules, supporting, missing };
}
