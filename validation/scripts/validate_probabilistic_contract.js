/**
 * validate_probabilistic_contract.js
 * Verifica el contrato del clasificador sindrómico (Naive Bayes híbrido):
 *  1. Los 14 síndromes son consistentes entre perfiles morfológicos,
 *     verosimilitudes clínicas y la tabla de urgencia basal (triage_protocol).
 *  2. Las features clínicas existen en FEATURE_INDEX (las puede producir el encoder).
 */
import PROFILES from '../../frontend-v2/src/data/syndrome_feature_profiles.json' with { type: 'json' };
import CLINICAL from '../../frontend-v2/src/data/clinical_likelihoods.json' with { type: 'json' };
import { FEATURE_INDEX, EXTRA_FEATURE_INDEX } from '../../frontend-v2/src/engine/constants.js';
import { SYNDROME_BASELINE_URGENCY } from '../../frontend-v2/src/engine/triage_protocol.js';

console.log('--- AUDITORÍA DE CONTRATO DEL CLASIFICADOR (Naive Bayes híbrido) ---');

let errors = 0;

// 1. Consistencia de síndromes entre las tres fuentes
const profileSyn = new Set(PROFILES.syndromes);
const clinicalSyn = new Set(Object.keys(CLINICAL.likelihoods));
const baselineSyn = new Set(Object.keys(SYNDROME_BASELINE_URGENCY));

for (const s of baselineSyn) {
    if (!profileSyn.has(s)) { console.error(`[FAIL] '${s}' está en urgencia basal pero NO tiene perfil morfológico.`); errors++; }
    if (!clinicalSyn.has(s)) { console.error(`[FAIL] '${s}' está en urgencia basal pero NO tiene verosimilitudes clínicas.`); errors++; }
}
for (const s of profileSyn) {
    if (!baselineSyn.has(s)) { console.error(`[FAIL] '${s}' tiene perfil pero NO está en la tabla de urgencia basal.`); errors++; }
}
if (errors === 0) {
    console.log(`[PASS] ${baselineSyn.size} síndromes consistentes (perfiles + clínica + urgencia basal).`);
}

// 2. Las features clínicas existen en FEATURE_INDEX
const missingClinical = CLINICAL.features.filter((f) => FEATURE_INDEX[f] === undefined);
if (missingClinical.length > 0) {
    console.error(`[FAIL] Features clínicas no encodables: ${missingClinical.join(', ')}`);
    errors += missingClinical.length;
} else {
    console.log(`[PASS] Las ${CLINICAL.features.length} features clínicas existen en FEATURE_INDEX.`);
}

// 3. Cobertura de features morfológicas (informativo)
const morphResolvable = PROFILES.features.filter((f) => FEATURE_INDEX[f] !== undefined || EXTRA_FEATURE_INDEX[f] !== undefined);
console.log(`[INFO] Features morfológicas: ${morphResolvable.length}/${PROFILES.features.length} en FEATURE_INDEX/EXTRA.`);

console.log('\n-------------------------------------------');
if (errors === 0) {
    console.log('\x1b[32m%s\x1b[0m', 'CONTRATO VALIDADO: clasificador consistente con el motor.');
    process.exit(0);
} else {
    console.log('\x1b[31m%s\x1b[0m', `CONTRATO ROTO: ${errors} inconsistencias.`);
    process.exit(1);
}
