/**
 * validate_probabilistic_contract.js
 * Verifica que el contrato de entrada del modelo probabilístico (Random Forest)
 * esté sincronizado con las constantes de la aplicación y el encoder.
 *
 * Nota: el modelo actual es un Random Forest serializado (rf_model.json), no la
 * antigua regresión logística por coeficientes. Este script valida el contrato
 * vigente: que cada feature declarada por el modelo exista en FEATURE_INDEX y que
 * los índices de feature usados por los árboles caigan dentro del rango declarado.
 */
import RF_MODEL_DATA from '../../frontend-v2/src/engine/rf_model.json' with { type: 'json' };
import { FEATURE_INDEX } from '../../frontend-v2/src/engine/constants.js';

console.log("--- AUDITORÍA DE CONTRATO PROBABILÍSTICO (Random Forest) ---");

let errors = 0;
const modelFeatures = RF_MODEL_DATA.metadata.features;
const modelFeatureCount = modelFeatures.length;

// 1. Verificar que cada feature del modelo exista en FEATURE_INDEX (encodable)
modelFeatures.forEach((f, i) => {
    if (FEATURE_INDEX[f] === undefined) {
        console.error(`[FAIL] Feature '${f}' (modelo idx ${i}) NO existe en constants.js (FEATURE_INDEX).`);
        errors++;
    }
});
if (errors === 0) {
    console.log(`[PASS] Las ${modelFeatureCount} features del modelo existen en FEATURE_INDEX.`);
}

// 2. Verificar que los índices de feature de los árboles estén en rango
let outOfRange = 0;
function checkNode(node) {
    if (!node || node.is_leaf) return;
    if (node.feature < 0 || node.feature >= modelFeatureCount) outOfRange++;
    checkNode(node.left);
    checkNode(node.right);
}
RF_MODEL_DATA.trees.forEach(checkNode);
if (outOfRange > 0) {
    console.error(`[FAIL] ${outOfRange} nodos referencian un índice de feature fuera de rango [0, ${modelFeatureCount}).`);
    errors += outOfRange;
} else {
    console.log(`[PASS] Todos los nodos de los ${RF_MODEL_DATA.trees.length} árboles referencian features válidas.`);
}

// 3. Verificar que las interacciones críticas estén mapeadas en el sistema
const expectedInteractions = [
    "interaccion_fiebre_purpura",
    "interaccion_fiebre_ampolla",
    "interaccion_inmuno_agudo",
    "interaccion_dolor_agudo"
];
expectedInteractions.forEach(intKey => {
    if (FEATURE_INDEX[intKey] === undefined) {
        console.error(`[FAIL] Interacción crítica '${intKey}' no está definida en el sistema.`);
        errors++;
    }
});

// 4. Reporte Final
console.log("\n-------------------------------------------");
if (errors === 0) {
    console.log("\x1b[32m%s\x1b[0m", "CONTRATO VALIDADO: Alineación 100% garantizada.");
    process.exit(0);
} else {
    console.log("\x1b[31m%s\x1b[0m", `CONTRATO ROTO: Se encontraron ${errors} errores de desalineación.`);
    process.exit(1);
}
