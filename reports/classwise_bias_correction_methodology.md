# Metodología de Corrección de Sesgo Basal por Clase v1.0 (Phase 21)

Este documento detalla el rigor metodológico para desinflar la dominancia basal del síndrome "Otros" y nivelar la probabilidad sindrómica del baseline.

## 1. El Problema: Logits Asimétricos
El orquestador `model.js` recibe una distribución de probabilidad post-softmax, donde el intercepto alto de `inflammatory_dermatosis_other` (1.00) ya ha inflado artificialmente su porcentaje.

## 2. Solución Propuesta: Normalización por Recíproco de Intercepto (NIR)
En lugar de ajustar pesos individuales (que actúan linealmente), aplicaremos un **Offset de Base de Rescate**.

### A. Factor de Corrección Basal ($B_s$)
Se calcula como el inverso aditivo del intercepto normalizado:
$$B_s = \exp(-\text{Intercept}_s)$$

Esto effectively "cancela" el peso que el intercepto puso en el softmax original.

### B. Aplicación en el Pipeline (LAC)
Antes de aplicar los boosters estadísticos v2 (RPR), el orquestador realizará una **Pre-nivelación**:
1. Recibe $P_{\text{raw}}(S)$.
2. Aplica $P_{\text{levelled}}(S) = P_{\text{raw}}(S) \cdot B_s$.
3. Re-normaliza la distribución para que sume 100%.

## 3. Beneficios Clínicos
- **Desbloqueo de Síndromes Raros**: Categorías con interceptos negativos (Psoriasis, Tumores Suspechosos) "suben" albaseline.
- **Transparencia**: El sistema deja de favorecer "Otros" por defecto, obligándolo a buscar evidencia positiva en las anclas clínicas.
- **Potenciación de v2**: Los boosters contextuales ahora actúan sobre un suelo nivelado, evitando que el sesgo basal los anule catastróficamente.

## 4. Conclusión
Esta corrección no es un hardcode, sino una **re-calibración de la brújula sindrómica** que restaura la neutralidad diagnóstica previa a la recalibración por evidencia.
