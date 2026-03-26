# Auditoría de Factibilidad: Combinaciones Semiológicas (Fase 13)

## 1. Soporte de Datos para Combinaciones
- **Pares (Lesión + Lesión)**: Alta factibilidad. Muchos perfiles de Derm1M listan 3-5 descriptores morfológicos concurrentes.
- **Pares (Lesión + Topografía)**: Factibilidad media/alta. Aunque la topografía es a menudo una inferencia, la co-ocurrencia con descriptores como `palmas`, `cara`, `flexuras` es analizable en subconjuntos específicos.
- **Tríadas**: Factibilidad moderada. Requiere un umbral de frecuencia mínima (ej. aparecer en >10 diagnósticos) para evitar ruidos de "n = 1".

## 2. Categorías de Análisis Prioritarias
| Categoría | Ejemplo | Valor Esperado |
| :--- | :--- | :--- |
| **Lesión + Patrón** | Vesícula + Zosteriforme | **Extremo**. Diagnóstico casi directo. |
| **Lesión + Topografía**| Vesícula + Palmas | **Alto**. Diferencia deshidrosis de herpes. |
| **Lesión + Superficie** | Placa + Escama | **Alto**. Define el clúster psoriasiforme. |
| **Pares de Ruido** | Eritema + Escama | **Informativo**. Confirma inflamación inespecífica. |

## 3. Limitaciones de la Fuente
- **Independencia Estadística (Inferencia)**: Al no tener casos individuales, la co-ocurrencia en el dataset se asume si ambos rasgos están en el mismo perfil de enfermedad. Esto puede sobreestimar combinaciones si en la realidad clínica los rasgos se presentan en fases distintas.
- **Ausencia de Dinámicas**: No podemos medir combinaciones temporales (ej. mácula que evoluciona a vesícula).

## 4. Conclusión
El análisis de **Pares** es robusto y suficiente para fundamentar una recalibración contextual seria. El análisis de **Tríadas** se limitará a casos de "Alto Valor Terapéutico/Diagnóstico" (ej. Comedón + Cara + Pápula).
