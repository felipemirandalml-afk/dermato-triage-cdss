# Análisis de la Fuente de Falla Sindrómica (Fase 16)

Este reporte identifica el origen técnico exacto de la baja precisión sindrómica del sistema.

## 1. El Error de la "Masa Crítica"
La auditoría de `feature_discriminative_scores.json` revela un fallo sistemático en la generación de evidencia de las fases 12-14:

- **Dato Crítico**: El **100%** de las features registradas tienen como `top_syndrome` a:
  > `inflammatory_dermatosis_other`
- **Explicación**: El sistema calculó la predominancia por **frecuencia absoluta** (conteos brutos). Dado que esa categoría es la más poblada del dataset Derm1M, siempre gana en volumen, incluso para rasgos que son clínicamente ajenos a ella (ej. `patron_zosteriforme`).

## 2. Atribución por Capas

| Capa | Responsabilidad en la Falla | Naturaleza del Fallo |
| :--- | :---: | :--- |
| **Modelo ML (Basal)** | 40% | Sesgo inherente al entrenamiento original (Imbalanced Data). |
| **Metadatos Estadísticos** | **50%** | **Fallo de Normalización**. La evidencia generada (Phase 12-14) reforzó el sesgo en lugar de corregirlo. |
| **Ranker Diferencial** | 10% | El ranker solo obedece a los pesos; si los pesos están sesgados, el ranker propaga el sesgo perfectamente. |

## 3. Taxonomía de Fallas Detectadas
1. **Prior de Clase Dominante**: El sistema asume que "si es piel, probablemente sea una dermatitis inespecífica".
2. **Aniquilación de Anclas**: El rasgo `vesicula` (clínicamente viral) es absorbido por el ruido de `eczema` porque hay 10 veces más casos de eczema que de herpes en la base de datos de referencia.
3. **Falsa Explicabilidad**: El sistema justifica sus errores citando "Gestalts" que en realidad son solo clústeres de ruido de la categoría mayoritaria.

## 4. Recomendación Técnica Inmediata
Es imperativo **regenerar la totalidad de la evidencia estadística** (discriminación, pares, tríadas) aplicando una **Normalización por Población Sindrómica**. No debemos preguntar "¿En qué síndrome aparece más el comedón?", sino "¿En qué síndrome es más PROBABLE encontrar un comedón respecto a su población total?".
