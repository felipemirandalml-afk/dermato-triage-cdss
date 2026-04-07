import { create } from 'zustand';
import { conceptMapper } from '../engine/concept_mapper.js';

export const useClinicalStore = create((set, get) => ({
  // 1. EL ALMACÉN DE DATOS MÉDICOS (Memoria Global)
  formData: {
    // Metadatos del Paciente (Shape Fijo)
    age: '',
    sex: '',
    timing: '',
    // Hallazgos Clínicos (Frontera Semántica Limpia)
    features: {} 
  },
  
  // Memoria del resultado del Triaje
  triageResult: null,

  // 2. LAS ACCIONES
  
  // Actualizar metadatos
  setField: (field, value) => 
    set((state) => ({ 
      formData: { ...state.formData, [field]: value } 
    })),

  // Switch para hallazgos clínicos dento del sub-objeto features
  toggleFeature: (featureId) => 
    set((state) => {
      const newFeatures = { ...state.formData.features };
      if (newFeatures[featureId]) {
        delete newFeatures[featureId];
      } else {
        newFeatures[featureId] = true;
      }
      return { 
        formData: { ...state.formData, features: newFeatures } 
      };
    }),

  // Reseteo limpio
  resetForm: () => 
    set({
      formData: { age: '', sex: '', timing: '', features: {} },
      triageResult: null
    }),
    
  // Carga de casos demo con soporte para la nueva estructura
  loadDemoCase: (caseInput) => {
    const { age, sex, timing, ...clinicalFeatures } = caseInput;
    set({
      formData: {
        age: age || '',
        sex: sex || '',
        timing: timing || '',
        features: clinicalFeatures || {}
      },
      triageResult: null
    });
  },

  setTriageResult: (result) => set({ triageResult: result }),

  // 3. COMPUTACIÓN / INTELIGENCIA DERIVADA
  getValidationStatus: () => {
    const { formData } = get();
    
    const hasAge = !!formData.age;
    const hasTiming = !!formData.timing;
    
    // Ahora validamos solo contra el objeto de features
    const clinicalKeys = Object.keys(formData.features).filter(k => formData.features[k] === true);
    const hasValidFeature = clinicalKeys.some(key => conceptMapper.resolve(key) !== null);

    return {
      isValid: hasAge && hasTiming && hasValidFeature,
      missing: {
        age: !hasAge,
        timing: !hasTiming,
        features: !hasValidFeature
      }
    };
  }
}));
