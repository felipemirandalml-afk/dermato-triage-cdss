import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useClinicalStore } from '../store/useClinicalStore';
import { runTriage } from '../engine/model.js';

export const useInference = () => {
  const { i18n } = useTranslation();
  const formData = useClinicalStore(state => state.formData);
  const setTriageResult = useClinicalStore(state => state.setTriageResult);

  const processPatient = useCallback(() => {
    try {
      const result = runTriage(formData, i18n.language);

      // Guardamos el resultado en el estado global para que la UI reaccione
      setTriageResult(result);

      return result;
    } catch (error) {
      console.error("Error crítico en el motor de triaje:", error);
      return null;
    }
  }, [formData, setTriageResult, i18n.language]);

  return { processPatient };
};
