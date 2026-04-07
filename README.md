# DermatoTriage CDSS (v2.0.0 — Modernización Modular 🚀)
**Sistema de Soporte a la Decisión Clínica para Triage Dermatológico en APS (React Edition)**

DermatoTriage es una aplicación de grado clínico diseñada para profesionales de Atención Primaria de Salud (APS). Proporciona una capa de triage de alta fidelidad mediante un motor neuro-simbólico que combina reglas heurísticas de seguridad con un modelo probabilístico de Random Forest.

---

## 🏛️ Arquitectura del Sistema: v2.0 Modular

Tras el refactor de la Fase 15, el sistema ha migrado de un monolito estático a una arquitectura moderna basada en componentes, separando la lógica médica de la interfaz de usuario.

### 1. Capa de UI (Frontend Moderno)
- **Tecnología**: React 19 + Vite + Tailwind CSS.
- **Estado**: Gestionado con **Zustand** para persistencia reactiva durante la sesión clínica.
- **Ubicación**: `/frontend-v2`.

### 2. Motor Clínico (Hybrid Engine)
- **Inferencia Probabilística**: Random Forest (RF) cargado dinámicamente (`rf_model.json`) para clasificación sindrómica (12 categorías).
- **Escudos Heurísticos (ExAI)**: Capa de seguridad que detecta "Red Flags" (Emergencias vitales y sospecha de malignidad) con prioridad P1/P2 garantizada.
- **Diferenciación Cardinal**: Ranker diferencial basado en semiología de alta resolución.

---

## 📂 Organización del Repositorio

Para garantizar la trazabilidad clínica y el orden técnico, el repositorio se organiza de la siguiente manera:

### 🏥 Core de Aplicación (Runtime Activo)
*   **`/frontend-v2`**: El corazón del sistema. Contiene los componentes React, el store de estado y el **Engine** clínico consolidado en `src/engine/`.
*   **`/runtime`**: Archivo maestro de descriptores, pesos y constantes clínicas compartidas.

### 🧪 Validación y Debugging
*   **`/validation`**: Suite de benchmarks clínicos. Incluye scripts para correr pruebas masivas de precisión diagnóstica.
*   **`/tools`**: Herramientas de diagnóstico de integridad, reparadores de mapeo y simuladores de casos clínicos.

### 📜 Legacy & Archive
*   **`/archive/monolithic_ui`**: Contiene la versión v1.5 (Vanilla JS) para fines de auditoría histórica. **No apta para uso en producción.**

---

## 🚀 Guía de Inicio Rápido

### Requisitos
- Node.js (v18 o superior)

### Instalación y Ejecución
1.  **Instalar dependencias** (si es la primera vez):
    ```bash
    npm install && cd frontend-v2 && npm install
    ```
2.  **Iniciar la App**:
    ```bash
    npm run dev
    ```
    *Nota: El script en la raíz redirigirá automáticamente el tráfico a la instancia de Vite.*

3.  **Correr Pruebas de Integridad**:
    ```bash
    npm run validate:all
    ```

---

## 📈 Seguridad y Limitaciones
- **P1 Directo**: Cualquier hallazgo de necrosis, isquemia o compromiso de mucosas gatilla derivación inmediata automática.
- **Uso Crítico**: Esta herramienta es de **asistencia**. La decisión clínica final y la responsabilidad legal recaen exclusivamente en el médico tratante.

---
*Desarrollado para el fortalecimiento de la Atención Primaria mediante Inteligencia Explicable.*

