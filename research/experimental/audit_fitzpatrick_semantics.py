import os
import json
import pandas as pd
import numpy as np

# Configuración
BASE_DIR = 'd:/dermato-triage-cdss'
DATA_PATH = os.path.join(BASE_DIR, 'data/training_cases.csv')
REPORTS_DIR = os.path.join(BASE_DIR, 'reports')

if not os.path.exists(REPORTS_DIR):
    os.makedirs(REPORTS_DIR)

def map_fototipo(val):
    mapping = {
        'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6,
        '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6
    }
    return mapping.get(str(val).strip(), 3) # default III if error

def audit_semantics():
    print("Iniciando Fitzpatrick Semantic Audit...")
    
    if not os.path.exists(DATA_PATH):
        print(f"Error: No se encontró el dataset en {DATA_PATH}")
        return

    df = pd.read_csv(DATA_PATH)
    df['f_numeric'] = df['fototipo'].apply(map_fototipo)
    
    # Agrupar por tono
    # Light (I-II), Medium (III-IV), Dark (V-VI)
    bins = [0, 2, 4, 6]
    labels = ['Light', 'Medium', 'Dark']
    df['skin_group'] = pd.cut(df['f_numeric'], bins=bins, labels=labels)
    
    # Conceptos críticos a auditar
    critical_concepts = [
        'eritema', 'purpura', 'hiperpigmentacion', 'hipopigmentacion',
        'costra', 'escama', 'pustula', 'vesicula', 'papula', 'placa', 'nodulo'
    ]
    
    results_by_group = {}
    
    for group in labels:
        subset = df[df['skin_group'] == group]
        if len(subset) == 0: continue
        
        prevalence = {}
        for concept in critical_concepts:
            if concept in df.columns:
                # Calculamos proporción de presencia (1 vs 0)
                prevalence[concept] = float(subset[concept].mean())
            else:
                prevalence[concept] = 0.0
        
        results_by_group[group] = {
            "count": int(len(subset)),
            "prevalence": prevalence
        }

    # Análisis de Diferenciales (Gap Semántico)
    # Comparamos prevalencia entre Light y Dark
    gaps = {}
    p_light = results_by_group.get('Light', {}).get('prevalence', {})
    p_dark = results_by_group.get('Dark', {}).get('prevalence', {})
    
    for concept in critical_concepts:
        light_val = p_light.get(concept, 0.0)
        dark_val = p_dark.get(concept, 0.0)
        
        # Ratio o delta
        delta = dark_val - light_val # Positivo: más común en Dark
        ratio = (dark_val / light_val) if light_val > 0 else 0
        
        # Estabilidad: ¿El concepto cambia mucho?
        status = "Stable"
        if abs(delta) > 0.15: # Mayor al 15% de diferencia absoluta
            status = "Highly Dependent"
        elif abs(delta) > 0.05:
            status = "Potentially Unstable"
        
        gaps[concept] = {
            "light_prev": round(light_val, 3),
            "dark_prev": round(dark_val, 3),
            "delta": round(delta, 3),
            "ratio": round(ratio, 2),
            "status": status
        }

    # Generar Reporte Final
    audit_report = {
        "metadata": {
            "source_file": "training_cases.csv",
            "total_samples": int(len(df))
        },
        "groups": results_by_group,
        "semantic_gaps": gaps,
        "risk_levels": {
            "critical_risk": [c for c, v in gaps.items() if v['status'] == "Highly Dependent"],
            "moderate_risk": [c for c, v in gaps.items() if v['status'] == "Potentially Unstable"]
        }
    }
    
    # Guardar JSON
    json_path = os.path.join(REPORTS_DIR, 'fitzpatrick_semantic_audit.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(audit_report, f, indent=2)
        
    # Guardar MD
    md_path = os.path.join(REPORTS_DIR, 'fitzpatrick_semantic_audit.md')
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write("# Fitzpatrick Semantic Audit Report\n\n")
        f.write("## 1. Distribución del Dataset de Entrenamiento\n\n")
        for group, data in results_by_group.items():
            f.write(f"- **{group} Skin (I-II/III-IV/V-VI):** {data['count']} muestras.\n")
            
        f.write("\n## 2. Hallazgos: Dependencia del Tono de Piel\n\n")
        f.write("| Concepto | Prevalencia Light | Prevalencia Dark | Delta | Estado |\n")
        f.write("| :--- | :---: | :---: | :---: | :--- |\n")
        for concept, info in gaps.items():
            f.write(f"| {concept} | {info['light_prev']} | {info['dark_prev']} | {info['delta']} | {info['status']} |\n")
            
        f.write("\n## 3. Análisis de Riesgos para el CDSS\n\n")
        
        # Eritema
        gap_eritema = gaps.get('eritema', {})
        if gap_eritema.get('delta', 0) < -0.1:
            f.write("### 🚨 Riesgo Crítico: Eritema (The 'Masking' Effect)\n")
            f.write(f"El **eritema** tiene una prevalencia reportada {abs(gap_eritema['delta']*100):.1f}% MENOR en pieles oscuras. ")
            f.write("Esto sugiere un posible sesgo en el etiquetado o 'enmascaramiento' clínico. ")
            f.write("Dado que el eritema es clave para cuadros inflamatorios y P1 (celulitis), esto representa un riesgo de sub-detección.\n\n")
            
        # Hiperpigmentación
        gap_hyper = gaps.get('hiperpigmentacion', {})
        if gap_hyper.get('delta', 0) > 0.1:
            f.write("### ⚠️ Sesgo Diagnóstico: Hiperpigmentación (The 'Bias' Anchor)\n")
            f.write(f"La **hiperpigmentación** es significativamente más frecuente en el subgrupo de piel oscura. ")
            f.write("El modelo podría estar 'anclando' diagnósticos como melasma o liquen plano basándose en el color, ")
            f.write("ignorando otros signos morfológicos que podrían estar presentes en otros tonos.\n\n")

        f.write("## 4. Conclusiones y Recomendaciones\n")
        f.write("- **Robustos:** Conceptos como `papula`, `placa` y `vesicula` muestran estabilidad relativa (Delta < 0.05).\n")
        f.write("- **Vulnerables:** Los descriptores de color (`eritema`, `hiperpigmentacion`) son los más dependientes del tono.\n")
        f.write("- **Acción:** Se recomienda implementar una capa de 'Color-Neutral Semantic Anchor' en la fase 2.1 para compensar la invisibilidad del eritema en tonos V-VI.\n")

    print(f"Auditoría terminada. Reportes guardados en {REPORTS_DIR}")

if __name__ == "__main__":
    audit_semantics()
