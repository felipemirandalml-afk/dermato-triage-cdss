import { useState, useCallback } from 'react';
import { useClinicalStore } from '../store/useClinicalStore';
import { useInference } from './useInference';
import { UI_LABELS } from '../constants/labels';

/**
 * useTriageFlow - Hook de Orquestación Clínica
 * Centraliza la lógica de navegación, validación y ejecución del triaje.
 */
export const useTriageFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const { processPatient } = useInference();
  const resetStore = useClinicalStore(state => state.resetForm);
  const getValidation = useClinicalStore(state => state.getValidationStatus);
  
  const steps = UI_LABELS.STEPS;

  const handleNext = useCallback(() => {
    setError(null);
    
    // Al llegar al final de la recopilación de datos (Paso 2)
    if (currentStep === 2) {
      // 🛡️ Validación Clínica Pre-Inferencia (Declarativa vía Store)
      const status = getValidation();
      
      if (!status.isValid) {
        setError(status.missing);
        return; // Bloquear avance
      }
      
      // Si es válido, disparamos el motor
      processPatient();
      setCurrentStep(3);
    } else {
      setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
    }
  }, [currentStep, getValidation, processPatient, steps.length]);

  const handleBack = useCallback(() => {
    setError(null);
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const handleReset = useCallback(() => {
    resetStore(); // Limpieza del estado global clínico
    setError(null);
    setCurrentStep(0);
  }, [resetStore]);

  return {
    currentStep,
    steps,
    error,
    handleNext,
    handleBack,
    handleReset
  };
};
