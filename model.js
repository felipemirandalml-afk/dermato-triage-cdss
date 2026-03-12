/**
 * CDSS Dermatológico - Motor de Inferencia (model.js)
 * Regresión Logística Multiclase (Softmax)
 */

// Vector de factores (11 posiciones): [edad, sexo, fototipo, inmunosupresion, farmacos_recientes, riesgo_metabolico, atopia, auto_inmune, enf_intestinal, hepatopatia, sop_hirsutismo]
export const MODEL_WEIGHTS = {
    labels: ["Prioridad 3 (Baja)", "Prioridad 2 (Media)", "Prioridad 1 (Alta)"],
    weights: [
        // Clase 0 (Verde): Baja prioridad
        [-0.5, 0.1, -0.1, -1.5, -2.0,  0.5,  1.2,  0.5,  0.5,  0.2,  0.5], 
        // Clase 1 (Amarillo): Media
        [ 0.1, 0.0,  0.0,  0.5,  1.0,  0.2, -0.2,  0.5,  0.5,  0.5,  0.2], 
        // Clase 2 (Rojo): Alta
        [ 0.8, 0.1,  0.2,  3.5,  5.0, -1.0, -1.5, -0.5, -0.5,  0.1, -1.0]  
    ],
    biases: [1.2, 0.0, -4.0],
    featureNames: [
        "Edad", "Sexo", "Fototipo", "Inmunosupresión", "Fármacos Recientes", 
        "Riesgo Metabólico", "Atopía", "Enfermedad Auto-inmune", 
        "Enf. Inflamatoria Intestinal", "Hepatopatía", "SOP / Hirsutismo"
    ]
};

/**
 * Convierte los datos del formulario en un vector numérico (Feature Engineering)
 */
export function encodeFeatures(formData) {
    return [
        parseFloat(formData.age) / 100,             // 1. Edad
        formData.gender === 'male' ? 1 : 0,         // 2. Sexo
        parseInt(formData.fitzpatrick),             // 3. Fototipo
        formData.inmunosupresion ? 1 : 0,           // 4. Inmunosupresion
        formData.farmacos_recientes ? 1 : 0,        // 5. Farmacos recientes (Alta urgencia)
        formData.riesgo_metabolico ? 1 : 0,         // 6. Riesgo metabolico
        formData.atopia ? 1 : 0,                    // 7. Atopía
        formData.auto_inmune ? 1 : 0,               // 8. Auto-inmune
        formData.enf_intestinal ? 1 : 0,            // 9. Enf. intestinal
        formData.hepatopatia ? 1 : 0,               // 10. Hepatopatia
        formData.sop_hirsutismo ? 1 : 0             // 11. SOP/Hirsutismo
    ];
}

/**
 * Producto punto entre pesos y vector de entrada
 */
function dotProduct(w, x) {
    return w.reduce((sum, wi, i) => sum + wi * x[i], 0);
}

/**
 * Función Softmax para normalizar scores a probabilidades [0, 1]
 */
function softmax(z) {
    const maxZ = Math.max(...z);
    const exps = z.map(zi => Math.exp(zi - maxZ)); // Estabilidad numérica
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(ei => ei / sumExps);
}

/**
 * Realiza la inferencia
 */
export function predict(X) {
    const scores = MODEL_WEIGHTS.weights.map((w, i) => {
        return dotProduct(w, X) + MODEL_WEIGHTS.biases[i];
    });

    const probabilities = softmax(scores);
    const winningClassIdx = probabilities.indexOf(Math.max(...probabilities));

    return {
        classIdx: winningClassIdx,
        probabilities: probabilities,
        priority: [3, 2, 1][winningClassIdx], // Mapeo a Prioridad 3, 2, 1
        label: MODEL_WEIGHTS.labels[winningClassIdx]
    };
}

/**
 * Módulo de Explicabilidad (Human-in-the-Loop)
 * Calcula contribuciones: w_i * x_i
 */
export function explain(X, winningClassIdx) {
    const weights = MODEL_WEIGHTS.weights[winningClassIdx];
    const contributions = X.map((xi, i) => ({
        name: MODEL_WEIGHTS.featureNames[i],
        value: weights[i] * xi
    }));

    // Ordenar por impacto absoluto (magnitud de la influencia)
    return contributions
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
        .slice(0, 3);
}
