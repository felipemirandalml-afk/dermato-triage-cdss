# Plan de Arquitectura: Recalibración Estadístico-Contextual v1.0 (Fase 15)

## 1. Visión General
El objetivo es migrar el "cerebro diagnóstico" de DermatoTriage desde una lógica de parches manuales hacia un motor impulsado por la **Epidemiología Semiológica Interna (ESI)** calculada en las fases 12-14.

## 2. Puntos de Integración

### A. Capa de Diagnóstico Diferencial (`differential_ranker.js`)
- **Cambio**: Reemplazar los multiplicadores fijos (`* 6` y `-3`) por pesos dinámicos.
- **Inyección**: Uso del `statistical_base_weights.json` para definir la importancia basal de cada hallazgo.
- **Modulación**: Aplicación de `contextual_pair_modulators.json` y `contextual_triplet_modulators.json` sobre el score final de la enfermedad.

### B. Capa de Orquestación (`model.js`)
- **Cambio**: Refinar la función `refineSyndromeReasoning`.
- **Inyección**: Uso de los **Gestalts Fuertes** (v14) para dar boosts masivos a síndromes específicos (ej. Zosteriforme solo si se detecta el gestalt completo).

### C. Capa de Seguridad (Manual)
- **Status**: **Intocable**. Los Shields de `model.js` y las Red Flags seguirán siendo manuales para garantizar que ninguna optimización estadística comprometa un triage de emergencia (P1).

## 3. Flujo de Datos del Nuevo Motor
1. **Entrada UI** -> `feature_encoder.js`
2. **Inferencia Síndrome** -> `probabilistic_model.js` -> `model.js` (Refuerzo por Gestalt Estadístico)
3. **Inferencia Diferencial** -> `differential_ranker.js`:
   - Calcular Score Basal (Peso Estadístico [ESI] * Frecuencia [Derm1M]).
   - Aplicar Boost Contextual por Pares encontrados.
   - Aplicar Boost de Gestalt por Tríadas encontradas.
   - Aplicar Freno de Ruido (Reducción de pesos para eritema/pápula aislada).

## 4. Estrategia de Rollout
Se implementará un helper central `engine/recalibration_helper.js` que cargará todos los JSONs de evidencia, minimizando el impacto en los archivos core del motor.
