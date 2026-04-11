import { describe, expect, it } from 'vitest';
import { clinicalValidation } from './validation.js';
import conceptMapper from './concept_mapper.js';

describe('UI-to-engine feature contract', () => {
    it('resolves red flag ids emitted by the UI to engine-supported features', () => {
        expect(conceptMapper.resolve('mucosas')).toBe('mucosas');
        expect(conceptMapper.resolve('necrosis_isquemia')).toBe('necrosis_isquemia');
        expect(conceptMapper.resolve('signo_hipotension')).toBe('signo_hipotension');
        expect(conceptMapper.resolve('compromiso_conciencia')).toBe('compromiso_conciencia');
        expect(conceptMapper.resolve('abcde_color')).toBe('signo_abcde');
        expect(conceptMapper.resolve('abcde_evolucion')).toBe('signo_abcde');
    });

    it('accepts current segmented formData with UI red flag aliases as valid input', () => {
        const result = clinicalValidation.validateFormData({
            age: 61,
            sex: 'male',
            timing: 'cronico',
            features: {
                abcde_color: true
            }
        });

        expect(result.isValid).toBe(true);
        expect(result.missing.features).toBe(false);
    });
});
