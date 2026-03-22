import fs from 'fs';
import { runTriage } from '../model.js';
import { recalibrationEngine } from '../engine/recalibration_engine.js';

// 1. Cargar Dataset
const fitSet = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/f20_fitting/fit_set.json', 'utf8'));
const baseWeights = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/statistical_base_weights_v2.json', 'utf8'));

console.log("=== INICIANDO AJUSTE AUTOMÁTICO (F20 v1.5) ===");
const adjustedWeights = { ...baseWeights };
const alpha = 0.05;

recalibrationEngine.setWeights(adjustedWeights);

for (let epoch = 0; epoch < 5; epoch++) {
    let hits = 0;
    console.log(`- Epoch ${epoch+1}/5...`);
    
    fitSet.forEach((c) => {
        const result = runTriage(c.input);
        const predicted = result.probabilistic_analysis.top_syndrome;
        const actual = c.expected_syndrome;

        if (predicted === actual) {
            hits++;
        } else {
            // AJUSTE HEURÍSTICO
            Object.keys(c.input).forEach(f => {
                const targetSynd = recalibrationEngine.getSyndromeForFeature(f);
                if (targetSynd === actual) {
                    adjustedWeights[f] = Math.min(1.0, (adjustedWeights[f] || 0.1) + alpha);
                } else if (targetSynd === predicted) {
                    adjustedWeights[f] = Math.max(0.01, (adjustedWeights[f] || 0.1) - (alpha * 0.4));
                }
            });
            recalibrationEngine.setWeights(adjustedWeights);
        }
    });
    
    console.log(`  Accuracy: ${(hits/fitSet.length*100).toFixed(1)}%`);
}

fs.writeFileSync('d:/dermato-triage-cdss/data/statistical_base_weights_fit_v1.json', JSON.stringify(adjustedWeights, null, 2));
console.log("=== FITTING COMPLETADO ===");
process.exit(0);
