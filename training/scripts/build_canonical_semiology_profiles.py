import pandas as pd
import json
import os
from collections import defaultdict

# Configuración
BASE_DIR = 'd:/dermato-triage-cdss'
DERM1M_CSV = os.path.join(BASE_DIR, 'data/derm1m/concept.csv')
CANONICAL_MAP_PATH = os.path.join(BASE_DIR, 'data/concept_canonical_map.json')
OUTPUT_JSON = os.path.join(BASE_DIR, 'engine/semiology_profiles.json')
REPORTS_DIR = os.path.join(BASE_DIR, 'reports')

# Definición de Criterios Clínicos para el Ranker (Filtro v1.2)
ACTIVE_SCHEMA = {
    'lesion_primaria': 'high',
    'lesion_secundaria': 'high',
    'color_vascular': 'high',
    'color_pigmentario': 'medium',
    'superficie_poros': 'medium',
    'geometria_forma': 'medium',
    'textura_consistencia': 'medium',
    'modificador': 'low'
}

class CanonicalBuilder:
    def __init__(self):
        self.canonical_map = {}
        self.id_to_concept = {}
        self._load_map()

    def _load_map(self):
        with open(CANONICAL_MAP_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for c in data['concepts']:
                cid = c['canonical_id']
                self.id_to_concept[cid] = c
                # Map aliases to cid
                for alias in c['aliases']:
                    self.canonical_map[alias.lower()] = cid
                # Map source labels to cid
                for mapping in c['source_mappings']:
                    self.canonical_map[mapping['label'].lower()] = cid
                # Self map
                self.canonical_map[cid] = cid

    def resolve(self, label):
        if not label: return None
        l = label.lower().strip()
        # Clean prefix if needed
        prefixes = ['lesion_', 'signo_', 'patron_']
        for p in prefixes:
            if l.startswith(p):
                l = l[len(p):]
                break
        return self.canonical_map.get(l)

    def is_priority(self, cid):
        concept = self.id_to_concept.get(cid)
        if not concept: return False
        group = concept['semantic_group']
        priority = ACTIVE_SCHEMA.get(group, 'none')
        return priority in ['high', 'medium']

    def build_profiles(self):
        print(f"Iniciando reconstrucción canónica desde {DERM1M_CSV}...")
        
        if not os.path.exists(DERM1M_CSV):
            print("Error: Derm1M dataset no encontrado.")
            return

        df = pd.read_csv(DERM1M_CSV)
        df = df.dropna(subset=['disease_label', 'skin_concept'])
        
        disease_profiles = defaultdict(lambda: defaultdict(int))
        disease_counts = defaultdict(int)
        
        # Auditoría de unresolved durante el build
        unresolved_raw = set()

        for _, row in df.iterrows():
            disease = row['disease_label'].strip().lower()
            concepts_raw = str(row['skin_concept']).lower()
            concepts_list = [c.strip() for c in concepts_raw.split(',')]
            
            disease_counts[disease] += 1
            
            # Map to canonical and filter by clinical priority
            canonical_present = set()
            for c in concepts_list:
                cid = self.resolve(c)
                if cid:
                    if self.is_priority(cid):
                        canonical_present.add(cid)
                else:
                    unresolved_raw.add(c)
            
            for cid in canonical_present:
                disease_profiles[disease][cid] += 1

        # Generar perfiles finales con frecuencias
        final_profiles = {}
        report_data = []

        for disease, profile in disease_profiles.items():
            count = disease_counts[disease]
            if count < 2: continue # Mínimo soporte estadístico
            
            filtered_profile = {}
            for cid, freq_count in profile.items():
                freq = freq_count / count
                if freq > 0.15: # Umbral de relevancia semiológica
                    filtered_profile[cid] = round(freq, 3)
            
            if filtered_profile:
                final_profiles[disease] = filtered_profile

        # Guardar resultados
        with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
            json.dump(final_profiles, f, indent=2)
            
        # Generar Reporte de unresolved
        unresolved_report = {
            "source": "Derm1M builder",
            "count": len(unresolved_raw),
            "concepts": sorted(list(unresolved_raw))
        }
        with open(os.path.join(REPORTS_DIR, 'semiology_profile_unresolved.json'), 'w', encoding='utf-8') as f:
            json.dump(unresolved_report, f, indent=2)

        print(f"Build completado. {len(final_profiles)} enfermedades perfiladas.")
        print(f"Conceptos no resueltos guardados en reports/semiology_profile_unresolved.json")

if __name__ == "__main__":
    builder = CanonicalBuilder()
    builder.build_profiles()
