# Análisis de Plateau y Retorno Marginal v2.0 (Phase 20 v2)

Este reporte evalúa la efectividad del escalamiento masivo del fitting estadístico en DermatoTriage CDSS.

## 1. Comparativa de Escala (v1 vs v2)

| Métrica | Fase 20 v1 (30k) | Fase 20 v2 (80k) | Delta |
| :--- | :---: | :---: | :---: |
| **Acc. Sindrómica Global (Easy)** | 12.7% | 54.5%* | **+41.8%** |
| **Acc. Sindrómica (Holdout 80k)** | N/A | 15.2% | - |
| **Recall Viral (Easy)** | 0.0% | 2.4% | +2.4% |
| **Recall Bacteriano (Easy)** | 0.0% | 93.3% | +93.3% |

*Nota: La mejora masiva se debe a la **Corrección NIR (v21)** integrada, no directamente al aumento de N.*

## 2. El Hallazgo del Plateau
Se ha observado que los pesos basales y moduladores contextuales **no variaron significativamente** entre el entrenamiento de 30k y 80k.
- La precisión en el set de fitting se estancó en **15.2%**.
- Los boosters contextuales no logran mover el "Top 1" cuando la probabilidad basal del modelo LR sigue estando fuertemente sesgada a pesar del NIR.

## 3. Retorno Marginal Nulo
El esfuerzo de computación y generación de 80,000 casos ha demostrado que el motor ha alcanzado su **Límite Estructural Actual**.
- El volumen adicional no está descubriendo nuevos patrones que los 30k casos ya conocieran.
- La confusión sindrómica residual (especialmente Eczema y Fúngico) es insensible a incrementos de peso lineales.

## 4. Conclusión
Hemos alcanzado el **techo metabólico** del motor de recalibración actual. Seguir aumentando N es ineficiente. La siguiente frontera de mejora no es el volumen, sino la **Estructura de la Función de Probabilidad** o la **Intervención directa de los Logits del Modelo Basal**.
