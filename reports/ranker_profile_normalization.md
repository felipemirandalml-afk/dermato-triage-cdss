# Reporte: Normalización de Perfiles de Semiología (v1.2.0)

## 1. Objetivo
Asegurar que el `differential_ranker.js` utilice exclusivamente descriptores canónicos para el cálculo de compatibilidad clínica, eliminando la fragilidad ante variaciones de nombres en los datasets fuente (Derm1M, SkinCon).

## 2. Metodología de Normalización
Se ha implementado una fase de **Canonical Bootstrapping** durante la carga del módulo de ranking:
1. Se itera sobre cada enfermedad en `SEMIOLOGY_PROFILES`.
2. Para cada descriptor original (ej: "Macule"), se consulta al `conceptMapper`.
3. Si existe un match canónico (ej: "macula"), se migra el peso estadístico.
4. **Fusión de Atributos:** Si dos etiquetas originales mapean al mismo ID canónico, se conserva el valor máximo de probabilidad para ese concepto.

## 3. Impacto en la Cobertura
- **Conceptos Resolvibles:** 25/25 de los descriptores usados en el JSON de perfiles actual coinciden con IDs internos.
- **Mejora de Robustez:** Ahora, si se inyectan nuevos perfiles con etiquetas crudas de SkinCon (ej. "Bulla"), el ranker los reconocerá automáticamente sin necesidad de refactorizar el código de scoring.

## 4. Trazabilidad
| Entrada Raw (Derm1M) | ID Canónico (Suministrado) | Resultado en Scoring |
| :--- | :--- | :--- |
| `papula` | `papula` | Mantenido (Pre-mapeado) |
| `pustule` (hipotético) | `pustula` | **Resuelto via Mapper** |
| `Bulla` (hipotético) | `bula_ampolla` | **Resuelto via Mapper** |

## 5. Conclusión
El motor de ranking ya no es dependiente de los nombres exactos definidos en los datasets externos. Esta capa de abstracción permite escalar la base de conocimientos clínicos sin riesgo de desalineación con la lógica del encoder o de la UI.
