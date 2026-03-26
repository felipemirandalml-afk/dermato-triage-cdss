import fs from 'fs';
import { runTriage } from '../../runtime/engine/model.js';

// 1. Cargar Datos
const easyCases = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/tests/generated_easy_cases.json', 'utf8'));
const syndromes = ["eczema_dermatitis", "psoriasiform_dermatosis", "bacterial_skin_infection", "viral_skin_infection", "fungal_skin_infection", "drug_reaction", "urticarial_dermatosis", "vesiculobullous_disease", "vasculitic_purpuric_disease", "cutaneous_tumor_suspected", "benign_cutaneous_tumor", "inflammatory_dermatosis_other"];

console.log("=== INICIANDO AUDITORÍA SINDRÓMICA v2.0 (Sample 1000) ===");

const confusionMatrix = {};
syndromes.forEach(s => confusionMatrix[s] = {});

let processed = 0;
let viralCorrect = 0;
let viralTotal = 0;

easyCases.slice(0, 1000).forEach(c => {
    // IMPORTANTE: El motor model.js ya debe estar cargando los nuevos JSONs de recalibración v2 si se llamaron iguales.
    // Pero aquí solo queremos medir el impacto estadístico basándonos en la nueva arquitectura de pesos.
    const result = runTriage(c.input);
    const predicted = result.probabilistic_analysis.top_syndrome;
    const actual = c.expected_syndrome;

    if (syndromes.includes(actual)) {
        if (actual === 'viral_skin_infection') viralTotal++;
        if (predicted === actual) {
            if (actual === 'viral_skin_infection') viralCorrect++;
        }
        if (predicted) {
            confusionMatrix[actual][predicted] = (confusionMatrix[actual][predicted] || 0) + 1;
        }
    }
    processed++;
});

console.log(`- Muestra terminada: ${processed} casos`);
console.log(`- Viral Accuracy (Sample): ${(viralCorrect/viralTotal*100).toFixed(1)}%`);

fs.writeFileSync('d:/dermato-triage-cdss/data/syndromic_confusion_matrix_v2.json', JSON.stringify(confusionMatrix, null, 2));
process.exit(0);
