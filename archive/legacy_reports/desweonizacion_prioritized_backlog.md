# Backlog Priorizado de Des-weonización (Fase 9)

A partir de los hallazgos sistémicos del Stress Test Sintético (192 casos), se priorizan las siguientes intervenciones:

## 1. Prioridad Crítica (P1-Fix)
- **Problema**: Falso positivo masivo de Infección Bacteriana en Herpes Zóster por concurrencia de `dolor + fiebre`.
- **Intervención**: Modificar `model.js` para añadir una **Excepción Viral Segura**. Si el patrón es `zosteriforme` o hay `vesículas agrupadas`, el sistema no debe escalar a P1 automáticamente por dolor en el tronco si no hay compromiso ocular o shock.
- **Capa**: `model.js` / logic shields.

## 2. Refinamiento en Síndromes (IE-Improvement)
- **Problema**: Inercia hacia `inflammatory_dermatosis_other` en cuadros de Eczema y Psoriasis.
- **Intervención**: Aumentar los coeficientes del modelo para `liquenificacion`, `escama nacarada` y `flexural`.
- **Capa**: `engine/model_coefficients.json` (requiere recalibración).

## 3. Resolución de Ambigüedad en Tumores
- **Problema**: Confusión benigno/maligno en nódulos amelanóticos.
- **Intervención**: Endurecer las reglas cardinales en `cardinal_feature_rules.js` para penalizar `benign_cutaneous_tumor` ante la presencia de `crecimiento_rapido` (que debe mapearse desde la UI).
- **Capa**: Cardinal Rule Engine.

## 4. Mitigación de Fragilidad en Entradas Escasas (Sparse)
- **Problema**: El CDSS falla si el usuario solo marca un descriptor.
- **Intervención**: Implementar un sistema de **"Inferencia por Vecindad"** que proponga al usuario completar descriptores faltantes de alta frecuencia en el perfil más cercano.
- **Capa**: `ui.js` / Frontend Logic.

---

# Limitaciones Metodológicas (Fase 9)

- **Simulación vs Realidad**: Los casos sintéticos se basan en una distribución teórica idealizada. En la práctica real, los usuarios suelen reportar hallazgos "incorrectos" (ej: llamar pústula a una vesícula erosiva), lo que no se ha simulado en este benchmark.
- **Ausencia de Dinámicas Progresivas**: El benchmark es estático. No detecta fallos en el razonamiento temporal (ej. pródromos).
- **Interpretación del Fracaso**: Un 27% de precisión sindrómica en el benchmark masivo NO significa que la app sea inútil; significa que es **altamente sensible al ruido** y requiere que el input clínico sea preciso para funcionar fuera de sus "zonas de confort" heurísticas.
