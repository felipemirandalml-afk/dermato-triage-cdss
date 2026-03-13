/**
 * baseline_model.js - Cálculo de scores base y probabilidades
 */

// Pesos explícitos por cada clase (P1: Urgente, P2: Prioritario, P3: Estable)
// P3 es idx 0, P2 es idx 1, P1 es idx 2 en los arreglos internos
const WEIGHT_MATRIX = {
    // Pesos que impulsan hacia P1 (URGENCIAL)
    P1: {
        lesion_ampolla: 12,
        lesion_bula: 12,
        lesion_ulcera: 8,
        lesion_erosion: 8,
        farmacos_recientes: 10,
        signo_fiebre: 12,
        tiempo_agudo: 6,
        lesion_purpura: 10,
        patron_generalizado: 6,
        inmunosupresion: 6,
        signo_dolor: 10,
        signo_mucosas: 8
    },
    // Pesos que impulsan hacia P2 (PRIORITARIO)
    P2: {
        lesion_nodulo: 10,
        lesion_tumor: 10,
        lesion_telangiectasia: 5,
        tiempo_subagudo: 2,
        topog_cabeza: 0.5,
        signo_dolor: 8,
        lesion_vesicula: 5,
        lesion_purpura: 6,
        patron_generalizado: 4,
        tiempo_agudo: 4
    },
    // Pesos que impulsan hacia P3 (ESTABLE)
    P3: {
        tiempo_cronico: 4,
        lesion_cicatriz: 3,
        lesion_atrofia: 3,
        lesion_escama: 1.5
    }
};

const BIASES = [4.0, 0.0, -12.0]; // P3, P2, P1
const BASE_NOISE = 0.1;

export function getWeight(classIdx, featureKey) {
    const classKey = ["P3", "P2", "P1"][classIdx];
    return WEIGHT_MATRIX[classKey][featureKey] || BASE_NOISE;
}

function softmax(scores) {
    const maxZ = Math.max(...scores);
    const exps = scores.map(zi => Math.exp(zi - maxZ));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(ei => ei / sumExps);
}

export function predictBaseline(X, FEATURE_INDEX) {
    const featureKeys = Object.keys(FEATURE_INDEX);
    
    const scores = [0, 1, 2].map(classIdx => {
        let sum = BIASES[classIdx];
        featureKeys.forEach(fKey => {
            const fIdx = FEATURE_INDEX[fKey];
            sum += X[fIdx] * getWeight(classIdx, fKey);
        });
        return sum;
    });

    const probs = softmax(scores);
    const winIdx = probs.indexOf(Math.max(...probs));
    
    return {
        classIdx: winIdx,
        probabilities: probs,
        priority: [3, 2, 1][winIdx], // Mapeo de winIdx a prioridad numérica
        label: ["Estable", "Prioritario", "Urgencial"][winIdx]
    };
}
