# DermatoTriage CDSS (v6.0) 🩺🚀

**Sistema de Apoyo a la Decisión Clínica (CDSS) para Triaje Dermatológico en Atención Primaria.**

Este sistema es una aplicación **100% estática, offline-first**, diseñada para asistir a profesionales de la salud en la priorización de casos dermatológicos utilizando una arquitectura de **Single Source of Truth (v6.0)**.

---

## 🧠 Arquitectura Técnica (v6.0)

El sistema se divide en tres capas desacopladas para máxima mantenibilidad:

1.  **Motor Clínico (`model.js`)**: Contiene la lógica canónica, el diccionario de variables (120+) y el motor de inferencia matemática basado en **Regresión Logística Multiclase (Softmax)**.
2.  **Interfaz de Usuario (`ui.js`)**: Gestiona la captura dinámica de datos, la interacción visual (acordeones) y el renderizado premium de resultados.
3.  **Presentación (`index.html`)**: Contenedor semántico optimizado con Tailwind CSS, libre de lógica embebida.

## 🔬 El Motor: 120+ Variables

El modelo analiza más de **120 variables clínicas** distribuidas en:

- **Banderas Rojas**: Inmunosupresión, fármacos sistémicos críticos y estado febril.
- **Semiología Completa**: Mapeo jerárquico de lesiones primarias, líquidas y secundarias.
- **Topografía Avanzada**: Desglose anatómico por regiones con sub-localizaciones dinámicas.
- **Patrones de Distribución**: Identificación de patrones claves (Acral, Dermatomal, etc.).

## 🛡️ Seguridad y Transparencia (Explainability)

El DermatoTriage CDSS v6.0 incluye un motor de **Explainability** que identifica los 5 factores de mayor peso matemático que impulsaron la recomendación de prioridad, permitiendo una toma de decisiones informada y auditable.

## 🚀 Capa de Interpretación Accionable (NUEVO)
A diferencia de versiones anteriores, el sistema ahora traduce la probabilidad matemática en una **conducta clínica explícita**:
- **Conducta Sugerida**: Recomendación directa sobre el flujo del paciente (Urgencias vs Especialista vs APS).
- **Plazo Recomendado**: Tiempos de derivación basados en estándares clínicos internacionales.
- **Red Flag Display**: Destaque visual inmediato de banderas rojas detectadas (compromiso mucoso, necrosis, fiebre, etc.).
- **Justificación Clínica**: Resumen interpretado de por qué el caso ha sido priorizado.

## 🧪 Validación Clínica (v1.0)

Para asegurar la seguridad y precisión del motor, el sistema incluye un **Clinical Validation Harness** que permite verificar el comportamiento del algoritmo frente a casos médicos reales y evitar regresiones.

### Casos Cubiertos
- **Prioridad 1 (Urgencia)**: Red flags sistémicas, SJS/NET, Vasculitis, Fascitis Necrotizante.
- **Prioridad 2 (Intermedia)**: Patologías inflamatorias agudas, sospecha de neoplasias, reacciones medicamentosas.
- **Prioridad 3 (Estable)**: Patologías crónicas localizadas (Acné, Psoriasis, Dermatitis Atópica).

### Cómo ejecutar la validación
Requiere **Node.js**:
```bash
npm run validate
```
O directamente:
```bash
node tools/validate_clinical_cases.js
```

### Motor de Priorización Híbrido (v2.0)
El sistema utiliza un enfoque de **Capas de Decisión** para máxima seguridad:
1.  **Score Estadístico**: Modelo de pesos dinámicos basado en >120 variables semiológicas.
2.  **Clinical Risk Modifiers**: Capa heuística explícita que escala/desescala la prioridad ante patrones críticos (ej: riesgo ocular, necrosis aguda, sospecha de malignidad).
3.  **Capa de Interpretación**: Traduce la prioridad en conductas accionables, plazos y una narrativa justificativa.

### Boundary Case Stress Testing (v1.1)
Para evaluar la robustez del motor clínico, se utiliza un set de validación de **30 casos** complejos.
- **Resultado Actual**: **100.0% Concordancia** (30/30 PASS).
- **Propósito**: Detectar sobretriage en cuadros extensos pero benignos y asegurar la sensibilidad ante banderas rojas sutiles.

### Cómo agregar nuevos casos
Edita el archivo `clinical_cases.js` siguiendo la estructura de objetos existente. Asegúrate de asignar la `expected_priority` según el consenso médico local.

### Calibración Clínica Iterativa (v1.0)
El sistema utiliza un proceso de **calibración dirigida por errores**. Los pesos en `model.js` se refinan periódicamente para maximizar la concordancia con los casos del harness. 
- **Última Calibración**: 12/12 casos exitosos (100% de cobertura canónica).
- **Trazabilidad**: Ver detalles en [CALIBRATION_NOTES.md](./CALIBRATION_NOTES.md).
- **Control de Regresión**: Cada cambio en el motor debe ser verificado ejecutando el validador.

---

## 🏗️ Uso

1. Abre `index.html` en un navegador moderno. No requiere conexión ni instalación.

---

## 🧪 Smoke Tests (Verificación Manual)

Para asegurar la integridad del sistema:
- **Caso Crítico**: Seleccionar *Fármacos Críticos* + *Ampollas* + *Estado Febril* + *Agudo* -> Debe resultar en **Prioridad 1 (Urgencia)**.
- **Caso Estable**: Seleccionar *Escamas* + *Evolución Crónica* -> Debe resultar en **Prioridad 3 (Estable)**.

---

## ⚠️ Aviso Legal (Disclaimer)

Esta herramienta es un **Sistema de Apoyo a la Decisión Clínica**. La recomendación de prioridad es sugerida y **no reemplaza el juicio clínico del médico**.

---
© 2026 DermatoTriage System. Desarrollado por felipemirandalml-afk.
