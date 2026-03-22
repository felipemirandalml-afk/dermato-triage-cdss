import fs from 'fs';
import path from 'path';

// 1. Cargar Conocimiento v2
const profiles = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/engine/semiology_profiles.json', 'utf8'));
const syndromeFile = fs.readFileSync('d:/dermato-triage-cdss/engine/syndrome_to_ontology_map.js', 'utf8');
const syndromeMap = JSON.parse(syndromeFile.substring(syndromeFile.indexOf('{'), syndromeFile.lastIndexOf('}') + 1));

// 2. Syndrome Dictionary
function getSyndromeId(disease) {
    disease = disease.toLowerCase();
    for (const [sId, data] of Object.entries(syndromeMap)) {
        if (data.differentials.some(d => d.toLowerCase() === disease)) return sId;
    }
    return 'inflammatory_dermatosis_other';
}

// 3. Generador de Casos Diversos
function generateCase(diseaseName, profile, type = 'textbook') {
    const input = { age: 35, timing: 'acute' };
    const sId = getSyndromeId(diseaseName);
    
    const sortedFeats = Object.entries(profile).sort((a,b) => b[1] - a[1]);
    
    if (type === 'textbook') {
        // Top 4 features
        sortedFeats.slice(0, 4).forEach(([f, p]) => input[f] = true);
    } else if (type === 'sparse') {
        // Only 1 top feature + 1 random from top 5 (if avail)
        if (sortedFeats.length > 0) input[sortedFeats[0][0]] = true;
        if (sortedFeats.length > 1) {
            const idx = 1 + Math.floor(Math.random() * Math.min(4, sortedFeats.length - 1));
            input[sortedFeats[idx][0]] = true;
        }
    } else if (type === 'noisy') {
        // Top 3 features + 2 random noises (low freq global)
        sortedFeats.slice(0, 3).forEach(([f, p]) => input[f] = true);
        input['eritema'] = true; // Noise universal
        if (Math.random() > 0.5) input['hiperpigmentacion'] = true;
    }

    return {
        id: `F20_${type.toUpperCase()}_${diseaseName.replace(/\s/g, '_')}`,
        disease: diseaseName,
        expected_syndrome: sId,
        input: input,
        type: type
    };
}

// 4. Producción de 30,000 casos
const diseases = Object.keys(profiles);
const allCases = [];

console.log("=== GENERANDO DATASET DE 30,000 CASOS PARA FITTING ===");

// Distribución: 50% Textbook, 25% Sparse, 25% Noisy
for (let i = 0; i < 30000; i++) {
    const disease = diseases[i % diseases.length];
    const profile = profiles[disease];
    let type = 'textbook';
    if (i > 15000) type = 'sparse';
    if (i > 22500) type = 'noisy';
    
    allCases.push(generateCase(disease, profile, type));
}

// 5. Particionado (70% Fit, 15% Val, 15% Holdout)
const shuffled = allCases.sort(() => 0.5 - Math.random());
const fitSet = shuffled.slice(0, 21000);
const valSet = shuffled.slice(21000, 25500);
const holdoutSet = shuffled.slice(25500);

if (!fs.existsSync('d:/dermato-triage-cdss/data/f20_fitting')) {
    fs.mkdirSync('d:/dermato-triage-cdss/data/f20_fitting');
}

fs.writeFileSync('d:/dermato-triage-cdss/data/f20_fitting/fit_set.json', JSON.stringify(fitSet, null, 2));
fs.writeFileSync('d:/dermato-triage-cdss/data/f20_fitting/val_set.json', JSON.stringify(valSet, null, 2));
fs.writeFileSync('d:/dermato-triage-cdss/data/f20_fitting/holdout_set.json', JSON.stringify(holdoutSet, null, 2));

console.log(`- Fitting: ${fitSet.length} casos`);
console.log(`- Validation: ${valSet.length} casos`);
console.log(`- Holdout: ${holdoutSet.length} casos`);
console.log("=== DATASET F20 LISTO ===");
