/**
 * probabilistic_model.js - Inferencia Probabilística de Síndromes Dermatológicos
 * Implementa Random Forest entrenado en Fase 3 para mayor resolución en fronteras clínicas.
 */
import { FEATURE_INDEX } from './constants.js';
import RF_MODEL_DATA from './rf_model.json' with { type: 'json' };

const CONFIDENCE_THRESHOLD = 0.40;

/**
 * Evalúa un solo árbol de decisión del bosque.
 * Además, cuenta cuántas veces los features PRESENTES en el paciente
 * fueron claves (activaron la rama derecha del árbol) en la trayectoria.
 */
function evaluateTree(treeNode, x, activatedFeaturesTally) {
    if (treeNode.is_leaf) {
        return treeNode.value;
    }
    
    const featureIdx = treeNode.feature;
    const val = x[featureIdx];
    
    // En árboles sklearn, la condición es: val <= threshold -> left, else right
    if (val <= treeNode.threshold) {
        return evaluateTree(treeNode.left, x, activatedFeaturesTally);
    } else {
        // Trazabilidad Clínica: El paciente TIENE este feature (val > threshold, típicamente threshold es 0.5)
        // y el árbol tomó una decisión basada en él. Lo sumamos a la importancia explicable.
        activatedFeaturesTally[featureIdx] = (activatedFeaturesTally[featureIdx] || 0) + 1;
        return evaluateTree(treeNode.right, x, activatedFeaturesTally);
    }
}

/**
 * Ejecuta la predicción de Random Forest.
 * @param {Array} X - Vector de features unificado (raw mapping de la app)
 */
export function predictProbabilisticSyndrome(X) {
    const { features, classes } = RF_MODEL_DATA.metadata;
    const numClasses = classes.length;
    
    // 1. Mapeo Canónico del Vector
    const rawVector = features.map(fName => {
        const idx = FEATURE_INDEX[fName];
        if (idx === undefined) return 0;
        return X[idx] || 0;
    });

    // 2. Inferencia Ensemble (Random Forest)
    let sumProbs = new Array(numClasses).fill(0);
    let activatedFeaturesTally = {};
    
    RF_MODEL_DATA.trees.forEach(tree => {
        const leafProbs = evaluateTree(tree, rawVector, activatedFeaturesTally);
        for(let i=0; i<numClasses; i++) {
            sumProbs[i] += leafProbs[i];
        }
    });

    // Calcular promedios finales
    const numTrees = RF_MODEL_DATA.trees.length;
    const probabilities = sumProbs.map(p => p / numTrees);
    
    // 3. Empaquetar y Ordenar Candidatos
    const syndrome_probabilities = {};
    const candidates = [];

    probabilities.forEach((prob, i) => {
        const className = classes[i];
        syndrome_probabilities[className] = prob;
        candidates.push({ syndrome: className, probability: prob });
    });

    const top_candidates = candidates.sort((a, b) => b.probability - a.probability);
    const top_syndrome = top_candidates[0].syndrome;
    const top_probability = top_candidates[0].probability;
    
    // Calibración de Confianza
    const isConfident = top_probability >= CONFIDENCE_THRESHOLD;
    const confidence_level = top_probability > 0.70 ? "high" : (isConfident ? "medium" : "low");

    // 4. Trazabilidad: Obtener los features "Positivos" más consultados (Ramas Activas)
    const importanceArray = Object.keys(activatedFeaturesTally).map(idxStr => {
        const idx = parseInt(idxStr, 10);
        return {
            key: features[idx],
            impact: activatedFeaturesTally[idx] / numTrees // % de árboles que usaron esta rama
        };
    }).sort((a, b) => b.impact - a.impact).slice(0, 4);

    const feature_importance = {
        positive: importanceArray,
        negative: [] // En Random Forest la ausencia (rama izquierda) es más compleja de atribuir a 1 solo síndrome final sin valores por nodo, enfocamos la explicabilidad en firmas positivas presentes.
    };

    return {
        top_syndrome: isConfident ? top_syndrome : null,
        top_probability,
        top_candidates,
        confidence_level,
        feature_importance,
        message: isConfident ? null : "Patrón ambiguo (Baja confianza en conjunto RF) - Evaluación clínica indispensable",
        syndrome_probabilities
    };
}
