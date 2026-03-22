# Auditoría de Sesgo Basal por Clase v1.0 (Fase 21)

Este documento detalla la influencia de los interceptos (biases) en el motor de inferencia sindrómica de DermatoTriage CDSS.

## 1. Distribución de Interceptos en el Modelo LR
Los interceptos definen la probabilidad "en reposo" (baseline) de cada síndrome cuando hay poca evidencia semiológica.

| Síndrome | Intercepto | Estado Basal | Impacto Clínico |
| :--- | :---: | :---: | :--- |
| **`inflammatory_dermatosis_other`** | **1.0019** | **Dominante** | Actúa como un "Black Hole" que atrae casos ruidosos. |
| `benign_cutaneous_tumor` | 0.7588 | Elevado | Favorece diagnósticos benignos sobre malignos. |
| `bacterial_skin_infection` | 0.3969 | Moderado | Nivel basal de sospecha infecciosa. |
| `viral_skin_infection` | 0.3566 | Moderado | Nivel basal similar a bacteriano. |
| `eczema_dermatitis` | -0.2568 | Penalizado | Requiere evidencia activa para superar el bias. |
| `psoriasiform_dermatosis` | -0.3523 | Penalizado | Dificulta la sindromización de casos "easy". |
| `urticarial_dermatosis` | -1.4155 | **Muy Penalizado** | Requiere anclas muy fuertes (Habón) para emerger. |
| **`cutaneous_tumor_suspected`** | **-1.5945** | **Muy Penalizado** | **REGLA DE SEGURIDAD**: Difícil de diagnosticar basamente. |

## 2. Hallazgo Principal: Gravedad Estadística
La dominancia de `inflammatory_dermatosis_other` (bias 1.0) frente a `psoriasiform` (bias -0.35) significa que, ante el mismo nivel de evidencia semiológica neutra, el sistema siempre favorecerá "Otros" por una magnitud de **~1.35 puntos de logit**.

Esto explica por qué incluso con re-normalización v2, el sistema sigue colapsando: el punto de partida está desnivelado.

## 3. Conclusión
La auto-calibración de pesos contextuales es insuficiente si no se corrige primero la **asimetría del suelo** del modelo. Se requiere una normalización por clase que desinfle los síndromes dominantes.
