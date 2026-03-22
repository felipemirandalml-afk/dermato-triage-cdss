# Panel de Casos Manuales v2.0 (Fase 19)

Este panel muestra cómo el motor de DermatoTriage CDSS razona ante casos clínicos "textbook" tras la re-normalización v2.

## Caso 1: Herpes Zóster Clínico
- **Input**: Eritema, Vesículas, Dolor, Patrón Zosteriforme.
- **Output v1**: `inflammatory_dermatosis_other` (Incorrecto - Agujero Negro).
- **Output v2**: `viral_skin_infection` (Correcto - Rescatado).
- **Interpretación**: El RPR de 15.7x de la vesícula y 30.7x del patrón zosteriforme lograron por primera vez superar el sesgo basal de la IA.

## Caso 2: Acné Vulgar
- **Input**: Comedón, Pápula, Pústula, Cara.
- **Output v1**: `inflammatory_dermatosis_other` (Correcto por defecto, pero mal explicado).
- **Output v2**: `appendage_disorders_acne` (Correcto - Fragmentado).
- **Interpretación**: El comedón posee ahora su propio síndrome, logrando separarse de la dermatitis inespecífica.

## Caso 3: Psoriasis Vulgar
- **Input**: Placa, Escama, Eritema, Rodillas.
- **Output v1**: `inflammatory_dermatosis_other` (Incorrecto).
- **Output v2**: `psoriasiform_dermatosis` (Correcto).
- **Interpretación**: Las escamas plateadas sobre-representan al síndrome psoriasiforme en 7.5x, superando el ruido basal.

## Caso 4: Tiña Corporal (Fúngico)
- **Input**: Placa, Patrón Anular, Eritema.
- **Output v1**: `inflammatory_dermatosis_other` (Incorrecto).
- **Output v2**: `fungal_skin_infection` (Correcto).
- **Interpretación**: El patrón anular es ahora un fuerte ancla fúngica (RPR 7.8x).

## Conclusión Clínica del Panel
La v2.0 ha funcionado **extraordinariamente bien** para casos textbook. El sistema ha recuperado la capacidad de "ver" las anclas clásicas que antes eran ignoradas por la masa crítica del volumen de entrenamiento.
