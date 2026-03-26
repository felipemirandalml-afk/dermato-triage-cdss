import os
import re
import csv
import json
import pandas as pd
from collections import defaultdict

# Configuración de rutas
BASE_DIR = 'd:/dermato-triage-cdss'
DATA_DIR = os.path.join(BASE_DIR, 'data')
ENGINE_DIR = os.path.join(BASE_DIR, 'engine')
TOOLS_DIR = os.path.join(BASE_DIR, 'tools')
REPORTS_DIR = os.path.join(BASE_DIR, 'reports')

PATHS = {
    'derm1m': os.path.join(DATA_DIR, 'derm1m/concept.csv'),
    'skincon': os.path.join(DATA_DIR, 'skincon/skincon_fitzpatrick17k.csv'),
    'constants': os.path.join(ENGINE_DIR, 'constants.js'),
    'rules': os.path.join(ENGINE_DIR, 'cardinal_feature_rules.js'),
    'safety': os.path.join(ENGINE_DIR, 'safety_modifiers.js'),
    'context': os.path.join(ENGINE_DIR, 'context_modifiers.js'),
    'ui_html': os.path.join(BASE_DIR, 'index.html'),
    'probabilistic_model': os.path.join(ENGINE_DIR, 'probabilistic_model.js'),
    'semiology_profiles': os.path.join(ENGINE_DIR, 'semiology_profiles.json')
}

if not os.path.exists(REPORTS_DIR):
    os.makedirs(REPORTS_DIR)

def extract_derm1m_concepts(path):
    if not os.path.exists(path): return set()
    df = pd.read_csv(path)
    concepts = set()
    for row in df['skin_concept'].dropna():
        for c in row.split(','):
            concepts.add(c.strip().lower())
    return concepts

def extract_skincon_concepts(path):
    if not os.path.exists(path): return set()
    # Leer solo cabeceras
    with open(path, 'r', encoding='utf-8') as f:
        header = f.readline()
    cols = [c.strip() for c in header.split(',')]
    # Ignorar columnas no conceptuales (metadatos)
    meta = ['', 'ImageID', 'Fitzpatrick Type', 'Label', 'Dataset', 'Unnamed: 0', 'fitzpatrick_scale', 'fitzpatrick_centile', 'label', 'image_path', 'Do not consider this image']
    return set([c for c in cols if c and c not in meta])

def extract_js_list(content, list_name):
    pattern = rf'export const {list_name} = \[(.*?)\];'
    match = re.search(pattern, content, re.DOTALL)
    if not match: return []
    items = re.findall(r'"(.*?)"|\'(.*?)\'', match.group(1))
    return [i[0] or i[1] for i in items if i[0] or i[1]]

def extract_js_object_keys(content, obj_name):
    pattern = rf'export const {obj_name} = \{{(.*?)\}};'
    match = re.search(pattern, content, re.DOTALL)
    if not match: return []
    # Busca llaves de primer nivel
    keys = re.findall(r'(?:\n|\s)\'?([a-zA-Z0-9_]+)\'?:', match.group(1))
    return keys

def extract_heuristic_concepts(file_paths):
    concepts = set()
    for path in file_paths:
        if not os.path.exists(path): continue
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        # Busca patrones tipo h.has('concept') o has('concept')
        found = re.findall(r"(?:h\.)?has\(['\"]([a-zA-Z0-9_]+)['\"]\)", content)
        concepts.update(found)
    return concepts

def extract_ui_concepts(path):
    if not os.path.exists(path): return set()
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Busca IDs que suelen ser conceptos en los input/checkboxes
    # Filtrando los conocidos que no son conceptos morpho/topog
    ids = re.findall(r'id=["\']([a-zA-Z0-9_]+)["\']', content)
    concept_prefixes = ('lesion_', 'topog_', 'topo_', 'patron_', 'signo_', 'antecedente_')
    return set([i for i in ids if i.startswith(concept_prefixes)])

