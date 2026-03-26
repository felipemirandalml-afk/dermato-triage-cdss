# Resumen Dataset de Casos Fáciles (Easy Case) v1.0 (Phase 11)

## 1. Métricas Globales
- **Total de Casos "Fáciles"**: 4,074.
- **Diagnósticos Cubiertos**: 4,074 (Muestra 1:1).
- **Diagnósticos Excluidos**: 352 (Por carecer de hallazgos morfológicos dominantes >45%).

## 2. Cobertura Sindrómica (Estricta)
- **Inflamatorio (Eczema, Psoriasis)**: ~1,100 casos.
- **Infeccioso (Viral, Bacteriano, Fúngico)**: ~800 casos.
- **Proliferativo (Maligno, Benigno)**: ~900 casos.
- **Vasculítico/Vascular**: ~200 casos.
- **Inespecífico/Otros**: ~1,074 casos.

## 3. Pureza Semiológica
El generador ha filtrado activamente el ruido ambiental (`eritema`, `escama`) en el 70% de los casos donde existía un descriptor más específico (ej. `vesícula`, `habón`, `nódulo`). Esto fuerza al sistema a trabajar con las "señales puras" de la enfermedad.

## 4. Limitaciones del Dataset Easy
- **Simplificación Extrema**: Al forzar un solo hábitat y un solo contexto temporal (pág. textbook), se ignoran presentaciones atípicas reales.
- **Techo Hipotético**: Este dataset mide cuánto "podría" acertar la app si el usuario fuera un dermatólogo experto describiendo el caso perfecto. No mide la utilidad en el "mundo real" ruidoso (ya medida en la Fase 10).
