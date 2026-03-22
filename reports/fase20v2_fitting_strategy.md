# Estrategia de Fitting a Escala v2.0 (~80k casos) (Phase 20 v2)

Este documento detalla la metodología para estabilizar el motor clínico sobre el baseline ya corregido mediante NIR.

## 1. Contexto: Fitting sobre Suelo Nivelado
A diferencia de la Fase 20 v1 (30k), este ajuste opera con el factor **NIR (recíproco del intercepto)** activo. Esto significa que el orquestador ya no tiene el "viento en contra" del sesgo de volumen, permitiendo que incrementos menores en los pesos tengan un impacto mayor.

## 2. Los Tres Estadios de Optimización

### Estadio A: Refinamiento de Anclas (Features)
- **Objetivo**: Estabilizar la importancia de las 47 features del mapa canónico.
- **Táctica**: Usar los 60k casos de fitting para ajustar `base_weights_fit_v2.json`.

### Estadio B: Estabilización de Gestalts (Tríadas)
- **Objetivo**: Evitar que combinaciones frecuentes (ej. Placa+Escama) secuestren el diagnóstico diferencial.
- **Táctica**: Ajustar el `boost` de las tríadas en `syndrome_boosters_fit_v2.json` para que solo actúen sobre la varianza no explicada por las features individuales.

### Estadio C: Atenuación de Ruido Semiológico
- **Objetivo**: Penalizar rasgos ubicuos si su presencia no añade valor informativo en el contexto del baseline nivelado.

## 3. Parámetros Técnicos
- **Alpha (Learning Rate)**: 0.08 (Amortiguado para evitar oscilaciones en 60k filas).
- **Control de Saturación**: Cap de 0.8 para boosters contextuales.
- **Función Objetivo**: Maximización del F1-Score sindrómico promedio, no solo accuracy global.

## 4. Conclusión
El uso de 80,000 casos permitirá una **estabilidad estadística** sin precedentes en el proyecto, detectando si existen límites infranqueables en la taxonomía sindrómica actual.
