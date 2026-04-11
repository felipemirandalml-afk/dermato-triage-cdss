import { describe, expect, it, vi } from 'vitest';
import { runTriage } from './model.js';

describe('runTriage contract', () => {
    it('returns a stable result shape for valid segmented formData', () => {
        const formData = {
            age: 34,
            sex: 'female',
            timing: 'agudo',
            features: {
                papula: true,
                prurito: true,
                generalizado: true,
                escama: true
            }
        };

        const result = runTriage(formData, 'es');

        expect(result.status).toBe('ok');
        expect([1, 2, 3]).toContain(result.priority);
        expect(result.priority_code).toBe(`P${result.priority}`);
        expect(typeof result.label).toBe('string');
        expect(typeof result.conduct).toBe('string');
        expect(typeof result.timeframe).toBe('string');
        expect(Array.isArray(result.triggered_rules)).toBe(true);
        expect(Array.isArray(result.redFlags)).toBe(true);
        expect(Array.isArray(result.differential_ranking)).toBe(true);
        expect(result.probabilistic_analysis).toMatchObject({
            confidence_level: expect.any(String),
            top_candidates: expect.any(Array),
            feature_importance: expect.objectContaining({
                positive: expect.any(Array),
                negative: expect.any(Array)
            })
        });
        const probabilitySum = result.probabilistic_analysis.top_candidates
            .reduce((sum, candidate) => sum + candidate.probability, 0);
        expect(probabilitySum).toBeCloseTo(1, 5);
        expect(result.probabilistic_analysis.top_probability).toBeLessThanOrEqual(1);
        expect(result.probabilistic_analysis.raw_top_probability).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(result.probabilistic_analysis.raw_top_candidates)).toBe(true);
        expect(result.primary_syndrome).toBe(result.probabilistic_analysis.top_syndrome ?? null);
        expect(result.error).toBeNull();
    });

    it('returns the same base contract on engine errors', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = runTriage(null, 'es');

        expect(result.status).toBe('error');
        expect(result.priority).toBe(3);
        expect(result.priority_code).toBe('P3');
        expect(result.primary_syndrome).toBeNull();
        expect(Array.isArray(result.triggered_rules)).toBe(true);
        expect(Array.isArray(result.redFlags)).toBe(true);
        expect(Array.isArray(result.differential_ranking)).toBe(true);
        expect(result.probabilistic_analysis.top_candidates).toEqual([]);
        expect(result.probabilistic_analysis.top_syndrome).toBeNull();
        expect(typeof result.error).toBe('string');

        errorSpy.mockRestore();
    });
});
