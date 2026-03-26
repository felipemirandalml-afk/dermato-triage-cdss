# Metodología de Re-normalización Sindrómica v2.0 (Fase 17)

Este documento detalla el rigor estadístico aplicado para corregir el sesgo del "agujero negro" en el motor de DermatoTriage CDSS.

## 1. El Problema de la Frecuencia Absoluta (v1)
Anteriormente, la discriminación de rasgos se calculaba como:
$$P(S | F) = \frac{\text{Conteo de Feature F en Síndrome S}}{\text{Conteo Global de Feature F}}$$
**Falla**: Si el Síndrome $S_x$ es 50 veces más grande que $S_y$, los conteos brutos favorecen a $S_x$ incluso si la feature es clínicamente de $S_y$.

## 2. Solución: Ratio de Prevalencia Relativa (RPR)
En la v2.0, utilizamos la normalización por población sindrómica:

### A. Frecuencia Específica ($f_s$)
$$f_s = \frac{\text{Conteo de F en S}}{\text{Población Total de Diagnósticos en S}}$$

### B. Frecuencia Global ($f_g$)
$$f_g = \frac{\text{Conteo Global de F}}{\text{Población Total de Diagnósticos en el Dataset}}$$

### C. Ratio de Prevalencia Relativa (RPR)
$$RPR = \frac{f_s}{f_g}$$

**Interpretación**:
- **RPR = 1.0**: El rasgo aparece en el síndrome con la misma frecuencia que en el resto del mundo dermatológico (Ruido).
- **RPR > 1.0**: El rasgo está **sobre-representado** en ese síndrome.
- **RPR > 5.0**: Se considera una **Ancla Clínica** (Señal Fuerte).

## 3. Implementación en Pares y Tríadas
La metodología se extendió a co-ocurrencias:
1. Se calcula la frecuencia de la pareja/trío normalizada por el tamaño del síndrome.
2. Se compara contra su co-ocurrencia global.
3. Se asigna el síndrome con mayor sobre-representación como el "Top Syndrome" del patrón.

## 4. Conclusión
Esta normalización desacopla la **especificidad** del **volumen**, permitiendo que DermatoTriage sea sensible a enfermedades raras pero con semiología patognomónica.
