# Plan de Parametrización y Optimización v20 (Phase 20)

Este documento detalla los parámetros que serán ajustados durante la fase de **Auto-calibración Estadística** de DermatoTriage CDSS.

## 1. Parámetros de Ajuste

| Bloque | Parámetro | Rango Inicial | Descripción |
| :--- | :--- | :---: | :--- |
| **A: Basal** | `base_weight` | [0.0 - 1.0] | Peso individual de cada rasgo según su RPR normalizado. |
| **B: Ruido** | `noise_brake` | [0.1 - 0.9] | Factor de atenuación para rasgos ubicuos (Eritema, Escama inespecífica). |
| **C: Pares** | `pair_mod_intensity` | [1.0 - 2.5] | Multiplicador de probabilidad para duplas clínicas sinérgicas. |
| **D: Gestalt** | `triplet_boost_cap` | [0.2 - 0.7] | Techo máximo de incremento para tríadas de alta especificidad. |

## 2. Mecanismos de Control
- **Damping**: Los cambios en pesos basales se suavizarán para evitar oscilaciones.
- **Saturación**: Ningún boost individual o combinado podrá llevar la probabilidad a > 1.0 artificialmente si no hay anclas.
- **Redundancia**: Se aplicará una penalización si múltiples anclas del mismo síndrome aparecen, para evitar sobre-excitación del modelo.

## 3. Función Objetivo (J)
$$J = 0.4 \cdot \text{Acc}_{\text{Synd}} + 0.4 \cdot \text{Recall}_{\text{Crit}} + 0.2 \cdot \text{Acc}_{\text{Triage}} - 0.1 \cdot \text{CrossEntropy}$$

- **Recall_Crit**: Focalizado en Infecciones Virales/Bacterianas y Tumores.
- **Acc_Triage**: Penalización máxima si un caso P1 es degradado a P3.
