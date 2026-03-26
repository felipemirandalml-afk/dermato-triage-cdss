# Mapa de Anclas y Ruido Combinados: Análisis Co-ocurrencia (Fase 13)

El valor de un descriptor clínico no es estático; se multiplica o se anula según sus acompañantes. Este mapa cuantifica dicho efecto estadístico.

## 1. Anclas Combinadas (High Signal Boosters)

| Combinación | Lift | LC Score | Valor Clínico |
| :--- | :---: | :---: | :--- |
| **Comedón + Quiste** | 15.24 | **13.96** | Patognomónico de Acné/Inflamatorio Profundo. |
| **Cupuliforme + Umbilicación** | 8.32 | **7.62** | Señal de alta fidelidad para Infección Viral (Molusco). |
| **Vesícula + Bula/Ampolla** | 8.66 | **5.77** | Define el clúster ampolloso; reduce el ruido de pápulas. |
| **Excoriación + Liquenif.** | 6.32 | **5.26** | Indica cronicidad por rascado (Eczema). |
| **Vesícula + Zoster** | 4.58 | **3.05** | Aunque el Lift es alto, aparece en múltiples contextos (Viral/Infecto). |

## 2. Ruido Combinado (Signal Neutralizers)

| Combinación | LC Score | Efecto |
| :--- | :---: | :--- |
| **Pápula + Umbilicación** | 1.90 | La pápula "ensucia" la umbilicación, sugiriendo cuadros más inespecíficos. |
| **Comedón + Hiperpigm.** | 1.98 | Frecuente pero inespecífico tras fase inflamatoria (Ruido post-acné). |
| **Eritema + Escama** | (Bajo) | El par más ubicuo del dataset; aporta poco valor diferencial aislado. |

## 3. Topografías que Redirigen la Señal
- **Vesícula + Palmas**: Redirige del clúster Viral al clúster Eczematoso (Deshidrosis) o Infeccioso (Mano-Pie-Boca).
- **Comedón + Cara**: Refuerza la señal de Acné al máximo nivel de probabilidad.
- **Púrpura + Piernas**: Señal clásica de Vasculitis (Vascular).
