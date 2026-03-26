import fs from 'fs';
import path from 'path';

/**
 * GENERADOR DE CASOS SINTÉTICOS v2.0 (Massive Expansion)
 */

// 1. Cargar Archivos Maestro
const profiles = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/engine/semiology_profiles.json', 'utf8'));
const syndromeFile = fs.readFileSync('d:/dermato-triage-cdss/engine/syndrome_to_ontology_map.js', 'utf8');
const syndromeMap = JSON.parse(syndromeFile.substring(syndromeFile.indexOf('{'), syndromeFile.lastIndexOf('}') + 1));

// 2. Lore Map Epidemiológico (Consolidado)
const SYNDROME_LORE = {
    "eczema_dermatitis": { age: [0, 80], timing: ["chronic", "subacute"], symptoms: ["prurito"], priority: 3 },
    "psoriasiform_dermatosis": { age: [15, 70], timing: ["chronic"], symptoms: ["prurito"], priority: 3 },
    "bacterial_skin_infection": { age: [0, 95], timing: ["acute"], symptoms: ["dolor", "fiebre"], priority: 1 },
    "viral_skin_infection": { age: [0, 85], timing: ["acute"], symptoms: ["dolor", "fiebre"], priority: 2 },
    "fungal_skin_infection": { age: [0, 85], timing: ["subacute", "chronic"], symptoms: ["prurito"], priority: 3 },
    "drug_reaction": { age: [0, 95], timing: ["acute"], symptoms: ["prurito", "fiebre"], priority: 1 },
    "urticarial_dermatosis": { age: [0, 90], timing: ["acute"], symptoms: ["prurito"], priority: 3 },
    "vesiculobullous_disease": { age: [45, 95], timing: ["acute", "subacute"], symptoms: ["dolor"], priority: 2 },
    "cutaneous_tumor_suspected": { age: [45, 95], timing: ["chronic"], symptoms: [], priority: 2 },
    "benign_cutaneous_tumor": { age: [0, 95], timing: ["chronic"], symptoms: [], priority: 3 },
    "vasculitic_purpuric_disease": { age: [10, 80], timing: ["acute", "subacute"], symptoms: ["dolor"], priority: 1 },
    "inflammatory_dermatosis_other": { age: [5, 85], timing: ["subacute", "chronic"], symptoms: [], priority: 3 }
};

// Topography Expansion (v2)
const TOPOGRAPHY_EXPANDED = {
    "cara": ["topog_cabeza", "topo_cara_centro"],
    "manos": ["topog_ext_sup", "topo_palmas"],
    "pies": ["topog_ext_inf", "topo_plantas"],
    "tronco": ["topog_tronco"],
    "general": ["generalizado", "topog_tronco", "topog_ext_inf", "topog_ext_sup"],
    "flexuras": ["topo_axilas", "topo_inguinal", "topo_fosas_popliteas", "topo_fosas_cubitales"]
};

// 3. Syndrome Inferrer (Heurístico)
function inferSyndrome(name) {
    name = name.toLowerCase();
    for (const [sId, data] of Object.entries(syndromeMap)) {
        if (data.differentials.some(d => d.toLowerCase() === name)) return sId;
    }
    // Heurística de nombre
    if (name.includes('eczema') || name.includes('dermatitis')) return 'eczema_dermatitis';
    if (name.includes('carcinoma') || name.includes('melanoma') || name.includes('sarcoma')) return 'cutaneous_tumor_suspected';
    if (name.includes('herpes') || name.includes('viral')) return 'viral_skin_infection';
    if (name.includes('cellulitis') || name.includes('abscess')) return 'bacterial_skin_infection';
    if (name.includes('tinea') || name.includes('candidiasis') || name.includes('micosis')) return 'fungal_skin_infection';
    if (name.includes('purpura') || name.includes('vasculitis')) return 'vasculitic_purpuric_disease';
    if (name.includes('bullous') || name.includes('pemphig')) return 'vesiculobullous_disease';
    if (name.includes('nevus') || name.includes('keratosis')) return 'benign_cutaneous_tumor';
    return 'inflammatory_dermatosis_other';
}

function generateVariants(disease, syndromeId) {
    const profile = profiles[disease] || {};
    const lore = SYNDROME_LORE[syndromeId] || SYNDROME_LORE["inflammatory_dermatosis_other"];
    const sortedFeatures = Object.entries(profile).sort((a, b) => b[1] - a[1]);
    
    const variants = [];
    const baseInput = {
        age: Math.floor(Math.random() * (lore.age[1] - lore.age[0])) + lore.age[0],
        timing: lore.timing[Math.floor(Math.random() * lore.timing.length)]
    };
    lore.symptoms.forEach(s => baseInput[`signo_${s}`] = true);

    // 1. CORE Phenotype
    const coreInput = { ...baseInput };
    sortedFeatures.slice(0, 3).filter(([f, p]) => p > 0.15).forEach(([f]) => coreInput[`lesion_${f}`] = true);
    variants.push({ id: `V2-CORE-${disease}`, variant: 'core', input: coreInput });

    // 2. SPARSE Input
    if (sortedFeatures[0]) {
        const sparseInput = { ...baseInput };
        sparseInput[`lesion_${sortedFeatures[0][0]}`] = true;
        variants.push({ id: `V2-SPARSE-${disease}`, variant: 'sparse', input: sparseInput });
    }

    // 3. ATYPICAL but Plausible (Minor features)
    const atypicalInput = { ...baseInput };
    const minor = sortedFeatures.filter(([f, p]) => p > 0.05 && p < 0.25);
    if (minor.length > 0) {
        atypicalInput[`lesion_${minor[0][0]}`] = true;
        variants.push({ id: `V2-ATYPICAL-${disease}`, variant: 'atypical', input: atypicalInput });
    }

    // 4. BORDERLINE / CONFUSABLE (Noisy)
    const noisyInput = { ...coreInput, lesion_eritema: true, lesion_escama: true }; // Add common noise
    variants.push({ id: `V2-NOISY-${disease}`, variant: 'borderline', input: noisyInput });

    // 5. STRESS TEST (Conflicting data)
    // Add a discordant symptom or priority trigger
    const stressInput = { ...coreInput, signo_fiebre: true, signo_dolor: true }; // Trigger P1 shield
    variants.push({ id: `V2-STRESS-${disease}`, variant: 'stress', input: stressInput });

    return variants.map(v => ({
        id: `${v.id}-${Math.random().toString(36).substr(2, 4)}`,
        title: `${disease} (${v.variant})`,
        source_disease: disease,
        variant_type: v.variant,
        input: v.input,
        expected_syndrome: syndromeId,
        expected_priority: lore.priority
    }));
}

console.log("=== GENERANDO BENCHMARK v2.0 (MASIVO) ===");
const allGenerated = [];
const diseaseList = Object.keys(profiles);

diseaseList.forEach(disease => {
    const syndrome = inferSyndrome(disease);
    const variants = generateVariants(disease, syndrome);
    allGenerated.push(...variants);
});

const outputPath = 'd:/dermato-triage-cdss/tests/generated_synthetic_cases_v2.json';
fs.writeFileSync(outputPath, JSON.stringify(allGenerated, null, 2));

console.log(`- Diagnósticos analizados: ${diseaseList.length}`);
console.log(`- Casos generados: ${allGenerated.length}`);
console.log(`- Archivo: ${outputPath}`);
