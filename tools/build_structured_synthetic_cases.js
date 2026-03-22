import fs from 'fs';
import path from 'path';

// Load profiles
const profiles = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/engine/semiology_profiles.json', 'utf8'));
const syndromeFile = fs.readFileSync('d:/dermato-triage-cdss/engine/syndrome_to_ontology_map.js', 'utf8');
const syndromeMap = JSON.parse(syndromeFile.substring(syndromeFile.indexOf('{'), syndromeFile.lastIndexOf('}') + 1));

/**
 * Lore Map: Contexto epidemiológico por Síndrome
 */
const SYNDROME_LORE = {
    "eczema_dermatitis": { ageRange: [0, 80], timing: ["subacute", "chronic"], symptoms: ["prurito"], priority: 3 },
    "psoriasiform_dermatosis": { ageRange: [15, 70], timing: ["chronic"], symptoms: ["prurito"], priority: 3 },
    "bacterial_skin_infection": { ageRange: [0, 95], timing: ["acute"], symptoms: ["dolor", "fiebre"], priority: 2 },
    "viral_skin_infection": { ageRange: [0, 85], timing: ["acute"], symptoms: ["dolor", "fiebre"], priority: 2 },
    "fungal_skin_infection": { ageRange: [0, 90], timing: ["subacute", "chronic"], symptoms: ["prurito"], priority: 3 },
    "drug_reaction": { ageRange: [0, 95], timing: ["acute"], symptoms: ["prurito", "fiebre"], priority: 1 },
    "urticarial_dermatosis": { ageRange: [0, 90], timing: ["acute"], symptoms: ["prurito"], priority: 3 },
    "vesiculobullous_disease": { ageRange: [50, 95], timing: ["acute", "subacute"], symptoms: ["dolor"], priority: 2 },
    "cutaneous_tumor_suspected": { ageRange: [45, 95], timing: ["chronic"], symptoms: [], priority: 2 },
    "benign_cutaneous_tumor": { ageRange: [0, 95], timing: ["chronic"], symptoms: [], priority: 3 },
    "inflammatory_dermatosis_other": { ageRange: [10, 80], timing: ["subacute", "chronic"], symptoms: [], priority: 3 }
};

/**
 * Topography Habitat Map (Heurístico)
 */
const TOPOGRAPHY_LORE = {
    "acne_rosacea": ["cara_centro", "cabeza"],
    "eczema_atopic": ["flexuras", "cabeza", "tronco"],
    "zoster": ["tronco", "cara_centro"],
    "cellulitis": ["extremidad_inferior", "cara_centro"],
    "tinea": ["tronco", "extremidad_superior", "extremidad_inferior"],
    "scabies": ["acral", "tronco"]
};

function generateCase(disease, syndromeId, variantType = 'core') {
    const profile = profiles[disease.toLowerCase()] || {};
    const lore = SYNDROME_LORE[syndromeId] || SYNDROME_LORE["inflammatory_dermatosis_other"];
    
    // 1. Seleccionar morfología basada en frecuencia
    const sortedFeatures = Object.entries(profile).sort((a, b) => b[1] - a[1]);
    const input = {
        age: Math.floor(Math.random() * (lore.ageRange[1] - lore.ageRange[0])) + lore.ageRange[0],
        timing: lore.timing[Math.floor(Math.random() * lore.timing.length)]
    };

    // Agregar síntomas
    lore.symptoms.forEach(s => {
        if (variantType !== 'sparse' || Math.random() > 0.5) {
            input[`signo_${s}`] = true;
        }
    });

    // Agregar morfología
    if (variantType === 'core') {
        sortedFeatures.slice(0, 3).forEach(([feat, prob]) => { if (prob > 0.1) input[`lesion_${feat}`] = true; });
    } else if (variantType === 'sparse') {
        if (sortedFeatures[0]) input[`lesion_${sortedFeatures[0][0]}`] = true;
    } else if (variantType === 'atypical') {
        if (sortedFeatures[0]) input[`lesion_${sortedFeatures[1] ? sortedFeatures[1][0] : sortedFeatures[0][0]}`] = true;
    }

    // Topografía (Inferencia básica)
    const habitats = TOPOGRAPHY_LORE[disease.toLowerCase()] || ["tronco"];
    const topo = habitats[Math.floor(Math.random() * habitats.length)];
    input[`topog_${topo}`] = true;

    return {
        id: `SYN-${disease.replace(/ /g, '_').toUpperCase()}-${variantType.toUpperCase()}-${Math.random().toString(36).substr(2, 5)}`,
        title: `${disease} (${variantType})`,
        source_disease: disease,
        variant_type: variantType,
        input: input,
        expected_syndrome: syndromeId,
        expected_priority: lore.priority
    };
}

const generatedCases = [];
for (const [syndromeId, data] of Object.entries(syndromeMap)) {
    data.differentials.forEach(disease => {
        // Generate variants for each disease
        generatedCases.push(generateCase(disease, syndromeId, 'core'));
        generatedCases.push(generateCase(disease, syndromeId, 'sparse'));
        generatedCases.push(generateCase(disease, syndromeId, 'atypical'));
    });
}

const outputPath = 'd:/dermato-triage-cdss/tests/generated_synthetic_cases.json';
fs.writeFileSync(outputPath, JSON.stringify(generatedCases, null, 2));

console.log(`=== GENERADOR DE CASOS SINTÉTICOS ===`);
console.log(`Total casos generados: ${generatedCases.length}`);
console.log(`Archivo: ${outputPath}`);
