import { runTriage } from '../../runtime/engine/model.js';

const testCases = [
    {
        name: "Herpes Zóster (Textbook)",
        formData: {
            age: 45, timing: 'acute',
            eritema: true, vesicula: true, patron_zosteriforme: true, dolor: true,
            tronco: true
        },
        expectedSyndrome: 'viral_skin_infection',
        expectedDisease: 'herpes zoster'
    },
    {
        name: "Acné (Textbook)",
        formData: {
            age: 16, timing: 'chronic',
            comedon: true, papula: true, pustula: true, quiste: true,
            cara: true
        },
        expectedSyndrome: 'inflammatory_dermatosis_other',
        expectedDisease: 'acne'
    }
];

testCases.forEach(tc => {
    console.log(`=== TEST: ${tc.name} ===`);
    const result = runTriage(tc.formData);
    console.log(`- Syndrome: ${result.probabilistic_analysis.top_syndrome} (Prob: ${result.probabilistic_analysis.top_probability.toFixed(2)})`);
    console.log(`- Differential Top 1: ${result.differential_ranking[0]?.disease_name} (Score: ${result.differential_ranking[0]?.score.toFixed(2)})`);
    console.log(`- Rules: ${result.differential_ranking[0]?.matched_rules.join(', ')}`);
});
