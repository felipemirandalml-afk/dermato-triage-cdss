/**
 * validate_uci_dermatology.js — Validación REAL (no sintética) sobre la UCI Dermatology
 * Database (Ilter & Guvenir, 1998; 366 pacientes reales). Usa SOLO las features clínicas
 * (sin biopsia, como nuestra herramienta) y mapea las 6 enfermedades a 3 síndromes.
 * Compara el clasificador bayesiano híbrido vs el RF actual.
 *
 * Uso: node validation/scripts/validate_uci_dermatology.js <ruta-csv>
 */
import fs from 'fs';
import { runTriage, encodeFeatures } from '../../frontend-v2/src/engine/model.js';
import P from '../../frontend-v2/src/data/syndrome_feature_profiles.json' with { type: 'json' };
import CL from '../../frontend-v2/src/data/clinical_likelihoods.json' with { type: 'json' };

const EPS = 1e-6;
const csvPath = process.argv[2] || 'C:/Users/hp/Downloads/dermatology.csv';

// Mapeo features clínicas UCI -> features canónicas (las histopatológicas se descartan)
const FEAT_MAP = {
    erythema: 'eritema', scaling: 'escama', itching: 'prurito',
    polygonal_papules: 'papula', follicular_papules: 'papula',
    oral_mucosal_involvement: 'mucosas',
    knee_and_elbow_involvement: 'topo_friccion_extensora',
    scalp_involvement: 'cabeza'
};
// 6 clases UCI -> 3 síndromes nuestros
const CLASS_TO_SYN = {
    '1': 'psoriasiform_dermatosis', '6': 'psoriasiform_dermatosis',
    '2': 'eczema_dermatitis', '5': 'eczema_dermatitis',
    '3': 'inflammatory_dermatosis_other', '4': 'inflammatory_dermatosis_other'
};
const CANDIDATES = ['psoriasiform_dermatosis', 'eczema_dermatitis', 'inflammatory_dermatosis_other'];

const pClin = (f, s) => { const lvl = CL.likelihoods[s] && CL.likelihoods[s][f]; return lvl ? CL.scale[lvl] : CL.default; };

function bayes(present, syndromes) {
    return syndromes.map((s) => {
        let lp = Math.log(P.prior[s] ?? 1 / syndromes.length);
        const pfs = P.p_feature_given_syndrome[s];
        for (const f of P.features) { const p = Math.min(Math.max(pfs[f], EPS), 1 - EPS); if (present.has(f)) lp += Math.log(p); }
        for (const f of CL.features) { const p = Math.min(Math.max(pClin(f, s), EPS), 1 - EPS); lp += present.has(f) ? Math.log(p) : Math.log(1 - p); }
        return { s, lp };
    }).sort((a, b) => b.lp - a.lp)[0].s;
}

// Parse CSV
const lines = fs.readFileSync(csvPath, 'utf8').trim().split(/\r?\n/);
const header = lines[0].split(',');
const idx = {};
header.forEach((h, i) => { idx[h.trim()] = i; });

let total = 0, bayesHits = 0, bayes14Hits = 0, rfHits = 0;
const confusion = {};

for (const line of lines.slice(1)) {
    const cols = line.split(',');
    const cls = cols[idx['class']].trim();
    const expected = CLASS_TO_SYN[cls];
    if (!expected) continue;

    // features presentes (graduadas 0-3 → presente si ≥1)
    const present = new Set();
    const formFeatures = {};
    for (const [uci, canon] of Object.entries(FEAT_MAP)) {
        if (idx[uci] !== undefined && Number(cols[idx[uci]]) >= 1) { present.add(canon); formFeatures[canon] = true; }
    }
    const age = Number(cols[idx['age']]) || 40;

    total++;
    // Bayesiano restringido a los 3 candidatos (el diferencial del dataset)
    if (bayes(present, CANDIDATES) === expected) bayesHits++;
    // Bayesiano en el espacio completo (14)
    if (bayes(present, P.syndromes) === expected) bayes14Hits++;
    // RF: top entre los 3 candidatos
    const pa = runTriage({ age, features: formFeatures }).probabilistic_analysis;
    const probs = pa.syndrome_probabilities || {};
    const rfTop = CANDIDATES.map((s) => ({ s, p: probs[s] || 0 })).sort((a, b) => b.p - a.p)[0].s;
    if (rfTop === expected) rfHits++;

    const key = `${expected} -> bayes:${bayes(present, CANDIDATES)}`;
    confusion[key] = (confusion[key] || 0) + 1;
}

console.log(`UCI Dermatology — ${total} pacientes REALES (solo features clínicas, sin biopsia)\n`);
console.log(`Diferencial de 3 síndromes (psoriasiforme vs eczema vs inflamatorio-otros):`);
console.log(`  BAYESIANO híbrido:  ${bayesHits}/${total}  (${(100 * bayesHits / total).toFixed(1)}%)`);
console.log(`  RF actual:          ${rfHits}/${total}  (${(100 * rfHits / total).toFixed(1)}%)`);
console.log(`\nBayesiano en espacio completo (14 síndromes): ${(100 * bayes14Hits / total).toFixed(1)}%`);
console.log(`\nBaseline (clase mayoritaria): ${(100 * 132 / 366).toFixed(1)}%`);
