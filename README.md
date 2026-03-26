# DermatoTriage CDSS (v1.5.0 — Saneamiento Estructural 🏥)
**Sistema de Soporte a la Decisión Clínica para Triage Dermatológico en APS**

DermatoTriage es una aplicación web estática (Vanilla JS) diseñada para profesionales de Atención Primaria de Salud (APS). Proporciona una capa de triage de alta fidelidad mediante un motor híbrido que combina reglas heurísticas de seguridad con un modelo probabilístico de inferencia.

---

## 🏛️ Arquitectura del Sistema: El Motor Híbrido

El núcleo de DermatoTriage opera en tres capas concurrentes que garantizan seguridad y precisión clínica:

### 1. Capa de Seguridad (Heuristic Shields)
Prioriza la vida y la integridad del paciente sobre cualquier cálculo estadístico:
- **Escalación Inmediata (P1)**: Detección de patrones críticos (Necrosis, Isquemia, Compromiso de mucosas).
- **Protección Oncológica**: Evita el sub-triage de lesiones sospechosas (Melanoma, CBC, CEC).
- **Reglas Cardinales**: Lógica determinista para hallazgos patogmonómicos (Surco acarino, Vesículas agrupadas).

### 2. Motor Probabilístico (`probabilistic_model.js`)
Basado en un **Random Forest** entrenado con datasets dermatológicos reales. Clasifica el caso en uno de los 12 síndromes principales. 
- **Estado Actual**: Exactitud sindrómica del **~63.1%** (Benchmark v2.2). 
- **Nota**: Este es el "techo de cristal" del modelo actual, limitado por la densidad semiológica del input.

### 3. Ranker Diferencial & Explicabilidad
Proporciona el Top-3 de diagnósticos probables dentro del síndrome detectado, justificando cada uno mediante el mapa de razonamiento clínico (`engine/interpreter.js`).

---

## 📂 Organización del Repositorio (v1.5.0)

Tras la fase de saneamiento estructural, el repositorio se organiza de forma estricta:

### 📦 Runtime (Núcleo Activo)
Todo lo necesario para que la app funcione localmente en el navegador:
- `index.html`, `ui.js`, `model.js`: Orquestación y UI.
- `engine/`: Motores de inferencia, reglas y pesos del modelo (`rf_model.json`).
- `data/`: Mapas canónicos y archivos de recalibración estática.

### ⚙️ Pipeline de Entrenamiento
Herramientas para la evolución del modelo (no requeridas para el uso diario):
- `training/scripts/train_and_evaluate.py`: Script principal de entrenamiento (Python/Scikit-learn).
- `training/datasets/training_cases_v2.csv`: Dataset maestro de entrenamiento.

### 🧪 Validación y Auditoría
- `validation/scripts/validate_clinical_cases_hd.js`: Benchmark clínico de alta definición.
- `validation/scripts/validate_case_schema.js`: Verificación de integridad del contrato de datos.

### 📜 Research & Legacy (Archivo)
- `archive/`: Contenedor de reportes históricos, scripts obsoletos y materiales de investigación que ya no forman parte del runtime activo.

---

## 🚀 Uso Rápido

1.  **Ejecutar la App**: Abra `index.html` en cualquier navegador moderno.
    - *Nota*: El sistema procesa toda la lógica localmente pero carga Tailwind CSS vía CDN.
2.  **Validar Estado**:
    ```bash
    npm run validate
    ```

---

## 📈 Estado y Limitaciones (Honestidad Técnica)
- **Validación Clínica**: El sistema se encuentra en fase de validación técnica interna. **NO** ha sido sometido a ensayos clínicos prospectivos externos.
- **Sesgo de Datos**: El modelo tiene mayor rendimiento en síndromes inflamatorios frecuentes que en patologías raras.
- **Uso**: Herramienta de asistencia, la decisión final es siempre responsabilidad del médico tratante.

---

*Desarrollado con ❤️ para el fortalecimiento de la Atención Primaria.*
