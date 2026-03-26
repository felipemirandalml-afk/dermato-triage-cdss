# Jerarquía de Señales de Recalibración (Fase 15)

Esta política define cómo el motor CDSS prioriza los hallazgos para evitar el doble conteo y asegurar que los patrones fuertes dominen sobre el ruido.

## 1. Niveles de Precedencia (Moduladores)

| Nivel | Tipo de Señal | Multiplicador Propuesto | Razón de Peso |
| :--- | :--- | :---: | :--- |
| **P1** | **Safety Shields (Manual)** | **Nudge Forzado (P1/P2)** | Garantía de Triage (Manual). |
| **L3** | **Gestalts Fuertes (Tríadas)** | **Boost x1.8 - x2.0** | Alta ganancia incremental (Gestalt). |
| **L2** | **Anclas Combinadas (Pares)** | **Boost x1.3 - x1.5** | Lift contextual alto (Señal-Contexto). |
| **L1** | **Anclas Aisladas (Rasgos)** | **Peso Base x1.0 (Máx)** | Alta especificidad (Patognomónico). |
| **L0** | **Features de Ruido (Base)** | **Inhibición x0.1 - x0.3** | Hallazgos ubicuos (Dermatosis Genérica). |

## 2. Política Anti-Doble Conteo (Rule of Dominance)
1. **Dominancia de Tríada**: Si se detecta una tríada de Gestalt (ej. Acneiforme), se aplica el boost de L3 y **se omite** el boost de sus pares individuales (L2) para evitar una inflación artificial del score.
2. **Dominancia de Par**: Si no hay tríada pero hay un par fuerte (ej. Vesícula + Zoster), se aplica L2 y se suma el peso base de L1.
3. **Inhibición de Ruido**: Si una feature L0 (Eritema) aparece sin moduladores de L2 o L3, su peso final debe ser reducido en un 80% respecto a su valor nominal.

## 3. Resolución de Conflictos
Si un paciente presenta un **Gestalt Viral** y un **Gestalt Acneiforme** simultáneamente:
- El sistema debe reportar un **"High Uncertainty Cluster"**.
- El **Differential Ranker** debe mostrar ambos grupos en el Top 3, pero priorizando el que tenga menor ruido (menor cantidad de features L0 desatendidas).

## 4. Conclusión
Esta jerarquía asegura que los **patrones de libro de texto (Gestalts)** siempre superen al ruido estadístico común en la práctica dermatológica.
