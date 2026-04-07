# ⚖️ Auditoría Técnica: DermatoTriage CDSS (v1.5.1)

Este documento presenta una evaluación técnica objetiva del estado actual del repositorio, su arquitectura neuro-simbólica y las limitaciones identificadas durante el ciclo de soporte 1.5.x.

---

## 1. Arquitectura del Sistema: Inferencia Híbrida

El sistema implementa un modelo de soporte de decisión clínica (CDSS) basado en una arquitectura desacoplada que separa la recolección de datos, la normalización semántica y la inferencia probabilística.

### Componentes Core (Engine):
*   **Normalización (`concept_mapper.js`)**: Capa de resolución de conceptos (fuzzy matching) que garantiza la interoperabilidad entre el lenguaje clínico libre y los ID canónicos.
*   **Inferencia Probabilística (`model.js`, `probabilistic_model.js`)**: Ejecuta un clasificador Random Forest (vía `rf_model.json`) sobre un vector de 81 dimensiones.
*   **Reglas de Seguridad (`safety_modifiers.js`, `cardinal_feature_rules.js`)**: Capa determinística que sobreescribe o ajusta las prioridades de triage basándose en criterios médicos de alta especificidad (Red Flags).

---

## 2. Hallazgos y Deuda Técnica Identificada (Abril 2026)

Durante la reciente auditoría profunda, se detectaron y remediaron fallos estructurales que afectaban la integridad del análisis:

### 🛠️ Correcciones Críticas de Integridad (Fixed):
1.  **Bug de Regresión en Sexo**: El flujo de datos entre la UI y el Encoder presentaba un desajuste de contrato. El sexo del paciente (`sexo_male` / `sexo_female`) no se propagaba correctamente al motor heurístico.
2.  **Validación de UI Restrictiva**: La validación del formulario bloqueaba el análisis basándose en prefijos rígidos (`lesion_`, etc.), ignorando hallazgos válidos como topografías específicas (`cara_centro`, `fotoexpuesto`).
3.  **Fragmentación Semántica**: 49 dimensiones del modelo estaban incompletas en el mapeador canónico, causando una pérdida de señal clínica en síntomas basales como "dolor" o "fiebre".

### ⚠️ Deuda Técnica Pendiente:
*   **Dependencia Externa (Red)**: La aplicación carga recursos de diseño (Tailwind CSS) y tipografía (Google Fonts) desde CDNs externos. Esto compromete la robustez en entornos clínicos con conectividad restringida.
*   **Monolitismo en Front-End**: El archivo `index.html` (>100KB) y `ui.js` concentran demasiadas responsabilidades (Navegación, Captura, Validación, Renderizado y Exportación), lo que eleva el riesgo de regresiones colaterales al escalar funciones.
*   **Pesos Estadísticos Fijos**: Las recalibraciones de biased-classes en `recalibration_engine.js` dependen de archivos JSON estáticos generados externamente, lo que dificulta ajustes dinámicos sin una nueva fase de entrenamiento.

---

## 💡 Conclusión del Estado Actual

La integridad del motor clínico se encuentra en un estado **estabilizado y verificado** tras la Fase 15 de remediación semántica. No obstante, la arquitectura de presentación (UI/UX) ha alcanzado su límite de escalabilidad razonable bajo el paradigma de Single-file Vanilla JS. 

**Recomendación Operativa**: Mantener la rama principal como referencia estática y migrar la capa de presentación hacia un entorno modular (React/Vite) para mitigar los riesgos de mantenibilidad identificados.
