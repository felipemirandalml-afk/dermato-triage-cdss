import { useCallback } from 'react';
import { useClinicalStore } from '../store/useClinicalStore';
import { runTriage } from '../engine/model.js';

export const useInference = () => {
  const formData = useClinicalStore(state => state.formData);
  const setTriageResult = useClinicalStore(state => state.setTriageResult);

  const processPatient = useCallback(() => {
    // 1. Recogemos la memoria fotográfica de Zustand
    // (Limpiando basuras internas si las hubiera, aunque Zustand es muy limpio)
    const rawData = { ...formData };

    console.log("🔍 [Clínica Virtual] Enviando paciente al motor de inferencia:", rawData);

    try {
      // 2. Encendido del Motor Clínico que importamos de Vainilla
      const result = runTriage(rawData);
      
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
