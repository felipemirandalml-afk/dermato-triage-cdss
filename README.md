# DermatoTriage CDSS v2.1.0

Sistema de soporte a la decisión clínica (CDSS) para triage dermatológico en atención ambulatoria, con interfaz moderna en React/Vite y un motor híbrido de inferencia clínica.

---

## 1. Propósito del sistema

DermatoTriage CDSS es una herramienta de apoyo para priorización clínica de pacientes con motivos de consulta dermatológicos, diseñada para asistir la evaluación inicial mediante:

- estructuración de hallazgos semiológicos relevantes,
- detección de signos críticos o red flags,
- estimación sindrómica orientativa,
- priorización operacional en niveles P1, P2 o P3,
- presentación de razonamiento clínico explicable basado en reglas heurísticas y capa probabilística.

El sistema **no reemplaza** la evaluación clínica presencial ni la toma de decisiones del profesional tratante.

---

## 2. Intended use

DermatoTriage está diseñado para:

- apoyar a profesionales de salud en contextos ambulatorios o de atención inicial,
- organizar y resumir hallazgos clínicos cutáneos relevantes,
- sugerir una prioridad de triage operacional,
- aportar diferenciales sindrómicos orientativos,
- aumentar la sensibilidad frente a cuadros dermatológicos potencialmente graves mediante reglas de seguridad.

### Usuario previsto
- médicos generales,
- médicos en formación,
- profesionales clínicos con capacidad de integrar el resultado al contexto del paciente.

### Contexto previsto
- atención ambulatoria,
- APS,
- evaluación clínica inicial,
- escenarios de apoyo docente o de validación técnica interna.

---

## 3. Not intended use

DermatoTriage **no está diseñado para**:

- establecer diagnósticos definitivos,
- reemplazar dermatología, urgencia, biopsia, dermatoscopía o evaluación presencial,
- descartar cáncer cutáneo,
- tomar decisiones autónomas sin supervisión clínica,
- priorizar pacientes inestables sin evaluación ABC inicial,
- ser utilizado directamente por pacientes como sistema de autodiagnóstico,
- guiar tratamiento farmacológico definitivo,
- sustituir protocolos institucionales vigentes.

Si existe compromiso sistémico, deterioro hemodinámico, dolor desproporcionado, compromiso mucoso, necrosis, despegamiento epidérmico u otra señal de gravedad, debe prevalecer la evaluación clínica urgente por sobre cualquier salida del sistema.

---

## 4. Población diana

La herramienta está pensada para pacientes con consulta dermatológica o dermatosis en evaluación clínica inicial.

### Consideraciones
- Puede ser utilizada como apoyo estructural en pacientes adultos.
- Su uso en población pediátrica, inmunosuprimidos, pacientes oncológicos complejos o embarazadas debe considerarse con especial cautela.
- El sistema no ha sido validado como herramienta específica para subgrupos clínicos de alta complejidad.

---

## 5. Significado operacional del triage

DermatoTriage entrega una prioridad operacional resumida en tres niveles:

### P1 — Derivación inmediata
Sugiere necesidad de evaluación urgente o derivación inmediata por alta sospecha de compromiso grave, red flags mayores o riesgo vital/funcional.

Ejemplos de escenarios de activación:
- necrosis o isquemia,
- compromiso de mucosas,
- despegamiento epidérmico,
- signos sistémicos de inestabilidad,
- sospecha de cuadro dermatológico grave que no debe diferirse.

### P2 — Prioridad alta
Sugiere evaluación médica prioritaria o resolución acelerada, idealmente en corto plazo, por riesgo clínico relevante sin criterios evidentes de emergencia vital inmediata.

Ejemplos:
- sospecha oncológica cutánea,
- dermatosis con carga inflamatoria importante,
- cuadros de progresión subaguda con hallazgos de preocupación,
- necesidad de evaluación especializada o presencial priorizada.

### P3 — Manejo ambulatorio
Sugiere manejo ambulatorio o evaluación no urgente, siempre que el contexto clínico global sea concordante y no existan red flags no capturados por el sistema.

