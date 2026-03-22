import fs from 'fs';
import path from 'path';

/**
 * GENERADOR DE CASOS "FÁCILES / TEXTBOOK" (Phase 11)
 */

// 1. Cargar Archivos Maestro
const profiles = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/engine/semiology_profiles.json', 'utf8'));
const syndromeFile = fs.readFileSync('d:/dermato-triage-cdss/engine/syndrome_to_ontology_map.js', 'utf8');
const syndromeMap = JSON.parse(syndromeFile.substring(syndromeFile.indexOf('{'), syndromeFile.lastIndexOf('}') + 1));

// 2. Lore Map Epidemiológico (Consolidado y Estrictamente Textbook)
const SYNDROME_LORE = {
    "eczema_dermatitis": { age: [25, 25], timing: ["chronic"], symptoms: ["prurito"], priority: 3 },
    "psoriasiform_dermatosis": { age: [40, 40], timing: ["chronic"], symptoms: ["prurito"], priority: 3 },
    "bacterial_skin_infection": { age: [50, 50], timing: ["acute"], symptoms: ["dolor", "fiebre"], priority: 1 },
    "viral_skin_infection": { age: [10, 10], timing: ["acute"], symptoms: ["dolor"], priority: 2 },
    "fungal_skin_infection": { age: [30, 30], timing: ["subacute"], symptoms: ["prurito"], priority: 3 },
    "drug_reaction": { age: [45, 45], timing: ["acute"], symptoms: ["prurito", "fiebre"], priority: 1 },
    "urticarial_dermatosis": { age: [25, 25], timing: ["acute"], symptoms: ["prurito"], priority: 3 },
    "vesiculobullous_disease": { age: [65, 65], timing: ["acute"], symptoms: ["dolor"], priority: 2 },
    "cutaneous_tumor_suspected": { age: [70, 70], timing: ["chronic"], symptoms: [], priority: 2 },
    "benign_cutaneous_tumor": { age: [50, 50], timing: ["chronic"], symptoms: [], priority: 3 },
    "vasculitic_purpuric_disease": { age: [40, 40], timing: ["acute"], symptoms: ["dolor"], priority: 1 },
    "inflammatory_dermatosis_other": { age: [30, 30], timing: ["chronic"], symptoms: [], priority: 3 }
};

// 3. Syndrome Inferrer (Heurístico)
function inferSyndrome(name) {
    name = name.toLowerCase();
    for (const [sId, data] of Object.entries(syndromeMap)) {
        if (data.differentials.some(d => d.toLowerCase() === name)) return sId;
    }
    if (name.includes('eczema') || name.includes('dermatitis')) return 'eczema_dermatitis';
    if (name.includes('carcinoma') || name.includes('melanoma')) return 'cutaneous_tumor_suspected';
    if (name.includes('herpes') || name.includes('viral')) return 'viral_skin_infection';
    if (name.includes('cellulitis') || name.includes('abscess')) return 'bacterial_skin_infection';
    if (name.includes('tinea') || name.includes('micosis')) return 'fungal_skin_infection';
    return 'inflammatory_dermatosis_other';
}

function generateEasyCase(disease, syndromeId) {
    const profile = profiles[disease] || {};
    const lore = SYNDROME_LORE[syndromeId] || SYNDROME_LORE["inflammatory_dermatosis_other"];
    
    // Filtro estricto: Solo lo más común
    const topFeatures = Object.entries(profile)
        .filter(([f, p]) => p > 0.45) // Textbook clear threshold
        .sort((a, b) => b[1] - a[1]);

    if (topFeatures.length === 0) return null; // Excluir diagnósticos sin "core" claro

    const input = {
        age: lore.age[0],
        timing: lore.timing[0]
    };
    lore.symptoms.forEach(s => input[`signo_${s}`] = true);

    // Filtrar Ruido de eritema/escama si hay algo más específico
    let mainFeatures = topFeatures.slice(0, 2); // Máximo 2
    if (mainFeatures.length > 1) {
        const hasSpecific = mainFeatures.some(m => !['eritema', 'escama'].includes(m[0]));
        if (hasSpecific) {
            mainFeatures = mainFeatures.filter(m => !['eritema', 'escama'].includes(m[0]) || m[1] > 0.85);
        }
    }
    
    mainFeatures.forEach(([f]) => input[`lesion_${f}`] = true);

    // Topografía típica (Inferencia)
    let topo = "tronco";
    if (disease.toLowerCase().includes("tinea pedis")) topo = "plantas";
    if (disease.toLowerCase().includes("acne") || disease.toLowerCase().includes("rosacea")) topo = "cara_centro";
    if (disease.toLowerCase().includes("atopic")) topo = "cabeza"; 
    
    input[`topog_${topo}`] = true;

    return {
        id: `EASY-${disease.replace(/ /g, '_').toUpperCase()}`,
        title: `${disease} (Easy Case)`,
        source_disease: disease,
        input: input,
        expected_syndrome: syndromeId,
        expected_priority: lore.priority,
        difficulty: "easy"
    };
}

console.log("=== GENERANDO EASY BENCHMARK (TEXTBOOK) ===");
const easyCases = [];
const excluded = [];

Object.keys(profiles).forEach(disease => {
    const syndrome = inferSyndrome(disease);
    const c = generateEasyCase(disease, syndrome);
    if (c) {
        easyCases.push(c);
    } else {
        excluded.push(disease);
    }
});

const outputPath = 'd:/dermato-triage-cdss/tests/generated_easy_cases.json';
fs.writeFileSync(outputPath, JSON.stringify(easyCases, null, 2));

console.log(`- Easy Cases Generados: ${easyCases.length}`);
console.log(`- Diagnósticos Excluidos (Falta de core >45%): ${excluded.length}`);
console.log(`- Archivo: ${outputPath}`);
