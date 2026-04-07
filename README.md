# DermatoTriage CDSS v2.1.0
**Sistema Modular de Soporte a la Decisión Clínica para APS**

> [!IMPORTANT]
> **ADVERTENCIA DE USO**: Este sistema es una herramienta de **asistencia técnica** y no posee autonomía diagnóstica ni terapéutica. La decisión clínica final, el diagnóstico definitivo y la conducta médica son responsabilidad exclusiva del profesional de salud tratante. **NO SUSTITUYE EL JUICIO MÉDICO.**

---

## ⚕️ Gobernanza Clínica y SSoT (Single Source of Truth)

DermatoTriage v2.1.0 utiliza una arquitectura **Data-Driven (Basada en Datos)** donde la Interfaz de Usuario se autoconstruye dinámicamente a partir de la ontología clínica oficial.

### 1. Ontología Dinámica (SSoT)
- **Fuente de Verdad**: `runtime/data/concept_canonical_map.json`.
- **Mecanismo**: El sistema utiliza un `ConceptMapper` para descubrir y renderizar automáticamente hallazgos clínicos (`lesion_primaria`, `topografia`, `red_flags`) a partir del esquema maestro, garantizando sincronización total entre la UI y el motor de inferencia.

### 2. Transparencia y Explicabilidad (XAI)
- **Input Summary Card**: Se ha implementado una tarjeta de resumen clínico que muestra los datos procesados (Edad, Sexo, Evolución, Hallazgos) antes de leer el resultado, permitiendo al médico validar la entrada de datos.
- **Heuristic Shield**: Capa determinista de Red Flags que asegura la detección inmediata de emergencias (P1/P2) independientemente del modelo probabilístico.

### 3. Escudo de Validación Clínica
- El motor de análisis está bloqueado hasta que se cumplan criterios mínimos de densidad semiológica (Edad + Tiempo + Al menos 1 hallazgo clínico reconocido), evitando inferencias basadas en "input basura".

---

## 🏛️ Arquitectura Técnica v2.1.0
1.  **Frontend Modular (`/frontend-v2`)**: SPA en **React 19 + Vite + Zustand**.
2.  **Estado Segmentado**: Separación estricta entre Metadatos del Paciente y Features Clínicas para auditoría y trazabilidad.
3.  **Componentes Puros (Dumb Components)**: La navegación y formularios están desacoplados del store, comunicándose mediante eventos (onNext, onReset).
4.  **Motor Legacy Adaptado**: Hook de inferencia (`useInference.js`) que funciona como puente entre la modernidad de React y la potencia estadística del motor Random Forest original.

---

## 🚀 Ejecución Operativa
- **Desarrollo**: `npm run dev` desde la raíz.
- **Validación Clínica**: `npm run validate:all` para benchmarks de precisión.

---

*DermatoTriage: Inteligencia Explicable al servicio de la salud pública.*


