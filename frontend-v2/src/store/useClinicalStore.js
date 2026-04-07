import { create } from 'zustand';
import { conceptMapper } from '../engine/concept_mapper.js';

export const useClinicalStore = create((set, get) => ({
  // 1. EL ALMACÉN DE DATOS MÉDICOS (Memoria Global)
  formData: {
    age: '',
    sex: '',
    timing: '',
    // Las variables dinámicas (lesion_papula, etc) vivirán también aquí.
  },
  
  // Memoria del resultado del Triaje
  triageResult: null,

  // 2. LAS ACCIONES (Los músculos que cambian los datos)
  
  // Acción para actualizar inputs básicos
  setField: (field, value) => 
    set((state) => ({ 
      formData: { ...state.formData, [field]: value } 
    })),

  // Acción tipo 'Switch' elegante para checkboxes clínicos
  toggleFeature: (featureId) => 
    set((state) => {
      const currentData = { ...state.formData };
      if (currentData[featureId]) {
        delete currentData[featureId]; // Si existe, lo borramos (Desactivar)
      } else {
        currentData[featureId] = true; // Si no, lo agregamos (Activar)
      }
      return { formData: currentData };
    }),

  // Acción de reseteo para limpiar el paciente actual
  resetForm: () => 
    set({
      formData: { age: '', sex: '', timing: '' },
      triageResult: null
    }),
    
  // Capacidad de cargar pacientes de prueba
  loadDemoCase: (caseInput) => 
    set({
      formData: {
        age: caseInput.age || '',
        sex: caseInput.sex || '',
        timing: caseInput.timing || '',
        ...caseInput // Despliega todos los checkboxes de la demo (fiebre: true, etc)
      },
      triageResult: null
    }),

  // Almacenar el análisis probabilístico / heurístico final
  setTriageResult: (result) => set({ triageResult: result }),

  // 3. COMPUTACIÓN / INTELIGENCIA DERIVADA
  
  // Validador Médico Inteligente: Nos avisa en tiempo real si el médico 
  // ya ingresó suficientes datos técnicos como para poder diagnosticar.
  getValidationStatus: () => {
    const { formData } = get();
    
    // Reglas Basales Hardcodeables
    const hasAge = !!formData.age;
    const hasTiming = !!formData.timing;
    
    // Regla de Resolución de SSoT: Verificamos si al menos una key en el form
    // existe como concepto clínico real en nuestro concept_canonical_map
    const clinicalKeys = Object.keys(formData).filter(k => k !== 'age' && k !== 'sex' && k !== 'timing' && formData[k] === true);
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
