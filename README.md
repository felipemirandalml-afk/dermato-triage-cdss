# DermatoTriage CDSS v2.0.0

## 🏛️ Arquitectura y Fuente de Verdad
Este repositorio utiliza una arquitectura de capas separadas para garantizar la integridad del motor de inferencia y la modernidad de la interfaz.

1.  **Aplicación Oficial (`/frontend-v2`)**: SPA moderna en React 19 + Vite. Es el único punto de entrada para uso clínico. Gestiona el UI y encapsula el motor de inferencia (`src/engine`).
2.  **Tooling y Validación (Raíz)**: Entorno de orquestación. Contiene la suite de benchmarks (`/validation`), scripts de debugging (`/tools`) y pesos de entrenamiento (`/runtime`).
3.  **Legacy Archivado (`/archive`)**: Código monolítico (Vanilla JS/HTML) depreciado. Mantenido únicamente para auditoría y trazabilidad histórica. No funcional para el entorno actual.

## 📂 Estructura de Directorios
- `frontend-v2/`: Código fuente de la aplicación oficial.
- `runtime/`: Constantes y modelos compartidos (SSoT - Single Source of Truth).
- `validation/`: Suite de validación y benchmarks de precisión clínica.
- `tools/`: Scripts de mantenimiento e integridad del sistema.
- `archive/monolithic_ui/`: UI v1.x depreciada.

## 🚀 Ejecución Operativa
### Desarrollo e Interfaz
Desde la raíz del proyecto:
```bash
npm run dev
```
*(Lanza automáticamente la instancia de Vite en frontend-v2)*.

### Validación de Precisión Clínica
```bash
npm run validate:all
```

## 📈 Seguridad Crítica
- **P1 Automático**: Detección determinista de necrosis, isquemia o compromiso de mucosas.
- **Diferenciales**: Top-3 basado en semiología probabilística (RF) + Reglas Cardinales.
- **Responsabilidad**: Herramienta de asistencia. La decisión final es responsabilidad exclusiva del médico tratante.


