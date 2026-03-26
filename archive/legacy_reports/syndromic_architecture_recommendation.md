# Recomendación de Arquitectura de Diagnóstico v2.0 (Phase 22)

Este reporte detalla la vía definitiva para superar el plateau estructural y alcanzar la precisión clínica deseada (>85%) en DermatoTriage CDSS.

## 1. El Diagnóstico del Plateau (Veredicto)
El motor sindrómico ha llegado a un límite de representación lineal. Seguir ajustando pesos (Fase 20, 21) es **insuficiente**. El problema es la **dilución de la señal** causada por el modelo Softmax plano de 12 clases concurrentes.

## 2. Propuesta: Arquitectura Jerárquica de Resolución (AJRC)
Se recomienda migrar de un modelo plano a una **Arquitectura en Cascada Interpretativa**.

### Estadio I: Separación de Macro-patrones (Macro-Leveling)
Aislar grandes categorías excluyentes:
1. **Tumores/Neoformaciones** (Ancla: Nódulo/Tumor/Nevo/Úlcera crónica).
2. **Infeccioso/Agudo** (Ancla: Fiebre/Ampolla/Pústula/Erosión/Dolor).
3. **Inflamatorio/Crónico** (Ancla: Placa/Pápula/Prurito/Escama).

### Estadio II: Refinamiento Sindrómico (Specific Decision)
Dentro de cada macro-patrón, usar clasificadores especializados (One-vs-Rest) **desacoplados**:
- **Infeccioso** -> ¿Bacteriano? ¿Viral? ¿Fúngico?
- **Inflamatorio** -> ¿Eczema? ¿Psoriasiforme? ¿Urticarial?

### Estadio III: Resolución de Conflictos (Pairwise Rescue)
Para pares históricamente inseparables (ej. Herpes Zóster vs Eczema ampolloso), disparar un micro-motor de **Búsqueda de Anclas Exclusivas** (ej. Patrón zosteriforme vs liquenificación).

## 3. Justificación y Beneficios
- **Elimina la Dilución**: Cada estadio solo decide entre 3-4 opciones, no 12.
- **Multietiquetado**: Un paciente puede pertenecer a dos macro-patrones si la evidencia es mixta, sin que uno "robe" probabilidad al otro de forma agresiva.
- **Fidelidad Clínica**: Refleja el orden mental del dermatólogo (¿Es benigno? ¿Es infeccioso? ¿Es eccematoso?).
- **Compatibilidad**: Se conservan los 83 rasgos del encoder canónico y los Red Flags manuales.

## 4. Conclusión
La **Arquitectura Jerárquica** es la única que permite integrar el conocimiento estadístico acumulado (RPR v2) con el razonamiento clínico profundo, eliminando el "agujero negro" sistémico de las categorías genéricas.

**Estado: Se recomienda la implementación de un prototipo de Cascada (v2.0) en la siguiente fase.**
