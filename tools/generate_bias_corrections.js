import fs from 'fs';
import { MODEL_DATA } from '../engine/probabilistic_model.js';

console.log("=== CALCULANDO CORRECCIONES BASALES (NIR v1.0) ===");

const classes = MODEL_DATA.metadata.classes;
const intercepts = MODEL_DATA.parameters.intercept;
const corrections = {};

classes.forEach((c, i) => {
    // Nir Factor: exp(-intercept)
    // Esto nivela el softmax original si asumimos que las otras features contribuyen 0.
    corrections[c] = parseFloat(Math.exp(-intercepts[i]).toFixed(4));
});

fs.writeFileSync('d:/dermato-triage-cdss/data/classwise_bias_corrections_v1.json', JSON.stringify(corrections, null, 2));

console.table(corrections);
console.log("=== ARTEFACTO DE CORRECCIÓN LISTO ===");
process.exit(0);
