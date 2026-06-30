/**
 * probe_hybrid_bayes.js — SONDA DE FACTIBILIDAD (no productivo, estimaciones sin citar).
 * Mide si el Naive Bayes HÍBRIDO (morfología Derm1M + clínica estimada) puede llegar
 * al 70.8% del RF. Si sí, vale la pena construir la tabla clínica citada en serio.
 */
import { runTriage, encodeFeatures } from '../../frontend-v2/src/engine/model.js';
import { CLINICAL_CASES } from '../datasets/clinical_cases.js';
import { HARDENING_CASES } from '../datasets/hardening_cases_v2.js';
import PROFILES from '../../frontend-v2/src/data/syndrome_feature_profiles.json' with { type: 'json' };

const EPS = 1e-6;
const DEF = 0.4; // verosimilitud clínica neutra por defecto

// Tabla clínica TOSCA: P(feature_no_morfológica | síndrome). Solo celdas discriminativas.
// Escala: típico 0.85 / frecuente 0.6 / ocasional 0.2 / raro 0.05. (PROVISIONAL, sin citar)
const CLIN = {
    fiebre:        { bacterial_skin_infection:0.6, viral_skin_infection:0.55, drug_reaction:0.6, vasculitic_purpuric_disease:0.45, vesiculobullous_disease:0.2, connective_tissue_disease:0.25, eczema_dermatitis:0.05, psoriasiform_dermatosis:0.05, fungal_skin_infection:0.05, urticarial_dermatosis:0.1, pigmentary_disorder:0.02, cutaneous_tumor_suspected:0.02, benign_cutaneous_tumor:0.02, inflammatory_dermatosis_other:0.1 },
    agudo:         { bacterial_skin_infection:0.85, viral_skin_infection:0.8, urticarial_dermatosis:0.85, drug_reaction:0.8, vasculitic_purpuric_disease:0.6, vesiculobullous_disease:0.5, eczema_dermatitis:0.35, fungal_skin_infection:0.3, connective_tissue_disease:0.2, inflammatory_dermatosis_other:0.35, psoriasiform_dermatosis:0.1, pigmentary_disorder:0.05, cutaneous_tumor_suspected:0.05, benign_cutaneous_tumor:0.05 },
    subagudo:      { drug_reaction:0.4, vasculitic_purpuric_disease:0.4, inflammatory_dermatosis_other:0.4 },
    cronico:       { psoriasiform_dermatosis:0.85, pigmentary_disorder:0.8, benign_cutaneous_tumor:0.8, eczema_dermatitis:0.6, cutaneous_tumor_suspected:0.6, fungal_skin_infection:0.5, connective_tissue_disease:0.6, inflammatory_dermatosis_other:0.5, bacterial_skin_infection:0.1, viral_skin_infection:0.1, urticarial_dermatosis:0.1, drug_reaction:0.1, vasculitic_purpuric_disease:0.3, vesiculobullous_disease:0.3 },
    prurito:       { eczema_dermatitis:0.85, urticarial_dermatosis:0.85, inflammatory_dermatosis_other:0.5, fungal_skin_infection:0.5, psoriasiform_dermatosis:0.45, vesiculobullous_disease:0.45 },
    prurito_nocturno: { inflammatory_dermatosis_other:0.6 },
    dolor:         { bacterial_skin_infection:0.55, vasculitic_purpuric_disease:0.4, vesiculobullous_disease:0.4, viral_skin_infection:0.35 },
    ardor_quemazon:{ viral_skin_infection:0.45 },
    asintomatico:  { pigmentary_disorder:0.7, benign_cutaneous_tumor:0.6, cutaneous_tumor_suspected:0.5 },
    farmacos_recientes: { drug_reaction:0.9 },
    inmunosupresion: {},
    diabetes:      {},
    atopia:        { eczema_dermatitis:0.8 },
    contagio_familiar: { inflammatory_dermatosis_other:0.5, viral_skin_infection:0.5, bacterial_skin_infection:0.3, fungal_skin_infection:0.3 },
    mucosas:       { vesiculobullous_disease:0.7, drug_reaction:0.6, viral_skin_infection:0.3 },
    generalizado:  { drug_reaction:0.6, viral_skin_infection:0.5, urticarial_dermatosis:0.5, pigmentary_disorder:0.3 },
    localizado:    { bacterial_skin_infection:0.5, fungal_skin_infection:0.5, benign_cutaneous_tumor:0.6, cutaneous_tumor_suspected:0.6 },
    fotoexpuesto:  { connective_tissue_disease:0.8, cutaneous_tumor_suspected:0.5, drug_reaction:0.3 },
    acral:         { vasculitic_purpuric_disease:0.5, fungal_skin_infection:0.45, viral_skin_infection:0.3, connective_tissue_disease:0.3 },
    topo_flexural_pliegues: { eczema_dermatitis:0.6, fungal_skin_infection:0.5 },
    topo_friccion_extensora: { psoriasiform_dermatosis:0.6 },
    simetrico:     { psoriasiform_dermatosis:0.5, eczema_dermatitis:0.5, drug_reaction:0.5 },
    dermatomal:    { viral_skin_infection:0.5 }
};
const CLIN_FEATURES = Object.keys(CLIN);

function pClin(feature, syndrome) {
    const row = CLIN[feature];
    return (row && row[syndrome] !== undefined) ? row[syndrome] : DEF;
}

function classifyHybrid(present, { uniform, morphPresentOnly }) {
    const { syndromes, features, prior, p_feature_given_syndrome } = PROFILES;
    const scored = syndromes.map((s) => {
        let lp = uniform ? 0 : Math.log(prior[s]);
        // morfología (Derm1M)
        const pfs = p_feature_given_syndrome[s];
        for (const f of features) {
            const p = Math.min(Math.max(pfs[f], EPS), 1 - EPS);
            if (present.has(f)) lp += Math.log(p);
            else if (!morphPresentOnly) lp += Math.log(1 - p);
        }
        // clínica (estimada)
        for (const f of CLIN_FEATURES) {
            const p = Math.min(Math.max(pClin(f, s), EPS), 1 - EPS);
            lp += present.has(f) ? Math.log(p) : Math.log(1 - p);
        }
        return { s, lp };
    });
    return scored.sort((a, b) => b.lp - a.lp)[0].s;
}

function presentFeatures(input) {
    const { helper } = encodeFeatures(input);
    const fm = helper.featureMap || {};
    return new Set(Object.keys(fm).filter((k) => fm[k] === 1 || fm[k] === true));
}

const all = [...CLINICAL_CASES, ...HARDENING_CASES].filter((c) => c.expected_syndrome);

let rf = 0;
for (const c of all) {
    if ((runTriage(c.input)?.probabilistic_analysis?.top_candidates?.[0]?.syndrome ?? null) === c.expected_syndrome) rf++;
}
console.log(`RF actual:                     ${(100 * rf / all.length).toFixed(1)}%`);

for (const cfg of [
    { uniform: false, morphPresentOnly: false, name: 'híbrido prior+bernoulli' },
    { uniform: true, morphPresentOnly: false, name: 'híbrido uniforme+bernoulli' },
    { uniform: false, morphPresentOnly: true, name: 'híbrido prior+morph-present' },
    { uniform: true, morphPresentOnly: true, name: 'híbrido uniforme+morph-present' }
]) {
    let hits = 0;
    for (const c of all) {
        if (classifyHybrid(presentFeatures(c.input), cfg) === c.expected_syndrome) hits++;
    }
    console.log(`${cfg.name.padEnd(32)} ${(100 * hits / all.length).toFixed(1)}%`);
}
