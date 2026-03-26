import { CLINICAL_CASES } from '../datasets/clinical_cases.js';
import { FEATURE_INDEX } from '../../runtime/engine/constants.js';
import { conceptMapper } from '../../runtime/engine/concept_mapper.js';

const COLORS = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    cyan: "\x1b[36m"
};

const ALLOWED_DEMO_KEYS = ['age', 'sex', 'fitzpatrick', 'timing'];

export function validateDatasetSchema() {
    console.log(`${COLORS.cyan}>>> Iniciando Validación Estructural del Dataset...${COLORS.reset}`);
    
    let totalErrors = 0;
    const casesWithErrors = [];

    CLINICAL_CASES.forEach((c, idx) => {
        const errors = [];
        const caseId = c.id || `INDEX_${idx}`;

        // Verificación de Estructura de Objeto
        if (!c.id) errors.push("Falta 'id'");
        if (!c.title) errors.push("Falta 'title'");
        if (!c.input) errors.push("Falta 'input'");
        if (c.expected_priority === undefined) errors.push("Falta 'expected_priority'");

        // Verificación de Contrato de Inputs (Solo lo que el feature_encoder puede reconocer)
        if (c.input) {
            Object.keys(c.input).forEach(key => {
                const isDemo = ALLOWED_DEMO_KEYS.includes(key);
                const isCanonicalOrAlias = conceptMapper.resolve(key) !== null;

                if (!isDemo && !isCanonicalOrAlias) {
                    errors.push(`Key NO reconocida por el Concept Mapper: '${key}'`);
                }
            });
        }

        if (errors.length > 0) {
            totalErrors += errors.length;
            casesWithErrors.push({ id: caseId, errors });
        }
    });

    if (totalErrors > 0) {
        console.error(`${COLORS.red}✖ FALLO DE SCHEMA: Se detectaron ${totalErrors} discrepancias de contrato.${COLORS.reset}`);
        casesWithErrors.forEach(ce => {
            console.error(`  - Case [${ce.id}]: ${ce.errors.join(", ")}`);
        });
        return false;
    }

    console.log(`${COLORS.green}✔ SCHEMA OK: El dataset respeta el contrato clínico vigente.${COLORS.reset}\n`);
    return true;
}

// Soporte para ejecución independiente
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
    const success = validateDatasetSchema();
    process.exit(success ? 0 : 1);
}