def audit():
    print("Iniciando Auditoría de Cobertura Conceptual...")
    
    results = {}
    
    # 1. Datasets Externos
    results['derm1m_raw'] = sorted(list(extract_derm1m_concepts(PATHS['derm1m'])))
    results['skincon_raw'] = sorted(list(extract_skincon_concepts(PATHS['skincon'])))
    
    # 2. Motor Interno (constants.js)
    with open(PATHS['constants'], 'r', encoding='utf-8') as f:
        constants_content = f.read()
    
    # Extraemos FEATURE_INDEX manually because it's built dynamically in the JS
    # instead we extract PROBABILISTIC_FEATURES and the manual array part
    prob_feats = extract_js_list(constants_content, 'PROBABILISTIC_FEATURES')
    
    # El archivo constants.js tiene una lista manual EXTRA_CLINICAL_FEATURES que no es export
    extra_match = re.search(r'const EXTRA_CLINICAL_FEATURES = \[(.*?)\];', constants_content, re.DOTALL)
    extra_feats = []
    if extra_match:
        items = re.findall(r'"(.*?)"|\'(.*?)\'', extra_match.group(1))
        extra_feats = [i[0] or i[1] for i in items if i[0] or i[1]]

    results['internal_canonical'] = sorted(list(set(prob_feats + extra_feats)))
    results['internal_probabilistic'] = sorted(prob_feats)
    
    # Aliases y Mapeos
    results['internal_aliases'] = sorted(extract_js_object_keys(constants_content, 'FEATURE_ALIASES'))
    
    # 3. Lógica Heurística
    results['heuristic_usage'] = sorted(list(extract_heuristic_concepts([PATHS['rules'], PATHS['safety'], PATHS['context']])))
    
    # 4. Interfaz de Usuario
    results['ui_exposed'] = sorted(list(extract_ui_concepts(PATHS['ui_html'])))
    
    # 5. Ranker Diferencial
    if os.path.exists(PATHS['semiology_profiles']):
        with open(PATHS['semiology_profiles'], 'r', encoding='utf-8') as f:
            profiles = json.load(f)
        ranker_concepts = set()
        for p in profiles.values():
            ranker_concepts.update(p.keys())
        results['ranker_data_usage'] = sorted(list(ranker_concepts))
    else:
        results['ranker_data_usage'] = []

    # CÁLCULOS DE COBERTURA
    
    all_external = set(results['derm1m_raw']) | set(results['skincon_raw'])
    all_internal = set(results['internal_canonical'])
    
    intersection = all_external & all_internal
    orphan_internal = all_internal - all_external # Conceptos internos que no vienen de datasets (ej: metadatos o reglas manuales)
    unexploited_external = all_external - all_internal # Conceptos en datasets no mapeados
    
    # Análisis de UI
    ui_set = set(results['ui_exposed'])
    # Ver cuántos de UI están en canonical (directamente o vía alias)
    alias_map = {} # Dummy map to check coverage if needed later
    
    # Cruzar datos
    audit_data = {
        "metadata": {
            "version": "1.0.0",
            "description": "Concept Coverage Audit for DermatoTriage CDSS"
        },
        "counts": {
            "external_total": len(all_external),
            "derm1m": len(results['derm1m_raw']),
            "skincon": len(results['skincon_raw']),
            "internal_canonical": len(results['internal_canonical']),
            "internal_probabilistic": len(results['internal_probabilistic']),
            "ui_exposed": len(results['ui_exposed']),
            "heuristic_usage": len(results['heuristic_usage']),
            "ranker_usage": len(results['ranker_data_usage'])
        },
        "coverage": {
            "external_to_internal_overlap_count": len(intersection),
            "unexploited_external_count": len(unexploited_external),
            "orphan_internal_count": len(orphan_internal)
        },
        "details": results,
        "gaps": {
            "unexploited_external": sorted(list(unexploited_external)),
            "orphan_internal": sorted(list(orphan_internal))
        }
    }
    
    # Save JSON Report
    report_json_path = os.path.join(REPORTS_DIR, 'concept_coverage_audit.json')
    with open(report_json_path, 'w', encoding='utf-8') as f:
        json.dump(audit_data, f, indent=2)
    
    # Generate MD Summary
    summary_md_path = os.path.join(REPORTS_DIR, 'concept_coverage_summary.md')
    with open(summary_md_path, 'w', encoding='utf-8') as f:
        f.write("# Concept Coverage Audit Summary\n\n")
        f.write("## 1. Métricas de Cobertura\n\n")
        f.write(f"- **Universo Conceptual Externo (Datasets):** {len(all_external)} conceptos únicos.\n")
        f.write(f"- **Entendimiento Interno (Sistema):** {len(all_internal)} conceptos canónicos.\n")
        f.write(f"- **Exposición en UI:** {len(ui_set)} elementos de formulario.\n")
        f.write(f"- **Uso en Reglas Expertas:** {len(results['heuristic_usage'])} conceptos.\n")
        f.write(f"- **Uso en Motor de Diferenciales:** {len(results['ranker_data_usage'])} conceptos.\n\n")
        
        f.write("## 2. Gaps Semánticos Identificados\n\n")
        f.write(f"### 🚩 Potencial No Explotado ({len(unexploited_external)} conceptos)\n")
        f.write("Datasets contienen conceptos que no están mapeados en el motor actual:\n")
        for c in sorted(list(unexploited_external))[:20]: # Show first 20
            f.write(f"- `{c}`\n")
        f.write("... (ver JSON para lista completa)\n\n")
        
        f.write(f"### 🔍 Conceptos Internos Huérfanos ({len(orphan_internal)} conceptos)\n")
        f.write("Conceptos definidos en `constants.js` que no tienen un match exacto con el nombre crudo de datasets (requieren canonicalización):\n")
        for c in sorted(list(orphan_internal))[:10]:
            f.write(f"- `{c}`\n")
            
        f.write("\n## 3. Top Conceptos de Alto Valor No Explotados (SkinCon)\n")
        high_value = [c for c in results['skincon_raw'] if c.lower() not in [x.lower() for x in results['internal_canonical']]]
        for c in high_value[:15]:
            f.write(f"- `{c}` (Específico de SkinCon)\n")

    print(f"Auditoría completada. Reportes generados en {REPORTS_DIR}")

if __name__ == "__main__":
    audit()
