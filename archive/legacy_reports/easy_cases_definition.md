# Definición Operacional: Escenario Clínico "Fácil" (Easy Case)

Para la Fase 11 de DermatoTriage CDSS, se define un **Caso Fácil** como aquel que presenta un fenotipo patognomónico o altamente prototípico, diseñado para minimizar la ambigüedad y el ruido estadístico.

## 1. Criterios de Inclusión
- **Frecuencia Estadística**: Solo se utilizan descriptores morfológicos cuya frecuencia en el perfil semiológico (Derm1M) sea **superior al 50%** (o el top 1 si todos son bajos).
- **Pureza Morfológica**: Máximo de 2 descriptores morfológicos dominantes. Se evita la "contaminación" con hallazgos secundarios (ej. no añadir eritema a un caso de sarna si el surco es el hallazgo clave).
- **Coherencia de Contexto**: El **Timing** y los **Síntomas** deben ser los clásicos descritos en libros de texto (H. Zoster -> Agudo + Dolor; Eczema -> Crónico + Prurito).
- **Topografía Prototípica**: Se utiliza el hábitat más común reportado para la entidad (ej. Acné -> Cara; Tiña Pedis -> Pies).

## 2. Criterios de Exclusión (Anti-Ruido)
- **Eliminación de "Common Noise"**: Se excluyen sistemáticamente el `eritema` y la `escama` a menos que sean el descriptor primario de la enfermedad (ej. en Psoriasis).
- **Sin Contradicciones**: Se prohíben combinaciones del tipo "Tumor + Fiebre" o "Eczema + Agudísimo".
- **Sin Borderlines**: Se evitan casos diseñados para confundir síndromes (ej. no generar variantes de Piel Escalada Estafilocócica vs NET en esta fase).

## 3. Objetivo del Test de Techo (Ceiling Test)
El objetivo es determinar si, ante una descripción clínica perfecta y sin ruido, el sistema es capaz de:
1. Asignar el **Síndrome Correcto**.
2. Proponer la **Prioridad de Triage** adecuada.
3. Incluir la **Enfermedad Específica** en el Top 3 del Ranker Diferencial.

Si el sistema falla incluso bajo estas condiciones, el problema es **estructural/basal**. Si tiene éxito, el problema detectado en la Fase 10 es de **calibración/ruido**.
