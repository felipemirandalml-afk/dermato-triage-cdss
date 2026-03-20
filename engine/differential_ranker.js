/**
 * differential_ranker.js - Motor de Diagnóstico Diferencial Clínico
 * Calcula el Top 3 de enfermedades probables dentro de un síndrome.
 */

import { CARDINAL_FEATURE_RULES } from './cardinal_feature_rules.js';
import { SYNDROME_TO_ONTOLOGY_MAP } from './syndrome_to_ontology_map.js';
import SEMIOLOGY_PROFILES from './semiology_profiles.json' with { type: 'json' };

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
 * Realiza el ranking de diagnósticos diferenciales para el síndrome detectado.
 * Combina conocimiento heurístico (Cardinal Rules) con conocimiento estadístico (Derm1M).
 * 
 * @param {string} syndromeKey - El síndrome ganador (ej: 'bacterial_skin_infection')
 * @param {Object} helper - FeatureHelper con los hallazgos del paciente
 * @returns {Array} Top 3 de diagnósticos diferenciales con scoring y justificación
 */
export function rankDifferentials(syndromeKey, helper) {
    const ontology = SYNDROME_TO_ONTOLOGY_MAP[syndromeKey];
    if (!ontology) return [];

    // 1. Inicializar scoring para cada enfermedad del síndrome
    const diseaseScores = ontology.differentials.map(diseaseName => ({
        disease_name: diseaseName,
        score: 0,
        matched_rules: []
    }));

    // 2. Aplicar Capa de Compatibilidad Semiológica (Derm1M)
    diseaseScores.forEach(item => {
        // Normalización para matching con el dataset
        let normalizedName = normalizeDiseaseName(item.disease_name);
        
        // 1. Intento directo
        let profile = SEMIOLOGY_PROFILES[normalizedName];

        // 2. Intento con pluralización/singularización (ses <-> sis)
        if (!profile && normalizedName.endsWith('ses')) {
            const singular = normalizedName.replace(/ses$/, 'sis');
            if (SEMIOLOGY_PROFILES[singular]) profile = SEMIOLOGY_PROFILES[singular];
        }
        if (!profile && normalizedName.endsWith('sis')) {
            const plural = normalizedName.replace(/sis$/, 'ses');
            if (SEMIOLOGY_PROFILES[plural]) profile = SEMIOLOGY_PROFILES[plural];
        }

        // 3. Intento secundario si el nombre es compuesto (ej: Angioma / Hemangioma)
        if (!profile && item.disease_name.includes(' / ')) {
             const parts = item.disease_name.split(' / ');
             for (const p of parts) {
                 const pNorm = normalizeDiseaseName(p);
                 if (SEMIOLOGY_PROFILES[pNorm]) {
                     profile = SEMIOLOGY_PROFILES[pNorm];
                     break;
                 }
             }
        }
        
        // 4. Intento terciario: Fallback por primer término (ej: "Tinea capitis" -> "tinea")
        if (!profile) {
            const firstTerm = normalizedName.split(' ')[0];
            if (firstTerm && firstTerm.length > 3 && SEMIOLOGY_PROFILES[firstTerm]) {
                profile = SEMIOLOGY_PROFILES[firstTerm];
            }
        }

        if (profile) {
            let semanticScore = 0;
            const supporting = [];
            const missing = [];
            
            // Comparar cada hallazgo del perfil con el estado actual del paciente
            for (const [feature, frequency] of Object.entries(profile)) {
                const patientHasFeature = helper.has(feature);
                
                if (patientHasFeature) {
                    // Recompensa por hallazgo presente (proporcional a su frecuencia típica)
                    semanticScore += frequency * 6;
                    if (frequency > 0.2) supporting.push(feature);
                } else {
                    // Penalización por "Ausencia Crítica" (hallazgo muy común en la enfermedad pero ausente en el paciente)
                    if (frequency > 0.6) {
                        semanticScore -= frequency * 3;
                        missing.push(feature);
                    }
                }
            }
            item.score += semanticScore;
            item.supporting_features = supporting;
            item.missing_critical_features = missing;
        }
    });

    // 3. Aplicar Capa de Reglas Cardinales (Expert Heuristics)
    for (const rule of CARDINAL_FEATURE_RULES) {
        if (rule.conditions(helper)) {
            diseaseScores.forEach(item => {
                // Boost: +5 (Puntaje prioritario para hallazgo cardinal positivo)
                const isBoosted = rule.boost_differentials.some(b => 
                    item.disease_name.toLowerCase().includes(b.toLowerCase())
                );
                
                if (isBoosted) {
                    item.score += 5;
                    item.matched_rules.push(rule.label);
                }

                // Suppress: -5 (Puntaje prioritario para hallazgo contradictorio)
                const isSuppressed = rule.suppress_differentials && rule.suppress_differentials.some(s => 
                    item.disease_name.toLowerCase().includes(s.toLowerCase())
                );

                if (isSuppressed) {
                    item.score -= 5;
                }
            });
        }
    }

    // 4. Ordenar por score (descendente) y retornar Top 3
    diseaseScores.sort((a, b) => b.score - a.score);

    // Calcular etiquetas de compatibilidad cualitativa
    const top3 = diseaseScores.slice(0, 3);
    top3.forEach(item => {
        if (item.score > 10) item.compatibility = 'Alta';
        else if (item.score > 4) item.compatibility = 'Media';
        else if (item.score > 0) item.compatibility = 'Baja';
        else item.compatibility = 'No determinada';
    });

    return top3;
}
