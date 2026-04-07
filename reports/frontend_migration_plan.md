# Plan de Migración de UI a Framework Frontend (React / Vue)

Este documento detalla la estrategia conceptual para migrar el monolito de `index.html` y `ui.js` del DermatoTriage CDSS hacia un ecosistema moderno basado en componentes (como **React.js** o **Vue.js**), manteniendo intacto el "Cerebro Clínico" (`runtime/engine`).

---

## 1. Consecuencias de usar un Framework (Pros y Contras)

### 🔴 Las Desventajas (El Precio a Pagar)
1. **Adiós a la Simplicidad Absoluta (No más "abrir y listo"):** Actualmente, puedes tomar la carpeta de DermatoTriage, meterla en un pendrive y abrir `index.html` en cualquier computadora vieja de un hospital y funcionará. Con un framework, necesitas un paso de "compilación" (`npm run build`). No podrás editar un archivo y ver el resultado saltándote el servidor de desarrollo.
2. **Dependencias y Peso Estructural:** El sistema pasará a depender del ecosistema de Node (`node_modules`). Cosas simples como actualizar el proyecto pueden requerir gestionar parches de seguridad de librerías de terceros (React, Vite, etc.).
3. **Curva de Aprendizaje:** El equipo médico-técnico ahora deberá entender conceptos de programación más avanzados (Reactividad, Ciclo de vida de componentes, Virtual DOM).

### 🟢 Las Ventajas (El Superpoder de la Escala)
1. **Romper el Monolito (Componentización):** Un archivo de 600 líneas se convierte en 10 archivos de 60 líneas. Todo tiene su propio espacio (ej: el botón de validación, la tarjeta P1, la advertencia médica).
2. **Reactividad Automática:** Ya no tendrás que escribir código manual como `if (isMet) btn.classList.remove('hidden')`. En un framework tú simplemente dices "Si faltan datos, el botón es gris" y el sistema observa la variable y lo cambia instantáneamente.
3. **Reutilización Masiva:** Podrías crear un `<SkinSymptomCheckbox id="papula" label="Pápula" />` y usarlo 50 veces sin re-escribir lógica en el HTML.
4. **Mantenibilidad a Largo Plazo:** Si el Ministerio de Salud pide agregar un "DermatoTriage Pediátrico", hacerlo con React significa simplemente agregar una nueva "Ruta" y reusar el 90% del trabajo ya hecho.

---

## 2. Mapa Arquitectónico de la Migración

La migración no tocaría el motor médico (`runtime/engine`), el cual ha demostrado ser excelente. Solo transformará la "Capa de Presentación".

### A. Nueva Estructura de Carpetas Sugerida (Frontend Modermizado)
```text
/src
 ├── /engine                  -> (Se queda igual: modelo Random Forest, Concept Mapper, etc.)
 ├── /components              -> (Nuevas piezas de Lego de la UI)
 │    ├── /form                
 │    │    ├── TabNavigator.jsx
 │    │    ├── ClinicalCheckbox.jsx
 │    │    └── PatientCoreData.jsx
 │    ├── /results            
 │    │    ├── UrgencyCard.jsx    -> ResultCard actual
 │    │    ├── MLProgressPanel.jsx-> Barra de progreso de Sindromes
 │    │    └── ReasoningAlerts.jsx-> Alertas de reglas
 │    └── /shared             
 │         └── ClinicalBadge.jsx
 ├── /store                   -> (Manejo de estado global: qué pestañas están activas, formData)
 ├── App.jsx                  -> (El nuevo orquestador visual, reemplaza index.html)
 └── main.jsx                 -> (Punto de entrada)
```

### B. El Plan de 3 Fases

**Fase 1: Preparación (Vite + React/Vue)**
* Eliminar el "Vanilla Server".
* Levantar un proyecto base súper rápido usando una herramienta llamada **Vite**.
* Aislar el motor clínico actual para certificar que puede ser importado como una librería puramente matemática sin depender de la UI.

**Fase 2: Estrangulando la UI (El Patrón de Componentes)**
* Traducir el inmenso `index.html` en pequeños componentes (`.jsx` o `.vue`).
* Mover las clases de Tailwind de `ui.js` directamente al render de los componentes.
* Crear un "Estado Central" que rastree la progresión clínica (Paso 1, 2, 3) y la recolección automática del formulario (remplazando la manualidad de `form.querySelectorAll`).

**Fase 3: Integración de Inferencia**
* Instanciar el orquestador (`model.js`) dentro de la nueva UI y pasarle el "Estado Central" cada vez que se hace clic en "Analizar".
* Mapear la respuesta probabilística a las visuales (`ResultRenderer` atomizado).

---
*Documento generado conceptualmente - No se ha modificado ningún archivo base del repositorio.*
