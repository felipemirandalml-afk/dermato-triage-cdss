# Reporte: Integración de Hallazgos Avanzados (UI v1.4.0)

## 1. Cambios en la Interfaz
Se ha implementado una nueva sección **"Hallazgos Avanzados (Opcional)"** en la pestaña de Semiología del formulario de triage. 

- **Diseño Ergonómico:** Se utiliza un contenedor de baja fricción (border dashed) para indicar opcionalidad, manteniendo el foco visual en el core del formulario.
- **Inyección de Descriptores:** Se añadieron 5 nuevos campos críticos:
    - **Morfología Fina:** Umbilicación, Forma Cupuliforme.
    - **Configuración:** Patrón Anular, Patrón Zosteriforme.
    - **Cromatismo:** Color Violáceo.

## 2. Conectividad con el Pipeline Canónico
La integración es totalmente transparente gracias a la arquitectura implementada en fases previas:
1. **Captura:** `ui.js` recolecta los IDs (ej: `lesion_umbilicacion`).
2. **Resolución:** `conceptMapper.resolve()` elimina el prefijo y mapea a `umbilicacion`.
3. **Inferencia:** El `differential_ranker.js` detecta este ID canónico en el perfil de enfermedades como el Molusco Contagioso y aumenta su score diferencial.

## 3. Beneficios Clínicos Detectados
- **Diferenciación de Herpes:** La selección de "Patrón Zosteriforme" ahora catapulta al Herpes Zóster al Top 1 de diferenciales, separándolo de cuadros bacterianos o de Herpes Simplex.
- **Identificación de Tiñas:** El "Patrón Anular" permite una discriminación más clara frente a la Psoriasis en placas.
- **Inclusión Fenotípica:** La inclusión de "Color Violáceo" permite al médico en APS reportar correctamente la inflamación en fototipos oscuros donde el eritema no es rojo brillante.

## 4. Pruebas de Estabilidad
Se verificó que la aplicación de estos hallazgos no afecta la seguridad P1 del sistema, ya que actúan como "boosters" semiológicos y no como disparadores de urgencia (salvo que existan criterios de necrosis adicionales).
