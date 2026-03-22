# Mapa de Ruido Semiológico: Análisis de Ambigüedad (Fase 12)

El ruido semiológico se define como hallazgos de alta frecuencia pero baja especificidad que "ahogan" la señal de los diagnósticos correctos.

## 1. Top 5 Descriptores de Ruido (Background Noise)

| Descriptor | Freq. Global | Coef. DP | Impacto Sistémico |
| :--- | :---: | :---: | :--- |
| **Eritema** | 52.49% | **0.000** | Aparece en todos los síndromes. Induce falsos positivos en casi cualquier entrada. |
| **Pápula** | 21.89% | **0.065** | Presente en 11 de los 12 síndromes. Escaso valor discriminativo aislado. |
| **Nódulo** | 12.00% | **0.293** | Aparece en 8 síndromes. Confunde tumores con cuadros inflamatorios profundos. |
| **Mancha** | 20.00% | **0.333** | Define el color pero no la patología. Extremadamente ubicuo. |
| **Hiperpigmentación** | 19.81% | **0.334** | Ruido común en resoluciones de inflamación y tumores melanocíticos. |

## 2. Estrategia de Mitigación de Ruido
- **De-weighting**: Reducir los coeficientes de estos 5 factores en el `probabilistic_model.js` en al menos un 40%.
- **Contextualización**: El **Eritema** solo debe ganar peso si se presenta de forma **aislada** (ej. Erisipela sin pápulas) o si se combina con **Fiebre** (reforzando el P1).
- **Inhibición de Nódulo**: El nódulo no debe proponer de forma agresiva `cutaneous_tumor_suspected` si existen anclas inflamatorias como `comedón` o `excoriación`.

## 3. Valor Discriminativo de la Escama
Aunque la **escama** es frecuente (13%), su DP de **0.36** la sitúa en una zona gris. Recupera utilidad solo cuando se combina con patrones (flexural vs extensor).
