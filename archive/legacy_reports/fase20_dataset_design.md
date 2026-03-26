# Diseño del Dataset de Calibración Estratégica v20 (Phase 20)

Este documento detalla la estructura del dataset de 30,000 casos utilizado para la Fase 20 de auto-calibración.

## 1. Composición y Metodología
Se han generado **30,000 casos sintéticos estructurados** derivados de los perfiles semiológicos v2 y combinados con la ontología canónica.

### A. Tipología de Casos
- **Textbook (50% - 15,000 casos)**: Casos "clásicos" con 4 rasgos principales del perfil. Objetivo: Asegurar que el sistema no falle lo obvio.
- **Sparse (25% - 7,500 casos)**: Casos incompletos con solo 1-2 rasgos. Objetivo: Evaluar la resiliencia ante la falta de información por parte del usuario.
- **Noisy (25% - 7,500 casos)**: Casos contaminados con 1-2 señales de ruido semiológico universal (eritema, prurito). Objetivo: Evaluar la robustez ante descriptores ubicuos.

## 2. Particionado de Datos
Se ha aplicado un particionado estanco para garantizar la integridad de la evaluación:

| Set | Tamaño | Finalidad |
| :--- | :---: | :--- |
| **Fitting Set** | 21,000 | Ajuste heurístico de pesos basales y boosters. |
| **Validation Set** | 4,500 | Ajuste de hiperparámetros de intensidad. |
| **Final Holdout** | 4,500 | Evaluación final de impacto no visto. |

## 3. Conclusión
El dataset cubre satisfactoriamente el espectro de variabilidad requerida para una primera auto-calibración v1, permitiendo que el motor aprenda la importancia relativa de las anclas clínicas frente al ruido de fondo.
