import { create } from 'zustand';
import { clinicalValidation } from '../engine/validation.js';

export const useClinicalStore = create((set, get) => ({
  // 1. EL ALMACÉN DE DATOS MÉDICOS (Memoria Global)
  formData: {
    // Metadatos del Paciente (Shape Fijo)
    age: '',
    sex: '',
    timing: '',
    // Tratamiento previo (refractariedad) — disparador de derivación más frecuente
    // en el protocolo SSMSO. received: 'yes'|'no'|''; response: 'none'|'partial'|
    // 'worsening'|'good'|''; months: 'lt1'|'1to3'|'3to6'|'gt6'|''
    treatment: { received: '', response: '', months: '' },
    // Severidad / extensión (Capa 1 del triage SSMSO). bsaPercent: % de superficie
    // corporal comprometida (regla de la palma ≈ 1%). Umbrales: psoriasis >7%, atópica >10%.
    severity: { bsaPercent: '' },
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
      formData: { age: '', sex: '', timing: '', treatment: { received: '', response: '', months: '' }, severity: { bsaPercent: '' }, features: {} },
      triageResult: null
    }),

  // Actualiza un campo del sub-objeto de tratamiento previo
  setTreatmentField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, treatment: { ...state.formData.treatment, [field]: value } }
    })),

  // Actualiza un campo del sub-objeto de severidad / extensión
  setSeverityField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, severity: { ...state.formData.severity, [field]: value } }
    })),

  // Carga de casos demo con soporte para la nueva estructura
  loadDemoCase: (caseInput) => {
    const { age, sex, timing, treatment, severity, ...clinicalFeatures } = caseInput;
    set({
      formData: {
        age: age || '',
        sex: sex || '',
        timing: timing || '',
        treatment: treatment || { received: '', response: '', months: '' },
        severity: severity || { bsaPercent: '' },
        features: clinicalFeatures || {}
      },
      triageResult: null
    });
  },

  setTriageResult: (result) => set({ triageResult: result }),

  // 3. COMPUTACIÓN / INTELIGENCIA DERIVADA (Vía Engine Service)
  getValidationStatus: () => {
    const { formData } = get();
    return clinicalValidation.validateFormData(formData);
  }
}));
