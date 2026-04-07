import { runTriage } from './runtime/engine/model.js';

// Caso de prueba con variaciones:
// - 'pápulas' (plural + acento) -> debe resolver a 'papula'
// - 'escamas' (plural) -> debe resolver a 'escama'
// - 'tronco' (existente)
// - 'chronic' (alias exacto que añadimos antes)
const input = { 
    age: 70, 
    pápulas: true, 
    escamas: true, 
    tronco: true, 
    timing: "chronic" 
};

console.log("--- Testing Refined Mapper ---");
const result = runTriage(input);

console.log("Input:", JSON.stringify(input, null, 2));
console.log("Result Priority:", result.priority);
console.log("Result Top Syndrome:", result.probabilistic_analysis.top_syndrome);
console.log("\nTop 5 Candidates:");
result.probabilistic_analysis.top_candidates.slice(0, 5).forEach(s => {
    console.log(` - ${s.syndrome}: ${s.probability.toFixed(3)}`);
});
