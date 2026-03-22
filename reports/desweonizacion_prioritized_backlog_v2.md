# Backlog de Des-weonización v2.0 (Phase 10)

Tras el procesamiento de **18,397 casos sintéticos**, se han confirmado patrones de error que requieren intervenciones estructurales específicas. El sistema demuestra una **hipersensibilidad paralizante** ante el ruido semiológico y los disparadores de seguridad.

## 1. Prioridad Crítica: Inhibición de Ruido (Anti-Noise)
- **Problema**: Las variantes **BORDERLINE (5.6% de éxito)** demuestran que añadir `eritema` o `escama` anula la señal de descriptores específicos (ej: vesículas o habones).
- **Intervención**: Recalibrar los coeficientes del `probabilistic_model.js`. El eritema y la escama deben ser "características de fondo" con pesos mucho más bajos, permitiendo que las lesiones elementales específicas dominen la inferencia.
- **Capa**: `engine/model_coefficients.json`.

## 2. Calibración de Escudos de Seguridad (Anti-Stress)
- **Problema**: Las variantes **STRESS (3.3% de éxito)** muestran que el sistema "se asusta" con facilidad ante el dolor o la fiebre, forzando un síndrome bacteriano P1 erróneo.
- **Intervención**: Implementar reglas de **Exclusión de Escudo**. Por ejemplo: si hay `habones` (Urticaria) o `vesículas dermatómicas` (Zóster), la fiebre/dolor no debe forzar el síndrome `bacterial_skin_infection` a menos que haya signos de necrosis o shock.
- **Capa**: `model.js` / Rule Engine.

## 3. Resolución de la Inercia Inespecífica
- **Problema**: Los cuadros de Eczema y Psoriasis se diluyen en `inflammatory_dermatosis_other`.
- **Intervención**: Dotar de mayor peso estadístico a los descriptores de "Patrón" (acral, flexural, extensor) en el modelo probabilístico. Actualmente el modelo es "demasiado morfológico" y "poco anatómico".
- **Capa**: `engine/feature_encoder.js` (mejorar el vector de entrada) + Coeficientes.

---

# Limitaciones y Honestidad Metodológica (Fase 10)

- **Sesgo de Perfil**: El benchmark asume que los perfiles de Derm1M son "verdades puras", pero muchos perfiles contienen ruido estadístico heredado de su fuente original.
- **Prevalencia Equitativa**: El sistema trata con el mismo peso una enfermedad que ocurre 1/1,000,000 que una que ocurre 1/10. Esto puede distorsionar la percepción del error sindrómico si no se pondera por epidemiología real en el futuro.
- **Inferencia de Síndrome**: El 40% de los síndromes en el benchmark masivo fueron inferidos por nombre de la enfermedad (Heurística). Errores en esta inferencia pueden haber inflado artificialmente la tasa de fallos.
