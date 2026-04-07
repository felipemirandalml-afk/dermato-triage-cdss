# DermatoTriage CDSS v2.0.0
**Sistema de Soporte a la Decisión Clínica para Triage Dermatológico en APS**

> [!IMPORTANT]
> **ADVERTENCIA DE USO**: Este sistema es una herramienta de **asistencia técnica** y no posee autonomía diagnóstica ni terapéutica. La decisión clínica final, el diagnóstico definitivo y la conducta médica son responsabilidad exclusiva del profesional de salud tratante. **NO SUSTITUYE EL JUICIO MÉDICO.**

---

## ⚕️ Gobernanza Clínica y Uso Previsto

### 1. Uso Previsto (Intended Use)
DermatoTriage está diseñado para asistir en la **priorización (triage) y orientación sindrómica** de lesiones cutáneas frecuentes en el contexto de la Atención Primaria de Salud (APS). Su objetivo principal es:
- Identificar hallazgos de alta sospecha (Red Flags) que requieran derivación urgente (P1/P2).
- Proporcionar un ranking diferencial basado en semiología probabilística para orientar el estudio inicial.

### 2. Población Objetivo (Target Population)
- **Pacientes**: Adultos y niños con lesiones cutáneas de novo o exacerbaciones de patologías conocidas.
- **Contexto**: Consultas de morbilidad no programada en APS o servicios de urgencia de baja complejidad.

### 3. Uso No Previsto (Contraindicaciones)
- Diagnóstico autónomo sin supervisión médica.
- Evaluación de lesiones en mucosas genitofemoral o interna (requiere examen físico presencial directo).
- Uso en pacientes con compromiso sistémico agudo no dermatológico (ej. shock, sepsis de otro origen).

### 4. Limitaciones Clínicas Explícitas
- **Densidad Semiológica**: La precisión del modelo depende estrictamente de la calidad y exhaustividad del examen físico ingresado por el usuario.
- **Sesgo de Dataset**: El modelo tiene un rendimiento optimizado para fototipos de Fitzpatrick I-IV. Su precisión en fototipos oscuros (V-VI) está en fase de calibración.
- **Patología Rara**: El sistema prioriza diagnósticos frecuentes; patologías dermatológicas raras pueden no ser representadas correctamente en el ranking diferencial.

---

## 🏛️ Arquitectura y Fuente de Verdad
1.  **Aplicación Oficial (`/frontend-v2`)**: SPA moderna en React 19 + Vite. Único punto de entrada operativo.
2.  **Tooling y Validación (Raíz)**: Suite de benchmarks (`/validation`) y scripts de integridad.
3.  **Legacy Archivado (`/archive`)**: Código v1.x depreciado. Solo para trazabilidad histórica.

---

## 🚀 Ejecución Operativa
- **Desarrollo**: `npm run dev` desde la raíz.
- **Validación Clínica**: `npm run validate:all` para ejecutar benchmarks de precisión.

---

*DermatoTriage: Inteligencia Explicable al servicio de la salud pública.*


