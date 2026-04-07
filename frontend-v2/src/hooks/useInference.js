import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useClinicalStore } from '../store/useClinicalStore';
import { runTriage } from '../engine/model.js';

export const useInference = () => {
  const { i18n } = useTranslation();
  const formData = useClinicalStore(state => state.formData);
  const setTriageResult = useClinicalStore(state => state.setTriageResult);

  const processPatient = useCallback(() => {
    // 🛡️ El motor ahora comprende la arquitectura segmentada (v2.1)
    console.log("🔍 [Clínica Virtual] Enviando paciente al motor de inferencia:", formData);

    try {
      // 2. Encendido del Motor Clínico que importamos de Vainilla
      const result = runTriage(formData, i18n.language);
      
      console.log("✅ [Orquestador] Predicción matemática completada:", result);

      // 3. Guardamos el resultado en la memoria global para que la UI reaccione
      setTriageResult(result);
      
      return result;
    } catch (error) {
      console.error("🔥 Error crítico en el motor de triaje:", error);
      return null;
    }
  }, [formData, setTriageResult]);

  return { processPatient };
};
