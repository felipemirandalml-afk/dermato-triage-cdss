import fs from 'fs';
import { MODEL_DATA } from '../engine/probabilistic_model.js';

console.log("=== AUDITORÍA ESTRUCTURAL DE COEFICIENTES (Cervello Sindrómico) ===");

const classes = MODEL_DATA.metadata.classes;
const features = MODEL_DATA.metadata.features;
const weights = MODEL_DATA.parameters.coefficients; // [classes][features]

// 1. Identificar Features en Disputa
const featureConflict = {};

features.forEach((f, fIdx) => {
    const scores = classes.map((c, cIdx) => ({ syndrome: c, weight: weights[cIdx][fIdx] }));
    scores.sort((a, b) => b.weight - a.weight);
    
    // Si los dos top síndromes tienen pesos positivos altos y similares -> Conflicto
    if (scores[0].weight > 0.5 && scores[1].weight > 0.5) {
        featureConflict[f] = { 
            syndromes: [scores[0].syndrome, scores[1].syndrome],
            gap: (scores[0].weight - scores[1].weight).toFixed(2)
        };
    }
});

console.log("--- Rasgos con Alta Colisión Sindrómica (Conflictos de Desempate) ---");
console.table(featureConflict);

// 2. Fortalezas Singulares
const anchors = [];
features.forEach((f, fIdx) => {
    const scores = classes.map((c, cIdx) => ({ syndrome: c, weight: weights[cIdx][fIdx] }));
    scores.sort((a,b) => b.weight - a.weight);
    if (scores[0].weight > 1.5 && scores[1].weight < 0.2) {
        anchors.push({ feature: f, top: scores[0].syndrome, weight: scores[0].weight });
    }
});

console.log("--- Anclas Estructurales (Unívocas) ---");
console.table(anchors.sort((a,b) => b.weight - a.weight).slice(0, 10));

console.log("=== AUDITORÍA COMPLETADA ===");
process.exit(0);
