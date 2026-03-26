import pandas as pd
import json
import os
from collections import defaultdict

# Configuración
INPUT_CSV = 'data/derm1m/concept.csv'
OUTPUT_JSON = 'engine/dermatology_concept_profiles.json'

# Mapeo de conceptos Derm1M -> Features DermatoTriage
CONCEPT_MAPPING = {
    'macule': 'lesion_macula',
    'papule': 'lesion_papula',
    'plaque': 'lesion_placa',
    'pustule': 'lesion_pustula',
    'vesicle': 'lesion_vesicula',
    'bulla': 'lesion_ampolla',
    'ulcer': 'lesion_ulcera',
    'crust': 'lesion_costra',
    'crusted': 'lesion_costra',
    'erosion': 'lesion_erosion',
    'excoriation': 'lesion_excoriacion',
    'lichenification': 'lesion_liquenificacion',
    'nodule': 'lesion_nodulo',
    'cyst': 'lesion_quiste',
    'induration': 'lesion_induracion',
    'telangiectasia': 'lesion_telangiectasias',
    'atrophy': 'lesion_atrofia',
    'wheal': 'lesion_habon',
    'comedo': 'lesion_comedon',
    'burrow': 'lesion_surco',
    'brown(hyperpigmentation)': 'hiperpigmentacion',
    'white(hypopigmentation)': 'hipopigmentacion',
    'erythema': 'eritema',
    'scale': 'lesion_escama'
}

def analyze_and_build():
    if not os.path.exists(INPUT_CSV):
        print(f"Error: {INPUT_CSV} not found.")
        return

    print(f"Loading {INPUT_CSV}...")
    df = pd.read_csv(INPUT_CSV)
    
    # Algunas filas pueden tener NaNs o valores no strings
    df = df.dropna(subset=['disease_label', 'skin_concept'])
    
    disease_profiles = defaultdict(lambda: defaultdict(int))
    disease_counts = defaultdict(int)
    all_mapped_concepts = set(CONCEPT_MAPPING.values())
    
    print("Processing concepts...")
    for idx, row in df.iterrows():
        disease = row['disease_label'].strip().lower()
        concepts_raw = str(row['skin_concept']).lower()
        
        # El CSV puede tener múltiples conceptos separados por coma
        concepts_list = [c.strip() for c in concepts_raw.split(',')]
        
        # Incrementar contador de casos para la enfermedad
        # Nota: Aquí contamos el número de imágenes/entradas
        disease_counts[disease] += 1
        
        # Marcar qué conceptos mapeados están presentes en esta entrada
        present_features = set()
        for c in concepts_list:
            if c in CONCEPT_MAPPING:
                present_features.add(CONCEPT_MAPPING[c])
        
        for feat in present_features:
            disease_profiles[disease][feat] += 1

    # Calcular frecuencias finales y filtrar
    final_profiles = {}
    total_unique_concepts = set()
    
    for disease, profile in disease_profiles.items():
        total_cases = disease_counts[disease]
        # Solo procesar si tenemos suficientes datos? El usuario no especificó mínimo de casos, 
        # pero sí filtrar frecuencia > 0.2
        
        filtered_profile = {}
        for feat, count in profile.items():
            freq = count / total_cases
            if freq > 0.2:
                filtered_profile[feat] = round(freq, 3)
                total_unique_concepts.add(feat)
        
        if filtered_profile:
            final_profiles[disease] = filtered_profile

    # Guardar JSON
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(final_profiles, f, indent=2)

    # Resumen
    print("\n" + "="*50)
    print("RESUMEN DE PROCESAMIENTO")
    print("="*50)
    print(f"Número de enfermedades detectadas (con conceptos > 0.2): {len(final_profiles)}")
    print(f"Número total de conceptos únicos mapeados: {len(total_unique_concepts)}")
    
    # Top 10 conceptos más frecuentes (en términos de cuántas enfermedades los incluyen)
    concept_freq = defaultdict(int)
    for p in final_profiles.values():
        for feat in p:
            concept_freq[feat] += 1
    
    top_concepts = sorted(concept_freq.items(), key=lambda x: x[1], reverse=True)[:10]
    print("\nTop 10 conceptos más frecuentes (por número de enfermedades):")
    for concept, count in top_concepts:
        print(f"- {concept}: {count} enfermedades")

    # Top 10 enfermedades con más datos (según conteo original en CSV)
    top_diseases = sorted(disease_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    print("\nTop 10 enfermedades con más datos en CSV:")
    for disease, count in top_diseases:
        print(f"- {disease}: {count} registros")

if __name__ == "__main__":
    analyze_and_build()
