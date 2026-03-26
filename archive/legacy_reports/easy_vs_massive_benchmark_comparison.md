# Comparativa Estratégica: Test de Techo (Phase 11)

Esta comparativa analiza la diferencia de rendimiento entre un entorno clínico "puro" (Easy Benchmark) y un entorno clínico "ruidoso" (Massive Benchmark v2 - Phase 10).

## 1. Métricas de Rendimiento (Delta)

| Métrica | Easy (Puro) | Massive (Ruido) | Delta (Degradación) |
| :--- | :---: | :---: | :---: |
| **Precisión Prioridad** | **86.3%** | 64.0% | **-22.3%** |
| **Precisión Síndrome** | **55.2%** | 35.4% | **-19.8%** |

## 2. Análisis del "Techo Real"
- **Prioridad Triage**: El sistema es intrínsecamente capaz de priorizar correctamente. Una precisión cercana al 90% en casos fáciles demuestra que las reglas heurísticas son correctas. La caída masiva ante ruido indica una falta de **Inhibición de Escudo de Seguridad** (el sistema "entra en pánico" con facilidad).
- **Diagnóstico de Síndrome**: El techo de 55% es preocupante. Significa que, incluso con descripciones perfectas, el motor probabilístico solo identifica el síndrome correcto en poco más de la mitad de los casos. Esto sugiere que los **coeficientes están demasiado uniformados** y no logran capturar la distinción diagnóstica de forma nítida.

## 3. Comportamiento por Grupo Clínico (Inferencia del Runner)
- **Tumores**: El sistema los detecta bien si se describe el nódulo y se asocia la cronicidad.
- **Inflamatorio**: Aquí es donde colapsa. El "ruido basura" (eritema/escama) está tan presente en el modelo que el sistema tiende a clasificar todo caso inflamatorio bajo la categoría genérica `inflammatory_dermatosis_other` en lugar de `eczema_dermatitis`.

## 4. Conclusión Estratégica
Confirmamos la **Hipótesis A+C**:
- El problema de la **prioridad** es puramente de **calibración ante ruido** (fáciles de arreglar con reglas de exclusión).
- El problema del **síndrome** es **basal** (calidad de los pesos estadísticos en el modelo de regresión). El CDSS es "clínicamente miope" incluso con lentes de 0.50 dioptrías (casos easy).
