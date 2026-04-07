/**
 * validation.js - Servicio de Validación Clínica
 * Centraliza las reglas de integridad de datos antes de la inferencia.
 */

import conceptMapper from './concept_mapper.js';

export const clinicalValidation = {
  /**
   * Valida si los datos del formulario son suficientes para un triaje seguro.
   */
  validateFormData(formData) {
    const hasAge = !!formData.age && !isNaN(formData.age) && formData.age > 0;
    const hasTiming = !!formData.timing;
    
    // Validar presencia de al menos un hallazgo clínico reconocido
    const features = formData.features || {};
    const clinicalKeys = Object.keys(features).filter(k => features[k] === true);
    
    // Resolvemos las claves para asegurar que el motor las entiende
    const validFeatures = clinicalKeys.filter(key => conceptMapper.resolve(key) !== null);
    const hasValidFeature = validFeatures.length > 0;

    const missing = {
      age: !hasAge,
      timing: !hasTiming,
      features: !hasValidFeature
    };

    return {
      isValid: hasAge && hasTiming && hasValidFeature,
      missing,
      summary: `Validación: Edad(${hasAge}), Timing(${hasTiming}), Features(${validFeatures.length})`
    };
  }
};
