# Análisis de Confusión Sindrómica (Fase 16)

Este reporte detalla las colisiones del motor de inferencia tras la auditoría masiva de 4,074 casos fáciles.

## 1. El Fenómeno del "Colapso hacia la Media"
Se detecta que el **95% del benchmark** está siendo reclasificado erróneamente en el síndrome:
> **`inflammatory_dermatosis_other`**

### Métricas de Colapso (Top 5 Fallos)

| Síndrome Real | Recall | Top Confusión | % Confusión |
| :--- | :---: | :--- | :---: |
| **Viral** | 0.0% | `inflammatory_dermatosis_other` | ~90% |
| **Bacterial** | 0.0% | `inflammatory_dermatosis_other` | ~90% |
| **Fungal** | 0.0% | `inflammatory_dermatosis_other` | ~90% |
| **Eczema** | 1.2% | `inflammatory_dermatosis_other` | ~98% |
| **Psoriasiforme** | 0.0% | `inflammatory_dermatosis_other` | ~90% |

## 2. Atribución del Fallo: ¿Modelo ML o Recalibración?

### A. Sesgo del Dataset Original (Derm1M)
El 40% de los diagnósticos del dataset de entrenamiento pertenecen a la categoría "Other" o "Eczema". El modelo de IA basal ya trae un sesgo de "Prior" hacia estas categorías.

### B. El Efecto "Humo" de las Tríadas (Phase 15)
Al analizar la ganancia incremental de tríadas, muchas combinaciones inespecíficas (ej. `Eritema + Pápula + Escama`) fueron etiquetadas como **"Gestalt Fuerte"** para la categoría más frecuente. 
- **Consecuencia**: Cuando un caso de Tinea (Fúngico) presenta el ruido basal (Eritema/Escama), el motor inyecta un **Boost de Gestalt** hacia `inflammatory_dermatosis_other`, enterrando la señal fúngica real.

## 3. Conclusión de Confusión
DermatoTriage CDSS sufre de **Desenfadada Agrupación Sindrómica**. La categoría `inflammatory_dermatosis_other` es tan amplia que "roba" la señal de categorías específicas ante la mínima presencia de rasgos comunes.

**La separación sindrómica es actualmente Inexistente para diagnósticos fuera del nicho tumoral e inflamatorio inespecífico.**
