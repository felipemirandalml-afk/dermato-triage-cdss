# La Mina de Oro: Potencial Latente de los Datos (Fase 14)

Este reporte identifica el conocimiento clínico presente en los **4,426 perfiles** que el sistema DermatoTriage todavía no explota de forma óptima.

## 1. Oportunidades Cromáticas Sub-explotadas
- **Color Azul / Violáceo**: Tienen un **LC Score > 4.0** (Mod/Alto) pero el motor actual los trata como ruido de "mancha" genérica.
- **Acción**: Separar los pesos de color para favorecer a `venous_lake`, `lichen_planus` o `vasculitis` cuando se marca color violáceo/azul.

## 2. Oportunidades de Patrones Geométricos
- **Anular / Lineal**: Estos patrones son **altamente específicos para Tiñas y Fenómenos de Koebner**. 
- **Acción**: Implementar multiplicadores de boost cuando se marca "patrón lineal" para desplazar las dermatosis inflamatorias genéricas.

## 3. Oportunidades Topográficas (Inferencia de Hábitat)
- **Palmas y Plantas**: Tienen un valor discriminativo inmenso para Pustulosis, Tiñas y Sífilis secundaria.
- **Acción**: Forzar que el **Differential Ranker** penalice diagnósticos que no suelen ocurrir en estas zonas (ej. Acné) y potencie los que sí.

## 4. Oportunidades de "Rarezas Consistentes"
- **Entidades Huérfanas**: Existen diagnósticos con perfiles extremadamente consistentes en el dataset (ej: Sarcoidosis, Pityriasis Rubra Pilaris) que el ranker ignora al ser superados por la masa crítica de Psoriasis/Eczema.
- **Acción**: Crear un sub-motor de **"Detección de Rarezas"** que alerte al médico cuando se detecta un patrón patognomónico de una enfermedad poco común pero severa.

## 5. Conclusión
El motor actual es bueno filtrando ruido, pero "tímido" capturando señales raras. La base de datos contiene la suficiente información para que DermatoTriage sea un **CDSS experto en diagnóstico diferencial de precisión**, más allá de un simple triage de APS.
