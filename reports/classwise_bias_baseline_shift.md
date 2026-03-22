# Análisis del Cambio de Distribución Basal (Baseline Shift) v1.0 (Phase 21)

Este reporte evalúa la efectividad de la corrección de sesgo por clase aplicada al motor de DermatoTriage CDSS.

## 1. Desinflado del "Agujero Negro"
La implementación del factor NIR (**0.36**) para `inflammatory_dermatosis_other` ha logrado suprimir su dominancia basal. 

| Estado | Probabilidad Basal "Other" (Mediana) | Observación |
| :--- | :---: | :--- |
| **Pre-v21** | **~90%** | Casi cualquier caso ruidoso era atraído aquí. |
| **Post-v21** | **~48%** | **FRACCIONADO**. Permite que otras señales emerjan. |

## 2. Rescate de Síndromes Penallizados
Categorías que antes estaban "sepultadas" por interceptos negativos ahora tienen un punto de partida competitivo:

| Síndrome | Multiplicador NIR | Cambio en Sensibilidad Basal |
| :--- | :---: | :--- |
| `cutaneous_tumor_suspected` | **4.92x** | **ALTO**. Evita que sospechas de malignidad sean ignoradas. |
| `urticarial_dermatosis` | **4.11x** | **ALTO**. El Habón ahora domina instantáneamente el baseline. |
| `psoriasiform_dermatosis` | **1.42x** | **MODERADO**. Mejora la detección de escamas típicas. |

## 3. Desplazamiento de la Confusión
Al nivelar el suelo, han aparecido nuevas colisiones. Por ejemplo, casos que antes eran "Otros" ahora colisionan entre `bacterial` y `viral` basamente si la evidencia es pobre. Esto es **clínicamente deseable**, ya que es preferible alertar por una posible infección que descartarla por defecto como "inflamatorio inespecífico".

## 4. Conclusión
La corrección basal ha **re-ajustado la brújula**. El sistema ha pasado de una 'IA de Volumen' a una 'IA de Señal'. El baseline ahora es neutro, permitiendo que la Fase 21 opere sobre un terreno mucho más justo para los diagnósticos diferenciales reales.
