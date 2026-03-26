import fs from 'fs';
import { runTriage } from '../../runtime/engine/model.js';
import { recalibrationEngine } from '../../runtime/engine/recalibration_engine.js';

// 1. Cargar Dataset 80k (Fit Set)
const fitSet = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/f20v2_fitting/fit_set_80k.json', 'utf8'));
const baseWeightsFitV1 = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/statistical_base_weights_fit_v1.json', 'utf8'));
const boostersFitV1 = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/syndrome_boosters_fit_v1.json', 'utf8'));

console.log("=== INICIANDO FITTING MASIVO 80K (Phase 20 v2) ===");

const adjustedWeights = { ...baseWeightsFitV1 };
const adjustedBoosters = { ...boostersFitV1 };
const alpha = 0.08;

recalibrationEngine.setWeights(adjustedWeights);

// Epoch 1-2: Base Weights
for (let epoch = 0; epoch < 2; epoch++) {
    let hits = 0;
    console.log(`- Bloque A (Base Weights) - Epoch ${epoch+1}/2...`);
    
    fitSet.forEach((c) => {
        const result = runTriage(c.input);
        const predicted = result.probabilistic_analysis.top_syndrome;
        const actual = c.expected_syndrome;

        if (predicted === actual) {
            hits++;
        } else {
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

// Epoch 3-4: Contextual Boosters
for (let epoch = 0; epoch < 2; epoch++) {
    let hits = 0;
    console.log(`- Bloque B (Boosters) - Epoch ${epoch+1}/2...`);
    
    fitSet.forEach((c) => {
        const result = runTriage(c.input);
        const predicted = result.probabilistic_analysis.top_syndrome;
        const actual = c.expected_syndrome;

        if (predicted === actual) {
            hits++;
        } else {
            const active = Object.keys(c.input).filter(k => c.input[k] === true);
            for (let i = 0; i < active.length; i++) {
                for (let j = i + 1; j < active.length; j++) {
                    for (let k = j + 1; k < active.length; k++) {
                        const key = [active[i], active[j], active[k]].sort().join('___');
                        if (adjustedBoosters[key]) {
                            if (adjustedBoosters[key].syndrome === actual) {
                                adjustedBoosters[key].boost = Math.min(0.8, adjustedBoosters[key].boost + (alpha/2));
                            } else if (adjustedBoosters[key].syndrome === predicted) {
                                adjustedBoosters[key].boost = Math.max(0.01, adjustedBoosters[key].boost - (alpha/2));
                            }
                        }
                    }
                }
            }
        }
    });
    console.log(`  Accuracy: ${(hits/fitSet.length*100).toFixed(1)}%`);
}

// Export Final v2
fs.writeFileSync('d:/dermato-triage-cdss/data/statistical_base_weights_fit_v2.json', JSON.stringify(adjustedWeights, null, 2));
fs.writeFileSync('d:/dermato-triage-cdss/data/syndrome_boosters_fit_v2.json', JSON.stringify(adjustedBoosters, null, 2));

console.log("=== FITTING MASIVO COMPLETADO ===");
process.exit(0);
