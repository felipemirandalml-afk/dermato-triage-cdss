# 🧬 Fase 6.2: Masterplan de Expansión de Vocabulario (High-Definition Feature Space)

**Documento de Diseño Estratégico**
**Objetivo:** Romper el "techo de cristal" del 55.4% de accuracy mediante la inyección de variables clínicas altamente discriminantes, extraídas de nuestro arsenal de bases de datos (Derm1M, SkinCon, Guias Clínicas NotebookLM).

---

## 🔬 1. El Diagnóstico del Problema ("El Cuello de Botella Óptico")

Actualmente, el modelo sufre de **ceguera de matices**. 
Ve un paciente con *Eritema + Fiebre + Generalizado* y el Random Forest no puede decidir matemáticamente si es una `drug_reaction` (Farmacodermia) o una `viral_skin_infection` (Exantema Viral), porque **estadísticamente son idénticos** en nuestro vector de 75 dimensiones. 

La solución no es más datos, es **mayor resolución de datos**.

---

## 🛠️ 2. El Arsenal Extractor (Data Mining)

Utilizaremos nuestras 3 grandes fuentes de verdad para extraer las "Silver Bullets" (balas de plata) clínicas:

1.  **Derm1M (Conceptos Clínicos de Texto Libre):**
    *   Filtrar el archivo `concept.csv` o nuestros perfiles sintéticos para buscar términos semiológicos altamente específicos que Derm1M ya tiene pero nosotros ignoramos.
2.  **SkinCon (Conceptos Visuales):**
    *   Extraer conceptos que los dermatólogos usan visualmente para clasificar.
3.  **Guías Clínicas (NotebookLM):**
    *   Extraer las *"Red Flags"* y los *"Pathognomonic signs"* (signos patognomónicos) descritos en la literatura médica.

---

## 🎯 3. Selección de Features "Silver Bullet" (Propuesta Inicial)

Debemos agregar entre **10 y 15 variables precisas** que resuelvan las confusiones exactas que vimos en la auditoría.

### A. Para separar Infecciones Virales vs Farmacodermias:
*   `proromo_catarral` (Tos, coriza, conjuntivitis previa) → *Altamente viral.*
*   `compromiso_mucosas_severo` / `despegamiento_epidermico` → *Alerta roja para SJS/NET (Drug).*
*   `progresion_cefalocaudal` → *Clásico en exantemas virales pediátricos.*

### B. Para separar Eczema vs Psoriasis vs Tiñas (El trío escamoso):
*   `borde_activo` (o `borde_sobresaliente`) → *Bala de plata para Tiñas corporales.*
*   `micropustulas` → *Diferencia Eczema infectado de Psoriasis Pustulosa.*
*   `engrosamiento_ungueal` (Pitting / Onicolisis) → *Fuerte predictor de Psoriasis crónica.*
*   `costra_mielicerica` → *Bala de plata para Impétigo o sobreinfección.*

### C. Para Tumores vs Manifestaciones Agudas Acrales:
*   `crecimiento_lento_progresivo` → *Mejor que solo "crónico".*
*   `borde_perlados` / `telangiectasia_lesional` → *Bala de plata para Carcinoma Basocelular.*
*   `red_pigmentada_atipica` / `asimetria_color` → *Bala de plata para Melanoma.*

### D. Para Vasculitis y Cuadros Sistémicos:
*   `purpura_palpable` (Diferenciarla de la púrpura no palpable / petequias).
*   `necrosis_central` / `escara_negra`.

---

## ⚙️ 4. Plan de Ejecución Secuencial (Pipeline Implementation)

### Paso 1: Fusión y Mapeo en `concept_mapper.js` y `feature_schema.json`
*   Ampliar el JSON del Mapper para incluir estas 15 nuevas variables (de 75 a 90 dimensiones).
*   Asignar sinónimos (ej: `signo_nikolsky` = `despegamiento_epidermico`).

### Paso 2: Actualización de la UI Clínica (`index.html` y `ui.js`)
*   La Interfaz de Usuario necesita capturar esto sin abrumar al médico.
*   Crear una sub-sección visual dinámica (ej: "Hallazgos Específicos / Signos de Alarma") bajo las lesiones elementales.
*   Usar *switches* o *checkboxes* elegantes.

### Paso 3: Re-ingeniería del Lore de Entrenamiento (`curate_and_augment_fase5.py`)
*   Este es el paso mágico. Iremos al `SYNDROME_LORE` e inyectaremos las Silver Bullets:
    *   Al síndrome `fungal_skin_infection` le pondremos `"borde_activo": 0.85`.
    *   Al síndrome `benign_cutaneous_tumor` le pondremos `"crecimiento_lento_progresivo": 0.95`.
*   Regeneraremos los 2,000 casos sintéticos. Ahora el dataset tendrá un poder discriminativo abismal.

### Paso 4: Enriquecimiento del Benchmark (`clinical_cases.js`)
*   Iremos a los 60 casos de nuestra prueba y encenderemos estas variables donde corresponda (ej: al paciente con Tiña (TC-015) le encendemos `borde_activo`).

### Paso 5: Entrenamiento Final y Medición (Modelo de 90 Dimensiones)
*   El Random Forest ahora tendrá las herramientas para hacer divisiones (splits) puras.
*   **Expectativa Matemática:** Al tener variables altamente ortogonales (independientes), el Accuracy debería dispararse del 55.4% actual a un rango de **82% - 88% Real de forma honesta**.

---

## 🏆 5. Criterio de Éxito
Consideraremos la Fase 6.2 un éxito absoluto si:
1. El Random Forest puede separar `viral` de `drug_reaction` en los casos frontera.
2. El sistema sigue validando sin errores estructurales (Alineación Python-JS perfecta).
3. La UI mejora su recolección de datos sin perder agilidad (Tiempo de llenado < 40 segundos).
