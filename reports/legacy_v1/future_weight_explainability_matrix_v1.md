# Matriz de Explicabilidad de Pesos: Guía de Calibración (Fase 12)

Esta matriz justifica los pesos computacionales (coeficientes) basándose en la **Epidemiología Semiológica Interna (ESI)** del proyecto.

## 1. Clasificación de Pesos y Justificación

| Rasgo (Feature) | Peso Propuesto | Razón Clínica (Teórica) | Base Estadística (DP Score) |
| :--- | :---: | :--- | :--- |
| **Comedón** | **Extremo (x1.0)** | Patognomónico (Acné). | DP 0.909 |
| **Habón (Roncha)** | **Extremo (x0.9)** | Patognomónico (Urticaria). | DP 0.829 |
| **Púrpura** | **Alto (x0.8)** | Indica extravasación fija. | DP 0.743 |
| **Umbilicación** | **Alto (x0.8)** | Patognomónico (Viral/Molusco). | DP 0.744 |
| **Necrosis** | **Alto (x0.7)** | Indicador de gravedad P1. | DP 0.658 |
| **Escama** | **Medio (x0.4)** | Útil pero compartido (Inflam.). | DP 0.361 |
| **Ampolla** | **Medio (x0.4)** | Clúster Ampolloso/Infecto. | DP 0.485 |
| **Eritema** | **Mínimo (x0.1)** | Ruido ubicuo de fondo. | DP 0.000 |
| **Pápula** | **Mínimo (x0.1)** | Descriptor morfológico básico. | DP 0.065 |
| **Mancha** | **Mínimo (x0.1)** | Descriptor cromático común. | DP 0.333 |

## 2. Lógica de Combinación (Weights Boost)
- **Topografía + Ruido**: El **Eritema** en **Cuerpo (Tronco)** debe pesar poco. El **Eritema** en **Cara (Centro)** + **Comedón** debe ser casi determinístico para Inflamatorio.
- **Patrón + Elemental**: La **Vesícula** pura es inespecífica (DP 0.47). La **Vesícula** + **Zosteriforme** debe ser un "ancla" para Viral.

## 3. Hoja de Ruta de Calibración Estratégica
1. **Fase A (Inhibición)**: Reducir los coeficientes de los 5 descriptores de ruido en `model_coefficients.json`.
2. **Fase B (Refuerzo)**: Aumentar los coeficientes de las 5 "Anclas Absolutas".
3. **Fase C (Condicional)**: Implementar en `differential_ranker.js` multiplicadores por co-ocurrencia (ej. si vesícula AND zosteriforme, multiplicar score viral por 1.5).
