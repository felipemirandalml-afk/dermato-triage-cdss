/**
 * audit_coefficients.js - Auditoría de Ponderaciones del Modelo Probabilístico
 * Permite visualizar qué características impulsan o frenan cada diagnóstico diferencial.
 */

import fs from 'fs';
import path from 'path';

const coefficientsPath = path.resolve('engine/model_coefficients.json');

if (!fs.existsSync(coefficientsPath)) {
    console.error(`Error: No se encuentra el archivo de coeficientes en ${coefficientsPath}`);
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(coefficientsPath, 'utf8'));

const { classes, features } = data.metadata;
const { coefficients } = data.parameters;

console.log("\x1b[1m\x1b[36m====================================================\x1b[0m");
console.log("\x1b[1m\x1b[36m   DERMATOTRIAGE CDSS - AUDITORÍA DE COEFICIENTES   \x1b[0m");
console.log("\x1b[1m\x1b[36m====================================================\x1b[0m\n");

classes.forEach((syndrome, syndromeIdx) => {
    const classWeights = coefficients[syndromeIdx];
    
    // Crear pares feature-peso
    const pairs = features.map((name, i) => ({ 
        name, 
        weight: classWeights[i] 
    })).filter(p => p.weight !== 0); // Omitir pesos neutros
    
    // Ordenar por relevancia
    const topPositive = [...pairs].sort((a, b) => b.weight - a.weight).slice(0, 5);
    const topNegative = [...pairs].sort((a, b) => a.weight - b.weight).slice(0, 5);
    
    console.log(`\x1b[1m\x1b[33mSyndrome: ${syndrome}\x1b[0m`);
    
    console.log("\nTop Positive Features (Aumentan Probabilidad)");
    console.log("--------------------------------------------");
    topPositive.forEach(p => {
        const bar = "█".repeat(Math.min(20, Math.floor(Math.abs(p.weight) * 2)));
        console.log(`\x1b[32m${p.name.padEnd(30)} \x1b[1m+${p.weight.toFixed(2).padStart(5)}\x1b[0m  ${bar}`);
    });
    
    console.log("\nTop Negative Features (Disminuyen Probabilidad)");
    console.log("--------------------------------------------");
    topNegative.forEach(p => {
        const bar = "█".repeat(Math.min(20, Math.floor(Math.abs(p.weight) * 2)));
        console.log(`\x1b[31m${p.name.padEnd(30)} \x1b[1m${p.weight.toFixed(2).padStart(6)}\x1b[0m  ${bar}`);
    });
    
    console.log("\n" + "\x1b[36m-\x1b[0m".repeat(50) + "\n");
});
