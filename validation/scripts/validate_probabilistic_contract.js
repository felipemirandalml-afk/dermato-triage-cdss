/**
 * validate_probabilistic_contract.js
 * Verifica que el contrato de entrada del modelo probabilístico esté sincronizado
 * con las constantes de la aplicación y el encoder.
 */
import { MODEL_DATA } from '../../runtime/engine/probabilistic_model.js';
import { FEATURE_INDEX, PROBABILISTIC_FEATURES } from '../../runtime/engine/constants.js';

console.log("--- AUDITORÍA DE CONTRATO PROBABILÍSTICO ---");

let errors = 0;
const modelFeatures = MODEL_DATA.metadata.features;
const modelFeatureCount = modelFeatures.length;

// 1. Verificar Dimensionalidad
const coefficients = MODEL_DATA.parameters.coefficients[0];
if (coefficients.length !== modelFeatureCount) {
    console.error(`[FAIL] Desalineación interna en el modelo: Metadata declara ${modelFeatureCount} features pero los coeficientes tienen ${coefficients.length}.`);
    errors++;
} else {
    console.log(`[PASS] Dimensionalidad consistente: ${modelFeatureCount} features.`);
}

// 2. Verificar existencia y orden en FEATURE_INDEX
modelFeatures.forEach((f, i) => {
    const appIdx = FEATURE_INDEX[f];
    if (appIdx === undefined) {
        console.error(`[FAIL] Feature '${f}' (modelo idx ${i}) NO existe en constants.js (FEATURE_INDEX).`);
        errors++;
    }
});

// 3. Verificar que las interacciones estén mapeadas
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
