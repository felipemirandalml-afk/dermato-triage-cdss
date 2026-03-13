# Evidencia de Validación Clínica - DermatoTriage CDSS

## 📊 Resumen de Última Ejecución
- **Fecha**: 12 de Marzo, 2026
- **Comando**: `npm run validate`
- **Total de Casos**: 40
- **Resultado**: ✅ **40/40 PASS (100% Concordancia)**

## 🧪 ¿Qué se evalúa exactamente?
El harness de validación somete al motor a un set de **40 escenarios clínicos sintéticos** diseñados para estresar las tres capas del sistema:

1. **Capa Estadística (Baseline)**: Verifica que los pesos asignados a las ~120 variables (morfología, timing, topografía) produzcan la prioridad correcta en casos típicos.
2. **Capas de Seguridad (Modifiers)**: Valida que las reglas de "Escudo Clínico" escalen correctamente situaciones de riesgo vital (ej: Necrosis, Riesgo Ocular, SJS/NET) incluso si la estadística base sugiere menor prioridad.
3. **Capa Contextual (Systemic)**: Asegura que el historial del paciente (Inmunosupresión, Riesgo Metabólico) sea capturado y ajuste la conducta clínica según el protocolo de triage APS.

### Distribución de Casos:
- **Prioridad 1 (Urgencial)**: 14 casos (Emergencias vitales y quirúrgicas).
- **Prioridad 2 (Prioritario)**: 14 casos (Neoplasias, sospechas de ITS, compromiso moderado).
- **Prioridad 3 (Estable)**: 12 casos (Dermatosis crónicas, cuadros virales benignos, patología ambulatoria).

---
**Conclusión**: El refactor de arquitectura (Fase 1) ha preservado íntegramente el comportamiento clínico del sistema, garantizando regresión cero.
