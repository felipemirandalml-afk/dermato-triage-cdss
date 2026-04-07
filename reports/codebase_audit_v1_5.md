# 🩺 Auditoría Completa de Código: DermatoTriage CDSS (v1.5.0)

Esta es una auditoría arquitectónica detallada, archivo por archivo, del repositorio de **DermatoTriage CDSS**. El sistema cuenta con una arquitectura dividida de forma limpia y escalable en capas de UI, Core Matemático/Probabilístico y Reglas Clínicas de Negocio.

---

## 1. Raíz del Repositorio (Punto de Entrada y Testing)

*   📄 **`index.html`**
    *   **Propósito:** Es la Single Page Application (SPA) principal. Contiene el diseño esquelético del formulario clínico, dividido en 3 pestañas principales (Datos Core, Exploración Avanzada y Signos Críticos).
    *   **Observación:** Carga **TailwindCSS** vía CDN y es semántico a la hora de atrapar variables clínicas. Usa convenciones de ID muy directas que luego captura el frontend (`ui.js`).
*   📄 **`index.css`**
    *   **Propósito:** Archivo de hoja de estilos global complementario a Tailwind. Contiene utilidades base, variables (CSS Custom Properties) e inyecciones de clases customizadas o soporte offline.
*   📄 **`package.json`**
    *   **Propósito:** Configura el proyecto como nativo ESP Module (`"type": "module"`). Define únicamente utilidades elementales como script de despliegue dev local (`npx serve`) y comandos para tests automáticos y validaciones.
*   📄 **`debug_case.js`**, **`check_integrity.js`**, **`repair_mapper.js`**
    *   **Propósito:** Son *scripts utilitarios de desarrollo (DevTools local)*. Sirven para probar casos específicos del modelo en backend (Node), comprobar que la dimensión del vector hace *match* con los diccionarios conceptuales (integridad) y reparar mutaciones masivas (como lo que hicimos con los features "auto_migrated").
*   📄 **`.md` files** (`README.md`, `CHANGELOG.md`, `MAINTAINING.md`, etc.)
    *   **Propósito:** Estándares de documentación rigurosa del repositorio. Definen el historial de versiones, los criterios médicos y los estándares de mantenimiento.

---

## 2. Capa Front-End y Comunicación (Directorio `runtime/ui/`)

*   📄 **`ui.js`** (El Mediador de la UI)
    *   **Propósito:** Es el controlador principal del DOM. Su función es "escuchar" todos los clics y selects del archivo HTML, recoger la metadata en un objeto de entrada (`input_object`), y pasárselo al Motor (Engine).
    *   **Flujo:** `UI (DOM)` → Construye el objeto JSON clínico → Llama a `runTriage(input)` → Recibe `Resultados` → Renderiza Probabilidades en el HTML de salida.

---

## 3. Core Engine: Inferencia Matemática y Clínica (Directorio `runtime/engine/`)

Este es el verdadero "Cerebro" de la aplicación. Está dividido modularmente en Inferencia Pura y Reglas Heurísticas.

*   📄 **`model.js`** (Orquestador Central)
    *   **Propósito:** El punto de inicio de la Inteligencia Artificial. Combina todo el flujo y actúa como un "Pipeline": pasa el texto por el Concept Mapper, traduce todo a Vectores Binarios Matemáticos, inicia el Random Forest, le agrega Heurística Clínica de ajuste, y decide la criticidad final.
*   📄 **`concept_mapper.js`** (Diccionario Semántico Resolutivo)
    *   **Propósito:** Evita los errores humanos (como el bug reciente) y resuelve variaciones de texto (acentos, mayúsculas, plurales y *aliases*) y las transforma en **ID Canónicos** estandarizados. 
*   📄 **`feature_encoder.js`** (El Matemático de Datos)
    *   **Propósito:** Toma los "ID Canónicos" y los traduce en exacto **1 y 0** para un array (`vector numérico`) ordenado en la misma posición de las columnas usadas al entrenar a la IA.
*   📄 **`constants.js`** (El Blueprint Vectorial)
    *   **Propósito:** Contiene un único array duro inmutable (`PROBABILISTIC_FEATURES`) que define cuáles son los ~138 inputs formales con el que se entrenó el clasificador estadístico.