**Importante:** P3 **no equivale** a “cuadro benigno asegurado” ni descarta evolución desfavorable.

---

## 6. Estado actual de validación

DermatoTriage se encuentra en fase de:

- validación técnica interna,
- revisión estructural del flujo de datos,
- benchmark clínico sintético / semiestructurado,
- saneamiento progresivo de arquitectura y trazabilidad.

### Estado actual
- Existe validación técnica interna del motor y de casos clínicos de prueba.
- No existen, hasta la fecha, ensayos clínicos prospectivos externos.
- No existe validación multicéntrica publicada.
- No debe interpretarse como dispositivo clínico validado para uso autónomo.

---

## 7. Limitaciones conocidas

### Limitaciones del sistema
- El rendimiento depende de la calidad del input clínico ingresado.
- La salida es orientativa y puede degradarse con descripciones incompletas o sesgadas.
- La capa probabilística no reemplaza correlación clínica, examen físico ni juicio experto.
- La interpretación sindrómica puede ser menos robusta en patologías raras, superpuestas o atípicas.
- El sistema aún conserva compatibilidad con componentes legacy del motor, por lo que su evolución sigue en transición arquitectónica controlada.

### Limitaciones del benchmark
- Los resultados de benchmark reflejan validación interna, no desempeño clínico real en terreno.
- Los porcentajes de desempeño no deben interpretarse como garantía diagnóstica individual.
- Las métricas dependen de la composición del set de validación, del balance entre síndromes y de la granularidad semiológica disponible.

---

## 8. Advertencia clínica

DermatoTriage es una **herramienta de apoyo**.

- No sustituye la evaluación médica presencial.
- No sustituye el juicio clínico.
- No sustituye protocolos institucionales.
- No sustituye derivación o manejo urgente cuando el contexto clínico lo amerita.

La decisión final es siempre responsabilidad exclusiva del profesional tratante.

---

## 9. Arquitectura y fuente de verdad

Este repositorio utiliza una arquitectura por capas para separar interfaz, estado clínico, lógica de inferencia y tooling de validación.

### Estructura principal
1. **Aplicación oficial (`/frontend-v2`)**  
   SPA en React 19 + Vite. Es la interfaz operativa principal del sistema.

2. **Tooling y validación (raíz)**  
   Scripts de debugging, benchmarks clínicos, validación e integridad.

3. **Legacy archivado (`/archive`)**  
   Código histórico depreciado, mantenido solo para trazabilidad técnica y auditoría evolutiva.

---

## 10. Estructura de directorios

- `frontend-v2/` → aplicación principal
- `frontend-v2/src/store/` → estado clínico global
- `frontend-v2/src/hooks/` → orquestación de inferencia
- `frontend-v2/src/components/` → interfaz modular
- `frontend-v2/src/engine/` → motor clínico de inferencia
- `validation/` → validación técnica y benchmarks
- `tools/` → scripts de mantenimiento
- `archive/` → legado archivado

---

## 11. Ejecución

### Desarrollo
Desde la raíz del proyecto:

```bash
npm run dev
```
Esto lanza la aplicación oficial ubicada en `frontend-v2`.

### Build
```bash
npm run build
```

### Validación técnica
```bash
npm run validate:all
```

---

## 12. Resumen funcional del sistema

DermatoTriage combina:

- captura estructurada de datos clínicos,
- features semiológicas organizadas,
- reglas de seguridad heurística,
- clasificación sindrómica probabilística,
- ranking diferencial,
- resumen del input clínico,
- explicación parcial del razonamiento activado.

---

## 13. Estado del proyecto

Este proyecto se encuentra en evolución activa, con foco actual en:

- limpieza estructural,
- gobernanza clínica,
- trazabilidad del razonamiento,
- reducción de deuda legacy,
- mejora de documentación,
- endurecimiento del contrato entre frontend y motor.

---

## 14. Licencia
MIT

---

## 15. Recordatorio final
Si el paciente se ve mal, el paciente manda.  
No el benchmark, no el score, no el dashboard bonito, y ciertamente no el porcentaje de “confianza” con cara de importantito.
