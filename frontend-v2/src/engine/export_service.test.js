import { describe, expect, it } from 'vitest';
import { generateClinicalReport } from './export_service.js';
import { runTriage } from './model.js';

describe('generateClinicalReport', () => {
    it('builds a report from the current segmented formData contract', () => {
        const formData = {
            age: 27,
            sex: 'female',
            timing: 'subagudo',
            features: {
                papula: true,
                prurito: true,
                mucosas: true
            }
        };

        const result = runTriage(formData, 'es');
        const report = generateClinicalReport(formData, result);

        expect(report).toContain('Edad: 27');
        expect(report).toContain('Sexo: Femenino');
        expect(report).toContain('Tiempo de evolucion');
        expect(report).toContain('Hallazgos:');
        expect(report).toContain('Prioridad:');
    });

    it('does not break when the result comes from the normalized error contract', () => {
        const formData = {
            age: '',
            sex: '',
            timing: '',
            features: {}
        };

        const report = generateClinicalReport(formData, {
            priority: 3,
            priority_code: 'P3',
            label: 'Error en Procesamiento',
            conduct: 'Falla tecnica. Por favor, reinicie el flujo o consulte soporte.',
            timeframe: 'Diferible',
            status: 'error',
            error: 'Synthetic test error',
            redFlags: [],
            triggered_rules: [],
            differential_ranking: [],
            primary_syndrome: null,
            probabilistic_analysis: {
                top_syndrome: null,
                confidence_level: 'low',
                top_candidates: [],
                feature_importance: { positive: [], negative: [] }
            },
            justification: ''
        });

        expect(report).toContain('Prioridad: P3 (Error en Procesamiento)');
        expect(report).toContain('Error en Procesamiento');
    });
});
