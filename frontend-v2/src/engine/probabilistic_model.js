/**
 * probabilistic_model.js — Clasificador sindrómico NAIVE BAYES HÍBRIDO.
 *
 * Fusiona dos verosimilitudes (arquitectura de dos fuentes, METHODS §5.2):
 *   P(síndrome | features) ∝ P(síndrome)
 *      × Π P(feature_morfológica | síndrome)     ← Derm1M (datos)   [present-only]
 *      × Π P(feature_no_morfológica | síndrome)   ← guías citadas      [Bernoulli]
 *
 * Reemplaza el Random Forest entrenado con datos sintéticos (circular, 12 clases).
 * Validado en datos reales (UCI Dermatology): supera al RF. Ver
 * docs/syndrome_classifier_eval.md. Transparente, cubre los 14 síndromes, sin
 * pacientes sintéticos.
 */
import PROFILES from '../data/syndrome_feature_profiles.json' with { type: 'json' };
import CLINICAL from '../data/clinical_likelihoods.json' with { type: 'json' };

const EPS = 1e-6;
const CONFIDENCE_THRESHOLD = 0.40;

function pClinical(feature, syndrome) {
    const level = CLINICAL.likelihoods[syndrome] && CLINICAL.likelihoods[syndrome][feature];
    return level ? CLINICAL.scale[level] : CLINICAL.default;
}

/**
 * Set de features canónicas presentes en el paciente (morfológicas + clínicas).
 * Se toma del featureMap del helper (cubre features indexadas y "extra").
 */
function presentFeatures(helper) {
    const featureMap = (helper && helper.featureMap) || {};
    return new Set(Object.keys(featureMap).filter((k) => featureMap[k] === 1 || featureMap[k] === true));
}

/**
 * Clasifica el síndrome a partir del helper de features.
 * @param {Object} helper - FeatureHelper de encodeFeatures (usa helper.featureMap)
 */
export function predictProbabilisticSyndrome(helper) {
    const present = presentFeatures(helper);
    const { syndromes, features, prior, p_feature_given_syndrome } = PROFILES;

    // Log-score por síndrome
    const scored = syndromes.map((syndrome) => {
        let logScore = Math.log(prior[syndrome] ?? 1 / syndromes.length);

        // Morfología (Derm1M): solo features presentes (present-only — config validada)
        const profile = p_feature_given_syndrome[syndrome];
        for (const f of features) {
            if (present.has(f)) {
                const p = Math.min(Math.max(profile[f], EPS), 1 - EPS);
                logScore += Math.log(p);
            }
        }

        // Clínica (guías): Bernoulli (presente y ausente)
        for (const f of CLINICAL.features) {
            const p = Math.min(Math.max(pClinical(f, syndrome), EPS), 1 - EPS);
            logScore += present.has(f) ? Math.log(p) : Math.log(1 - p);
        }

        return { syndrome, logScore };
    });

    // Softmax → probabilidades (suman 1)
    const maxLog = Math.max(...scored.map((x) => x.logScore));
    let partition = 0;
    scored.forEach((x) => { x.probability = Math.exp(x.logScore - maxLog); partition += x.probability; });
    scored.forEach((x) => { x.probability /= partition; });

    const top_candidates = scored
        .map((x) => ({ syndrome: x.syndrome, probability: x.probability }))
        .sort((a, b) => b.probability - a.probability);

    const syndrome_probabilities = {};
    top_candidates.forEach((c) => { syndrome_probabilities[c.syndrome] = c.probability; });

    const top = top_candidates[0];
    const top_probability = top.probability;
    const isConfident = top_probability >= CONFIDENCE_THRESHOLD;
    const confidence_level = top_probability > 0.70 ? 'high' : (isConfident ? 'medium' : 'low');

    // Explicabilidad transparente: features presentes que más apoyan al síndrome top
    const topProfile = p_feature_given_syndrome[top.syndrome];
    const positive = [...present]
        .filter((f) => features.includes(f) || CLINICAL.features.includes(f))
        .map((f) => ({
            key: f,
            impact: features.includes(f) ? (topProfile[f] || 0) : pClinical(f, top.syndrome)
        }))
        .sort((a, b) => b.impact - a.impact)
        .slice(0, 4);

    const result = {
        top_syndrome: isConfident ? top.syndrome : null,
        top_probability,
        top_candidates,
        confidence_level,
        feature_importance: { positive, negative: [] },
        message: isConfident ? null : 'Patrón ambiguo (baja confianza) - Evaluación clínica indispensable',
        syndrome_probabilities
    };

    // Sin recalibración sintética: los campos "raw" coinciden con los finales.
    result.raw_top_syndrome = result.top_syndrome;
    result.raw_top_probability = top_probability;
    result.raw_top_candidates = top_candidates.map((c) => ({ ...c }));
    result.raw_syndrome_probabilities = { ...syndrome_probabilities };
    result.raw_confidence_level = confidence_level;
    return result;
}
