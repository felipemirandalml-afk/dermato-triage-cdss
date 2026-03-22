# Decisión Estratégica: Escalamiento a 80,000 Casos (Phase 20)

Este reporte detalla si es oportuno escalar la auto-calibración a un volumen masivo de 80,000 casos sintéticos tras concluir la fase inicial de 30,000.

## 1. Evaluación de Estabilidad (v1 - 30k)
- **Convergencia**: Se logró un incremento de precisión sindrómica del **12% al 22% (Global)** y del **12% al 24% (Casos Textbook)**.
- **Eficiencia**: 30,000 casos fueron suficientes para estabilizar los pesos basales de las features más discriminativas.
- **Limitación**: El modelo entró en un "plateau" (meseta) rápido.

## 2. El Bloqueador Fundamental
Se ha detectado que el problema no es la falta de volumen de datos de fitting, sino la **fuerza asimétrica del intercepto** (parámetros de sesgo) de la Regresión Logística original.
- El síndrome `inflammatory_dermatosis_other` posee un intercepto que domina la probabilidad basal.
- Los boosters estadísticos actúan sobre p(s), pero el sesgo basal los anula en casos con ruido.

## 3. Veredicto Final: POSTERGADO

**Decisión**: No escalar a 80k casos todavía.

### Razón:
La mejora incremental de exactitud se ha saturado. Agregar más datos de fitting en las mismas condiciones no superará el "ruido de fondo" del modelo probabilístico basal si no se interviene primero el balance de clases.

## 4. Hoja de Ruta Recomendada (v2)
1. **Normalización por Clases (Class-wise Logit Correction)**: Implementar un factor de penalización dinámico al entrenamiento basal para desinflar el síndrome "Otros".
2. **Refinar Modulantes**: Una vez nivelado el suelo del modelo, volver a correr el fitting sobre los 30k casos.
3. **Escalamiento (80k)**: Solo tras demostrar una precisión sindrómica > 60% en el fitting actual.

**Estado: Fase 20 finalizada con éxito metodológico, pero bloqueo técnico del modelo basal identificado.**
