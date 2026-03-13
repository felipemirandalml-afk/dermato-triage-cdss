/**
 * test_probabilistic_engine.js
 * Sistema de validación automatizada para el motor probabilístico de DermatoTriage.
 */

import { runTriage } from '../model.js';

const scenarios = [
    {
        name: "Herpes Zoster",
        data: {
            age: 65, fitzpatrick: 3,
            lesion_vesicula: true, patron_dermatomal: true, signo_dolor: true, timing: 'acute'
        }
    },
    {
        name: "Psoriasis",
        data: {
            age: 45, fitzpatrick: 2,
            lesion_placa: true, lesion_escama: true, timing: 'chronic', patron_extensor: true
        }
    },
    {
        name: "Dermatitis atópica",
        data: {
            age: 10, fitzpatrick: 3,
            lesion_papula: true, signo_prurito: true, patron_flexural: true, timing: 'chronic', antecedente_atopia: true
        }
    },
    {
        name: "Reacción medicamentosa",
        data: {
            age: 50, fitzpatrick: 3,
            lesion_papula: true, patron_generalizado: true, signo_prurito: true, timing: 'acute', farmacos_recientes: true
        }
    },
    {
        name: "Celulitis bacteriana",
        data: {
            age: 60, fitzpatrick: 3,
            lesion_placa: true, signo_dolor: true, signo_fiebre: true, timing: 'acute'
        }
    },
    {
        name: "Urticaria",
        data: {
            age: 30, fitzpatrick: 2,
            lesion_papula: true, signo_prurito: true, timing: 'acute', patron_generalizado: true
        }
    },
    {
        name: "Tumor cutáneo sospechoso",
        data: {
            age: 70, fitzpatrick: 2,
            lesion_ulcera: true, timing: 'chronic', patron_localizado: true
        }
    },
    {
        name: "Caso inespecífico leve",
        data: {
            age: 25, fitzpatrick: 3,
            lesion_papula: true, patron_localizado: true, timing: 'subacute'
        }
    }
];

console.log("=== INICIANDO PRUEBAS DEL MOTOR PROBABILÍSTICO ===");

const summary = {
    total: scenarios.length,
    priorities: { P1: 0, P2: 0, P3: 0 }
};

scenarios.forEach(scenario => {
    // Ejecutar Triage
    const res = runTriage(scenario.data);
    const pa = res.probabilistic_analysis;

    // Actualizar resumen
    const pKey = `P${res.priority}`;
    summary.priorities[pKey]++;

    console.log("--------------------------------");
    console.log(`Caso: ${scenario.name}`);
    console.log(`Prioridad: ${pKey}`);
    if (pa) {
        console.log(`Síndrome probable: ${pa.top_syndrome}`);
        console.log(`Probabilidad: ${pa.top_probability.toFixed(2)}`);
    } else {
        console.log("ERROR: No se generó análisis probabilístico.");
    }
});

console.log("--------------------------------");
console.log("\n=== RESUMEN ===");
console.log(`Total casos: ${summary.total}`);
console.log("Distribución prioridades:");
console.log(`P1: ${summary.priorities.P1}`);
console.log(`P2: ${summary.priorities.P2}`);
console.log(`P3: ${summary.priorities.P3}`);
console.log("===============");
