import { runTriage } from './runtime/engine/model.js';

const input = { age: 70, papula: true, escama: true, tronco: true, timing: "chronic" };
const result = runTriage(input);

console.log("Input:", JSON.stringify(input, null, 2));
console.log("Result Priority:", result.priority);
console.log("Result Top Syndrome:", result.probabilistic_analysis.top_syndrome);
console.log("Syndrome Probabilities (after refinement):");
result.probabilistic_analysis.top_candidates.slice(0, 5).forEach(s => {
    console.log(` - ${s.syndrome}: ${s.probability.toFixed(3)}`);
});

if (result.probabilistic_analysis.top_features) {
    console.log("\nTop Features contributing to top syndrome:");
    result.probabilistic_analysis.top_features.forEach(f => {
        console.log(` - ${f.feature}: ${f.importance.toFixed(3)}`);
    });
}
