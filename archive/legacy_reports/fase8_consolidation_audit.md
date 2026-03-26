# Auditoría de Consolidación Multicapa: DermatoTriage v8.0

## 1. Mapeo de Fragilidad entre Capas

### A. Desacople Canónico vs Probabilístico (ML)
Existen conceptos "puente" que aún no están plenamente integrados en el `concept_canonical_map.json` a pesar de ser usados en reglas críticas:
- **`dermatomal`**: Usado por el modelo LR y la regla #27. El mapa canónico usa `zosteriforme`. Aunque el mapper resuelve, genera confusión semántica.
- **`extensor` / `flexural`**: Usados en reglas #85 y #164. No tienen entrada propia en el mapa canónico (están como features del vector X).
- **`signo_mucosas`**: Sobrevive como descriptor legacy de la UI y del orquestador. Debe normalizarse a `mucosas`.

### B. Inconsistencias en Topografía
- Se han consolidado alias en `constants.js` (ej: `tronco` -> `topog_tronco`), pero la UI (`index.html`) aún usa `topog_tronco`. 
- **Riesgo**: Si se cambia la UI a `tronco` sin actualizar el mapper, se rompe el vector probabilístico (Logistic Regression).

### C. Deuda de Reglas Cardinales (`cardinal_feature_rules.js`)
- **IDS redundantes**: `nodulo_perlado_telangiectasias` fue limpiado, pero el rationale de algunas reglas aún menciona "patron_acral" en el texto, aunque use `acral` en el código.
- **Booster de Síndromes**: Se añadieron `Syphilis` y `Scabies` al `syndrome_to_ontology_map.js` manualmente. Estos diagnósticos NO están en los perfiles `semiology_profiles.json` generados automáticamente por Derm1M, lo que crea una "asimetría de conocimiento" entre el Ranker y el Rule Engine.

## 2. Puntos Críticos de Hardening

| Componente | Riesgo Identificado | Acción Propuesta |
| :--- | :--- | :--- |
| `concept_mapper.js` | El stripping de prefijos (`topo_`, `lesion_`) es global. Podría causar colisiones si un ID legítimo empieza por esos caracteres. | Endurecer con whitelist o validación de ID canónico. |
| `feature_encoder.js` | Dependencia de `X[FEATURE_INDEX]` para lógica de reglas. | Migrar reglas a usar únicamente `featureMap` (ya iniciado en 7B). |
| `ui.js` | Mapeo directo de `featureMap` de la UI. | Centralizar la transformación en el encoder. |

## 3. Matriz de Conflictos de Alias

| Alias Legacy | Target Canónico | Estado Auditoría |
| :--- | :--- | :--- |
| `patron_acral` | `acral` | OK (Mapping activo) |
| `patron_lineal` | `patron_lineal` | **Inconsistente** (Usa prefijo en el ID canónico) |
| `patron_zosteriforme`| `zosteriforme` | OK |
| `patron_dermatomal` | `dermatomal` | **Conflicto** (Dualidad entre canonical/ML) |

## 4. Hallazgos en Datasets (Audit Inteligencia)
- **Scabies/Syphilis**: Al ser añadidos manualmente, no tienen pesos probabilísticos en `probabilistic_model.js`. Su preeminencia depende EXCLUSIVAMENTE de las reglas cardinales.
- **Riesgo**: Si un usuario no marca el "ancla" (surco, palmas/plantas), el sistema nunca propondrá estos diagnósticos.
