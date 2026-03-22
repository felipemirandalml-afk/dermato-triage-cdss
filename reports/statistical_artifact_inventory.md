# Inventario de Artefactos Estadísticos (Fase 18)

Este documento cataloga el estado actual de los activos de datos y reportes de DermatoTriage CDSS tras la re-normalización sindrómica.

## 1. Artefactos de Datos (JSON)

| Archivo | Versión | Estado | Finalidad |
| :--- | :---: | :---: | :--- |
| `feature_discriminative_scores_v2.json` | **Active_v2** | ACTIVO | Scores de DP basados en RPR normalizado. |
| `feature_pair_scores_v2.json` | **Active_v2** | ACTIVO | Scores de co-ocurrencia normalizados. |
| `feature_triplet_scores_v2.json` | **Active_v2** | ACTIVO | Tríadas y Gestalts normalizados. |
| `statistical_base_weights_v2.json` | **Active_v2** | ACTIVO | Alimenta el motor de recalibración (pesos). |
| `contextual_pair_modulators_v2.json` | **Active_v2** | ACTIVO | Modificadores del ranker diferencial. |
| `syndrome_boosters_v2.json` | **Active_v2** | ACTIVO | Boosters para refinamiento sindrómico. |
| `syndromic_confusion_matrix_v2.json` | **Audit_v2** | ACTIVO | Resultado de auditoría post-normalización. |
| `legacy_v1/*_v1.json` | **Legacy_v1** | ARCHIVADO | Datos contaminados por sesgo de volumen. |

## 2. Reportes y Análisis (MD)

| Archivo | Versión | Estado | Notas |
| :--- | :---: | :---: | :--- |
| `syndromic_renormalization_methodology.md`| v2 | VIGENTE | Metodología RPR. |
| `syndromic_renormalization_before_after.md`| v2 | VIGENTE | Evidencia de fragmentación del Black Hole. |
| `syndromic_confusion_analysis_v2.md` | v2 | VIGENTE | Análisis de la nueva matriz de confusión. |
| `legacy_v1/*_v1.md` | v1 | ARCHIVADO | Análisis previos invalidados por sesgo. |

## 3. Conclusión de Inventario
El repositorio está **libre de ambigüedad**. Todos los archivos principales en `data/` y `reports/` son de la versión **Beta v2 (Normalizada)**. Los activos contaminados han sido encapsulados en el directorio `/legacy_v1/`.
