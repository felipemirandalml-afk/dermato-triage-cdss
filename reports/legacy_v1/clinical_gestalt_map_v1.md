# Mapa de Gestalts Clínicos: Patrones Integrados (Fase 14)

Un **Gestalt** es la unidad mínima de reconocimiento clínico que permite a un experto diagnosticar un cuadro con alta confianza. Aquí se definen los gestalts detectados estadísticamente.

## 1. Gestalts de Alta Fidelidad (Anclas Tripulares)

| Gestalt | Componentes Clave | Valor Diagnóstico |
| :--- | :--- | :--- |
| **Acneiforme** | Comedón + Quiste + Pústula | **Absoluto**. Identifica foliculitis profunda / acné. |
| **Psoriasiforme**| Placa + Escama + Eritema | **Alto**. Separa del eczema por la solidez de la placa. |
| **Zosteriforme** | Vesícula + Eritema + Patrón Zoster. | **Crítico**. Ancla diagnóstica para Herpes Zóster. |
| **Pustulosis** | Pústula + Eritema + Pápula | **Útil**. Define cuadros infecciosos/reactivos agudos. |
| **Ampolloso** | Bula/Ampolla + Erosión + Costra | **Alto**. Define el clúster de pérdida de continuidad. |

## 2. El Gestalt del "Ruido Inflamatorio"
- **Composición**: `Eritema + Pápula + Escama`.
- **Análisis**: Es la tríada más frecuente del dataset (presente en cientos de diagnósticos). 
- **Efecto**: Actúa como un "agujero negro" de la inferencia. Si el usuario solo marca esto, el sistema se pierde en la inespecificidad.

## 3. Topografías que "Cierran" el Gestalt (Inferencia)
- **Acneiforme + Cara**: Cierra el diagnóstico de Acné Vulgar al 95%.
- **Psoriasiforme + Extensores**: Cierra el diagnóstico de Psoriasis Placa.
- **Vesicular + Palmas**: Rompe el gestalt Viral y lo mueve a Eczematoso (Deshidrosis).

## 4. Conclusión
La recalibración futura no debe basarse solo en pesos aislados, sino en **Bolas de Atractores (Gestalts)**. Si se detecta una tríada de Gestalt, el peso de los componentes debe multiplicarse por un factor de confianza superior.
