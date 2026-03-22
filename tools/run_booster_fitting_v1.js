import fs from 'fs';
import { runTriage } from '../model.js';
import { recalibrationEngine } from '../engine/recalibration_engine.js';

// 1. Cargar Datos
const fitSet = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/f20_fitting/fit_set.json', 'utf8'));
const baseWeightsFit = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/statistical_base_weights_fit_v1.json', 'utf8'));
const boostersV2 = JSON.parse(fs.readFileSync('d:/dermato-triage-cdss/data/syndrome_boosters_v2.json', 'utf8'));

console.log("=== INICIANDO AJUSTE DE BOOSTERS CONTEXTUALES (F20 v1.8) ===");

// Empezamos con los boosters v2
const adjustedBoosters = { ...boostersV2 };
const alpha = 0.1;

recalibrationEngine.setWeights(baseWeightsFit);

for (let epoch = 0; epoch < 3; epoch++) {
    let hits = 0;
    console.log(`- Epoch ${epoch+1}/3...`);
    
    fitSet.filter(c => c.type === 'textbook').forEach((c) => {
        const result = runTriage(c.input);
        if (result.probabilistic_analysis.top_syndrome === c.expected_syndrome) {
            hits++;
        } else {
            // Si falló un caso textbook, potenciar boosters que sumen al correcto
            const active = Object.keys(c.input).filter(k => c.input[k] === true);
            // Identificar tríadas presentes en el input
            for (let i = 0; i < active.length; i++) {
                for (let j = i + 1; j < active.length; j++) {
                    for (let k = j + 1; k < active.length; k++) {
                        const key = [active[i], active[j], active[k]].sort().join('___');
                        if (adjustedBoosters[key]) {
                            if (adjustedBoosters[key].syndrome === c.expected_syndrome) {
                                adjustedBoosters[key].boost = Math.min(0.8, adjustedBoosters[key].boost + alpha);
                            } else {
                                // Penalizar booster que probablemente está 'secuestrando' al síndrome equivocado
                                adjustedBoosters[key].boost = Math.max(0.01, adjustedBoosters[key].boost - alpha);
                            }
                        }
                    }
                }
            }
        }
    });
    console.log(`  Accuracy (Textbook): ${(hits/fitSet.filter(c => c.type === 'textbook').length*100).toFixed(1)}%`);
}

fs.writeFileSync('d:/dermato-triage-cdss/data/syndrome_boosters_fit_v1.json', JSON.stringify(adjustedBoosters, null, 2));
console.log("=== FITTING DE BOOSTERS COMPLETADO ===");
process.exit(0);
