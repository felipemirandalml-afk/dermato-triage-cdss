# Auditoría del Cerebro Sindrómico Basal v1.0 (Phase 22)

Este reporte detalla cómo está diseñado el "pensamiento basal" de DermatoTriage CDSS y por qué ha llegado a un plateau estructural.

## 1. Funcionamiento del Baseline Actual
El motor sindrómico es una **Regresión Logística Multinomial (Softmax)** que proyecta 83 features en 12 categorías de forma competitiva.

### A. El Dilema de la Exclusividad Mutua
La función **Softmax** asume que un paciente tiene **Exactamente Un Síndrome**. Esto obliga a los 11 síndromes a "robar" probabilidad de los demás. En dermatología, donde la infección bacteriana puede coexistir con un eczema (sobreinfección), este diseño arquitectónico es **clínicamente limitante**.

### B. Dilución de Señal
Ante la falta de anclas fuertes, la probabilidad se fragmenta (ej. 15%, 12%, 18%...). En este estado de baja confianza, la **Gravedad del Intercepto** (Phase 21) atrae la predicción hacia la clase más poblada, incluso tras la corrección NIR.

## 2. Mapa de Fallas por Diseño
- **Linealidad Rígida**: El modelo asume que `eritema` + `prurito` siempre suma lo mismo, sin importar si están en la cara o en los pies (salvo por algunas interacciones discretas).
- **Desprecio por la Jerarquía**: El modelo intenta decidir entre `Eczema` y `Viral` al mismo nivel y al mismo tiempo. Un médico primero descarta lo "Agudo/Infeccioso" antes de refinar lo "Crónico/Inflamatorio".

## 3. Conclusión: Techo Estructural
El sistema ha alcanzado el **limite de representación** de un modelo lineal de Softmax plano.
Ajustar los pesos basales o agregar más casos sintéticos no cambiará el hecho de que la arquitectura competitiva diluye la señal diagnóstica en lugar de destilarla jerárquicamente.
