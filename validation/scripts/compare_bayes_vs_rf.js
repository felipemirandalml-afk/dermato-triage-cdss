/**
 * compare_bayes_vs_rf.js — Compara el clasificador sindrómico bayesiano (Naive Bayes
 * desde Derm1M) contra el RF actual, sobre el benchmark clínico completo.
 */
import { runTriage, encodeFeatures } from '../../frontend-v2/src/engine/model.js';
import { CLINICAL_CASES } from '../datasets/clinical_cases.js';
import { HARDENING_CASES } from '../datasets/hardening_cases_v2.js';
import PROFILES from '../../frontend-v2/src/data/syndrome_feature_profiles.json' with { type: 'json' };

const EPS = 1e-6;

function classifyBayes(presentSet) {
    const { syndromes, features, prior, p_feature_given_syndrome } = PROFILES;
    const scores = syndromes.map((s) => {
        let lp = Math.log(prior[s]);
        const pfs = p_feature_given_syndrome[s];
        for (const f of features) {
            const p = Math.min(Math.max(pfs[f], EPS), 1 - EPS);
            lp += presentSet.has(f) ? Math.log(p) : Math.log(1 - p);
        }
        return { syndrome: s, lp };
    });
    const max = Math.max(...scores.map((x) => x.lp));
    let z = 0;
    scores.forEach((x) => { x.p = Math.exp(x.lp - max); z += x.p; });
    scores.forEach((x) => { x.p /= z; });
    scores.sort((a, b) => b.p - a.p);
    return scores[0];
}

function presentCanonicalFeatures(caseInput) {
    const { helper } = encodeFeatures(caseInput);
    const fmap = helper.featureMap || {};
    return new Set(PROFILES.features.filter((f) => fmap[f] === 1 || fmap[f] === true));
}

const all = [...CLINICAL_CASES, ...HARDENING_CASES].filter((c) => c.expected_syndrome);

let rfHits = 0, bayesHits = 0;
const disagreements = [];

for (const c of all) {
    const expected = c.expected_syndrome;
    const rfTop = runTriage(c.input)?.probabilistic_analysis?.top_candidates?.[0]?.syndrome ?? null;
    const bayesTop = classifyBayes(presentCanonicalFeatures(c.input)).syndrome;

    const rfOk = rfTop === expected;
    const bayesOk = bayesTop === expected;
    if (rfOk) rfHits++;
    if (bayesOk) bayesHits++;
    if (rfOk !== bayesOk) {
        disagreements.push(`[${c.id}] exp=${expected} | RF=${rfTop}${rfOk ? '✓' : '✗'} | Bayes=${bayesTop}${bayesOk ? '✓' : '✗'}`);
    }
}

const n = all.length;
console.log(`Casos con síndrome esperado: ${n}\n`);
console.log(`  RF actual:  ${rfHits}/${n}  (${(100 * rfHits / n).toFixed(1)}%)`);
console.log(`  BAYES:      ${bayesHits}/${n}  (${(100 * bayesHits / n).toFixed(1)}%)\n`);
console.log('Casos donde difieren:');
disagreements.forEach((d) => console.log('  ' + d));
