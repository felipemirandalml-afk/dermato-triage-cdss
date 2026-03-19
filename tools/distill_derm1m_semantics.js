import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONCEPT_MAPPING = {
    'macule': 'macula',
    'papule': 'papula',
    'plaque': 'placa',
    'vesicle': 'vesicula',
    'pustule': 'pustula',
    'bulla': 'bula_ampolla',
    'scale': 'escama',
    'scaling': 'escama',
    'crust': 'costra',
    'crusted': 'costra',
    'ulcer': 'ulcera',
    'erosion': 'erosion',
    'atrophy': 'atrofia',
    'excoriation': 'excoriacion',
    'lichenification': 'liquenificacion',
    'nodule': 'nodulo',
    'cyst': 'quiste',
    'erythema': 'eritema',
    'erythematous': 'eritema',
    'brown': 'hiperpigmentacion',
    'hyperpigmentation': 'hiperpigmentacion',
    'white': 'hipopigmentacion',
    'hypopigmentation': 'hipopigmentacion',
    'purpura': 'purpura',
    'scar': 'cicatriz',
    'sclerosis': 'esclerosis',
    'telangiectasia': 'telangiectasias',
    'wheal': 'habon',
    'comedone': 'comedon',
    'comedones': 'comedon',
    'tumor': 'tumor',
    'burrow': 'surco'
};

const CSV_PATH = path.join(__dirname, '../data/derm1m/concept.csv');
const OUTPUT_PATH = path.join(__dirname, '../engine/semiology_profiles.json');

// Un parser de línea CSV simple pero que maneja comas dentro de comillas
function parseCSVLine(line) {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(cur);
            cur = "";
        } else {
            cur += char;
        }
    }
    result.push(cur);
    return result;
}

function distill() {
    console.log('Reading Derm1M concepts...');
    if (!fs.existsSync(CSV_PATH)) {
        console.error('CSV not found at', CSV_PATH);
        return;
    }
    const data = fs.readFileSync(CSV_PATH, 'utf8');
    const lines = data.split('\n');

    const diseaseStats = {}; 

    lines.forEach((line) => {
        const parts = parseCSVLine(line.trim());
        if (parts.length < 3) return;
        
        // Parts[0] = path, Parts[1] = disease labels, Parts[2] = concepts
        const labelsRaw = parts[1].toLowerCase().trim();
        const conceptsRaw = parts[2].toLowerCase().trim();

        const labels = labelsRaw.split(',').map(l => l.trim()).filter(l => l.length > 0);

        labels.forEach(label => {
            if (!diseaseStats[label]) {
                diseaseStats[label] = { counts: {}, total: 0 };
            }

            diseaseStats[label].total++;

            const detectedFeatures = new Set();
            for (const [key, feature] of Object.entries(CONCEPT_MAPPING)) {
                if (conceptsRaw.includes(key)) {
                    detectedFeatures.add(feature);
                }
            }

            detectedFeatures.forEach(feature => {
                diseaseStats[label].counts[feature] = (diseaseStats[label].counts[feature] || 0) + 1;
            });
        });
    });

    const profiles = {};
    const MIN_INSTANCES = 10; 

    for (const [disease, stats] of Object.entries(diseaseStats)) {
        if (stats.total < MIN_INSTANCES) continue;

        const profile = {};
        for (const [feature, count] of Object.entries(stats.counts)) {
            const freq = count / stats.total;
            if (freq >= 0.05) { 
                profile[feature] = parseFloat(freq.toFixed(3));
            }
        }

        if (Object.keys(profile).length >= 1) { 
            profiles[disease] = profile;
        }
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(profiles, null, 2));
    console.log(`Distillation complete. ${Object.keys(profiles).length} disease profiles generated at ${OUTPUT_PATH}`);
}

distill();
