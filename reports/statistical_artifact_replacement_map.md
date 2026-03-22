# Mapa de Reemplazo de Artefactos: v1 (Legacy) -> v2 (Active)

Este mapa facilita la transición del motor clínico de DermatoTriage CDSS desde la evidencia v1 (contaminada) hacia la v2 (re-normalizada por RPR).

| Artefacto v1 (Legacy) | Artefacto v2 (Active) | Motivo del Reemplazo | Estado de Migración |
| :--- | :--- | :--- | :---: |
| `feature_discriminative_scores.json` | `feature_discriminative_scores_v2.json` | Sesgo de volumen de 'Other' en v1. | **COMPLETO** |
| `feature_pair_scores.json` | `feature_pair_scores_v2.json` | Normalización RPR en v2. | **COMPLETO** |
| `feature_triplet_scores.json` | `feature_triplet_scores_v2.json` | Normalización de Gestalts en v2. | **COMPLETO** |
| `syndrome_boosters.json` | `syndrome_boosters_v2.json` | El boost v1 era ciego al tamaño sindrómico. | **COMPLETO** |
| `contextual_pair_modulators.json` | `contextual_pair_modulators_v2.json` | Alineación con evidencia v2 corregida. | **COMPLETO** |
| `syndromic_confusion_matrix.json` | `syndromic_confusion_matrix_v2.json` | Auditoría de impacto de normalización. | **COMPLETO** |

## Recomendación de Uso
**DEPRECATED**: No se debe volver a utilizar ningún artefacto v1 para alimentar lógica diagnóstica. Los archivos v1 solo se conservan para auditoría forense de "Before/After" en la carpeta `/legacy_v1/`.

**ACTIVE**: Toda nueva recalibración o prueba de benchmarking debe consumir estrictamente los archivos v2, que están normalizados por población sindrómica relativa.
