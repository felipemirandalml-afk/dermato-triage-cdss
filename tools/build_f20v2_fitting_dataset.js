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

// 3. Generador de Casos Diversos v2 (80k)
function generateCaseV2(diseaseName, profile, type = 'textbook') {
    const input = { age: 20 + Math.floor(Math.random()*60), timing: 'acute' };
    const sId = getSyndromeId(diseaseName);
    
    const sortedFeats = Object.entries(profile).sort((a,b) => b[1] - a[1]);
    
    if (type === 'textbook') {
        sortedFeats.slice(0, 4).forEach(([f, p]) => input[f] = true);
    } else if (type === 'sparse') {
        if (sortedFeats.length > 0) input[sortedFeats[0][0]] = true;
        if (sortedFeats.length > 1) {
            const idx = 1 + Math.floor(Math.random() * Math.min(4, sortedFeats.length - 1));
            input[sortedFeats[idx][0]] = true;
        }
    } else if (type === 'noisy') {
        sortedFeats.slice(0, 3).forEach(([f, p]) => input[f] = true);
        const noises = ['eritema', 'prurito', 'escama', 'hiperpigmentacion'];
        input[noises[Math.floor(Math.random()*4)]] = true;
        if (Math.random() > 0.5) input[noises[Math.floor(Math.random()*4)]] = true;
    } else if (type === 'borderline') {
        // Mezcla con otra enfermedad del mismo macro-síndrome? No, simplificado:
        sortedFeats.slice(0, 2).forEach(([f, p]) => input[f] = true);
        // Añadir una feature de 'inflammatory_other' para confundir
        input['papula'] = true;
        input['eritema'] = true;
    }

    return {
        id: `F20V2_${type.toUpperCase()}_${diseaseName.replace(/\s/g, '_')}`,
        disease: diseaseName,
        expected_syndrome: sId,
        input: input,
        type: type
    };
}

// 4. Producción de 80,000 casos
const diseases = Object.keys(profiles);
const allCases = [];

console.log("=== GENERANDO DATASET DE 80,000 CASOS PARA FITTING v2 ===");

for (let i = 0; i < 80000; i++) {
    const disease = diseases[i % diseases.length];
    const profile = profiles[disease];
    let type = 'textbook';
    if (i > 30000) type = 'sparse';
    if (i > 50000) type = 'noisy';
    if (i > 70000) type = 'borderline';
    
    allCases.push(generateCaseV2(disease, profile, type));
}

// 5. Particionado (75% Fit, 12.5% Val, 12.5% Holdout)
const shuffled = allCases.sort(() => 0.5 - Math.random());
const fitSet = shuffled.slice(0, 60000);
const valSet = shuffled.slice(60000, 70000);
const holdoutSet = shuffled.slice(70000);

if (!fs.existsSync('d:/dermato-triage-cdss/data/f20v2_fitting')) {
    fs.mkdirSync('d:/dermato-triage-cdss/data/f20v2_fitting');
}

fs.writeFileSync('d:/dermato-triage-cdss/data/f20v2_fitting/fit_set_80k.json', JSON.stringify(fitSet, null, 2));
fs.writeFileSync('d:/dermato-triage-cdss/data/f20v2_fitting/val_set_80k.json', JSON.stringify(valSet, null, 2));
fs.writeFileSync('d:/dermato-triage-cdss/data/f20v2_fitting/holdout_set_80k.json', JSON.stringify(holdoutSet, null, 2));

console.log(`- Fitting: ${fitSet.length} casos`);
console.log(`- Validation: ${valSet.length} casos`);
console.log(`- Holdout: ${holdoutSet.length} casos`);
console.log("=== DATASET 80K LISTO ===");
