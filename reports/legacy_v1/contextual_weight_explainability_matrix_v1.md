# Matriz de Explicabilidad de Pesos Contextuales (Fase 13)

Esta matriz justifica los futuros multiplicadores de peso (Boosts) basándose en el **Lift Contextual (LC)** y la co-ocurrencia observada en 4,426 diagnósticos.

## 1. Clasificación de Boosters Contextuales

| Combinación (Rasgos) | Boost Propuesto | Razón Clínica (Teórica) | Base Estadística (LC Score) |
| :--- | :---: | :--- | :--- |
| **Comedón + Quiste** | **Extremo (x1.5)** | Patognomónico (Acné Profundo). | LC 13.96 |
| **Cupuliforme + Umbil.** | **Alto (x1.4)** | Patognomónico (Viral/Molusco). | LC 7.62 |
| **Vesícula + Zoster** | **Alto (x1.3)** | Patognomónico (Zoster). | Lift 4.58 |
| **Bula + Vesícula** | **Alto (x1.3)** | Define el clúster ampolloso. | LC 5.77 |
| **Vesícula + Palmas** | **Medio (x1.2)** | Diferencia Deshidrosis/Viral. | (Análisis de hábitat) |
| **Comedón + Pústula** | **Medio (x1.2)** | Refuerza Inflamatorio Agudo. | LC 3.34 |
| **Eritema + Escama** | **Mínimo (x1.1)** | Combinación de ruido común. | (Bajo valor diferencial) |

## 2. Efectos de Neutralización (Inhibición Contextual)
- **Umbral de Ruido**: Si una combinación posee un LC < 2.0, no debe generar boost; su peso final debe ser la suma simple de sus partes sin interacción.
- **Inhibición de Nódulo**: Si `nódulo` aparece junto con `umbilicación` o `vesícula`, se debe reducir el boost de `cutaneous__tumor_suspected` para evitar falsos positivos proliferativos ante cuadros netamente infecciosos.

## 3. Hoja de Ruta de Calibración Contextual (Fase 8)
1. **Fase A (Pares Críticos)**: Implementar multiplicadores para los 5 pares de mayor LC en el `differential_ranker.js`.
2. **Fase B (Topografía)**: Integrar modificadores según el hábitat (ej. Vesícula + Palmas = +20% Eczema, -20% Viral).
3. **Fase C (Inhibición)**: Implementar reglas de freno para evitar que el ruido combinado (ej. Eritema + Pápula) active alarmas de prioridad innecesarias.
