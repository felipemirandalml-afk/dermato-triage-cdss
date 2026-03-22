# Matriz de Explicabilidad Contextual de Gestalts (Fase 14)

Esta matriz justifica los futuros multiplicadores de peso (Gestalt Boosts) basándose en la **Ganancia Incremental** de las tríadas sobre los pares.

## 1. Clasificación de Gestalts por Poder Resolutivo

| Gestalt (Tríada) | Boost Propuesto | Razón Clínica (Teórica) | Ganancia Incremental |
| :--- | :---: | :--- | :--- |
| **Acneiforme** (Comedón + Quiste + Pústula) | **Extremo (x2.0)** | Patognomónico (Acné Profundo). | 35.2 (vía pares) |
| **Zosteriforme** (Vesícula + Eritema + Zóster) | **Alto (x1.8)** | Patognomónico (Zoster). | 50.5 (sobre pares) |
| **Psoriasiforme** (Placa + Escama + Extensor) | **Alto (x1.6)** | Clúster Psoriasiforme Puro. | 85.8 (sobre pares) |
| **Ampolloso** (Bula + Erosión + Costra) | **Medio (x1.4)** | Define pérdida de continuidad. | (Alta especificidad) |
| **Pustuloso** (Pústula + Eritema + Pápula) | **Medio (x1.4)** | Cuadros pio-inflamatorios. | 62.4 (sobre pares) |

## 2. El "Freno" del Ruido Inflamatorio
- **Tríada**: Eritema + Pápula + Escama.
- **Boost Sugerido**: **Sustantividad Negativa (-0.2x)**. 
- **Razón**: Si el usuario solo marca estos tres descriptores de alta frecuencia e inespecíficos, el sistema **no debe forzar un diagnóstico puntual**. Debe alertar de "Dermatosis Inflamatoria Inespecífica" para evitar falsos positivos por azar estadístico.

## 3. Hoja de Ruta Previa a la Recalibración (Fase 7)
1. **Fase A (Gestalts Críticos)**: Implementar boosters de tríada para Acné, Zóster y Psoriasis.
2. **Fase B (Inhibición de Ruido)**: Implementar el "Freno Inflamatorio" para reducir el overcalling del motor.
3. **Fase C (Ampliación del Color)**: Incorporar pesos pesados para los colores violáceo, azul y negro para mejorar la detección de tumores melanocíticos y vasculares.
