# Reporte: Riesgo Semántico y Conceptos Pendientes del Ranker

## 1. Mapa de Calor de Desatención
Este reporte identifica conceptos valiosos presentes en los datasets fuente (`SkinCon`) que el ranker todavía no puede "valorizar" porque no están presentes en los perfiles agregados (`semiology_profiles.json`).

| Concepto SkinCon | Estado en Mapper | Riesgo Semántico | Prioridad de Acción |
| :--- | :--- | :--- | :---: |
| `Dome-shaped` | ✅ Resuelto | El ranker no lo usa en perfiles. | **Media** (Moluscos) |
| `Telangiectasia` | ✅ Resuelto | Uso inconsistente en perfiles. | **Alta** (Rosácea/BCC) |
| `Black` (Color) | ⚠️ Parcial | Riesgo de sesgo por fototipo. | **Crítica** (Melanoma) |
| `Abscess` | ⚠️ Parcial | Confusión técnica entre tumor/absceso. | **Baja** |

## 2. Clasificación de Brechas (Gaps)

### A. Missing Canonical Mapping (0 items)
El 100% de los descriptores activos en el ranker actual tienen un gemelo canónico. No hay "fugas de score" detectadas.

### B. Concept Available but Not Scored (20+ items)
Existen conceptos como `fisura`, `escara` y `esclerosis` que ya están en el **Mapa Canónico** y en la **UI**, pero cuyas frecuencias estadísticas en `semiology_profiles.json` son 0 o nulas para la mayoría de las enfermedades. 
- **Riesgo:** El ranker es "demasiado simplista" comparado con la riqueza de la UI.

### C. Low-Confidence Mapping
El mapeo de `Black` de SkinCon a `hiperpigmentacion` es una simplificación necesaria pero arriesgada. En fototipos VI, "Negro" puede ser el color base, no una señal patológica.

## 3. Recomendaciones para la Siguiente Fase
1. **Inyección de SkinCon:** Re-generar `semiology_profiles.json` incorporando las 87 columnas de SkinCon.
2. **Scoring Diferenciado por Color:** Ajustar los pesos de `eritema` y `hiperpigmentacion` dinámicamente según el fototipo ingresado para evitar penalizaciones injustas.

---
**Auditoría de Riesgo Semántico v1.2.0**