*   📄 **`probabilistic_model.js`** // **`rf_model.json`**
    *   **Propósito:** Éste es el algoritmo real extraído de Machine Learning (probablemente una regresión logística o Random Forest). Toma el Vector del *Feature Encoder* y produce los verdaderos porcentajes en bruto. `rf_model.json` es el volcado pre-entrenado (¡pesa 6MB!).
*   📄 **`recalibration_engine.js`** (El Ajustador Predictivo)
    *   **Propósito:** Algoritmo que ajusta las probabilidades arrojadas por la IA basándose en métricas estadísticas reales y archivos json. Calibra si un resultado sufre de "sobreestimación" y empuja los puntajes para que sean más realistas.
*   📄 **`safety_modifiers.js`** (Policía de Triage)
    *   **Propósito:** Capa Determinística de Reglas. Revisa los síntomas extra-cutáneos e invoca reglas duras (ej: "Si hay Fiebre e Inmunosupresión, el Triage debe ser automáticamente Prioridad 1", ignorando lo que diga la IA).
*   📄 **`cardinal_feature_rules.js`** & **`differential_ranker.js`** (Impulsificadores Heurísticos)
    *   **Propósito:** Capa lógica que modifica artificialmente el *ranking* de síndromes devuelto por la IA. Reordena el diagnóstico clínico inyectando lógicas humanas del "qué se parece a qué".
*   📄 **`context_modifiers.js`**
    *   **Propósito:** Modifica los perfiles esperables basándose en contextos adicionales (comorbilidades, raza de la piel, y grupos sistémicos).
*   📄 **`interpreter.js`** & **`export_service.js`** (Post-procesado)
    *   **Propósito:** `interpreter.js` se encarga de crear textos en formato legible y explicar por un texto "el qué causó este diagnóstico". `export_service.js` compila todo finalmente en un formato de descarga / Nota en formato SOAP (Subjective, Objective, Assessment, Plan).

---

## 4. Base de Conocimiento Ontológico (Directorio `runtime/data/`)

Esta carpeta es la inyección "pasiva" de datos de configuración general y de ontología semiespacial.

*   📄 **`concept_canonical_map.json`** (Single Source Of Truth)
    *   El archivo crítico que reparamos. Diccionarios con descripciones estandarizadas de todas las características para la UI y para convertir a ID canónico de sistema.
*   📄 **Archivos `.json` de correcciones probabilísticas** 
    *   (`statistical_base_weights_fit_v2.json`, `classwise_bias_corrections_v1.json`, etc.): Son pesos estadísticos calculados externamente (Python/R) para controlar el comportamiento del recalibrador en JavaScript.
*   📄 **`semiology_profiles.json`** & **`dermatology_reasoning_map.json`**
    *   Bases de conocimiento explícitas generadas desde las guías de dermatología sobre el "espacio" probabilístico de perfiles semiológicos para reeducar la retroalimentación del motor.

---

## 💡 Resumen de Arquitectura y Conclusiones del Repositorio

La integridad del CDSS tiene una madurez técnica elevada. Usa una metodología robusta llamada **Neuro-Simbólica** o *Hybrid AI*:
1.  Utiliza una IA predictiva (*Probabilistic Engine* con un *Random Forest*) como base estadística subyacente.
2.  Lo "envuelve" en reglas Determinísticas (Knowledge-based o Base de Reglas como el *Safety Modifier* y *Cardinal Rules*).

**Aspectos Brillantes de este Repo:**
*   Está totalmente desacoplado de un framework pesado (como React o Angular). Usando JS vainilla con un bundle nativo (`type: module`), puede correr puramente en PWA/Desktop Local sin necesidad de APIs costosos ni latencias en backend.

**Riesgo Recurrente Identificado:**
*   **La fragilidad del Flujo de Features**: Tal como lo vimos, la UI, el `concept_mapper` y los `constants.js` deben compartir 100% las mismas etiquetas de características. Si en los "Constants" dice `cronico` pero el usuario/dataset dice `chronic` y el *Feature Encoder* no tiene el diccionario correctamente mapeado en el **Canonical Map**, el Motor de ML asume un "0" y falla de manera silenciosa. La lógica *Fuzzy* que recién creamos mitiga estructuralmente este riesgo para el futuro de DermatoTriage.
