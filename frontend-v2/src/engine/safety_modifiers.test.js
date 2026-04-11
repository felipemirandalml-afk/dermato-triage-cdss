import { describe, it, expect } from 'vitest';
import { applySafetyModifiers, applyBlockModifiers } from './safety_modifiers.js';

describe('Safety Modifiers', () => {
    const createHelper = (features = {}, edad = 20) => ({
        has: (key) => !!features[key],
        get: (key) => (key === 'edad' ? edad : features[key])
    });

    it('should trigger ocular risk warning', () => {
        const helper = createHelper({
            topog_cabeza: true,
            topo_cara_centro: true,
            vesicula: true
        });
        const result = applySafetyModifiers(helper, { priority: 3 });
        expect(result.priority).toBe(1);
        expect(result.rules[0]).toContain('[ALERTA]');
    });

    it('should trigger ischemia warning for acute ulcer', () => {
        const helper = createHelper({
            ulcera: true,
            agudo: true
        });
        const result = applySafetyModifiers(helper, { priority: 3 });
        expect(result.priority).toBe(1);
        expect(result.match).toBe(true);
    });

    it('should trigger malignancy shield for chronic nodule in elderly', () => {
        const helper = createHelper({
            topog_cabeza: true,
            topo_cara_centro: true,
            nodulo: true
        }, 70);
        const result = applyBlockModifiers(helper, { priority: 3 });
        expect(result.priority).toBe(2);
        expect(result.modifier).toContain('Sospecha de lesion maligna');
    });
});
