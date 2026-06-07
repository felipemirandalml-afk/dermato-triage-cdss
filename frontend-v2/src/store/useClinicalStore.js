import { create } from 'zustand';
import { clinicalValidation } from '../engine/validation.js';

// Defaults centralizados de los sub-objetos estructurados (Capa 1 del triage SSMSO),
// para que initial / resetForm / loadDemoCase no se desincronicen.
// treatment: refractariedad (disparador de derivación más frecuente del protocolo).
const DEFAULT_TREATMENT = { received: '', response: '', months: '' };
// severity: extensión (bsaPercent, regla de la palma ≈ 1%; umbrales psoriasis >7%,
// atópica >10%) y sitios especiales que gatillan derivación/urgencia.
const DEFAULT_SEVERITY = { bsaPercent: '', specialSites: { periocular: false, anogenital: false, palmoplantar: false } };

const makeDefaultFormData = () => ({
  age: '',
  sex: '',
  timing: '',
  treatment: { ...DEFAULT_TREATMENT },
  severity: { ...DEFAULT_SEVERITY, specialSites: { ...DEFAULT_SEVERITY.specialSites } },
  features: {}
});

export const useClinicalStore = create((set, get) => ({
  // 1. EL ALMACÉN DE DATOS MÉDICOS (Memoria Global)
  formData: makeDefaultFormData(),
  
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
      formData: makeDefaultFormData(),
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

  // Alterna un sitio especial (severity.specialSites) — campo de triage/urgencia
  toggleSpecialSite: (site) =>
    set((state) => {
      const current = state.formData.severity.specialSites || {};
      return {
        formData: {
          ...state.formData,
          severity: { ...state.formData.severity, specialSites: { ...current, [site]: !current[site] } }
        }
      };
    }),

  // Carga de casos demo con soporte para la nueva estructura
  loadDemoCase: (caseInput) => {
    const { age, sex, timing, treatment, severity, ...clinicalFeatures } = caseInput;
    const base = makeDefaultFormData();
    set({
      formData: {
        ...base,
        age: age || '',
        sex: sex || '',
        timing: timing || '',
        treatment: treatment || base.treatment,
        severity: severity || base.severity,
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
