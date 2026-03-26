import json
import os
import re

def parse_obo(file_path):
    terms = {}
    current_term = None
    
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            
            if line == '[Term]':
                if current_term:
                    terms[current_term['id']] = current_term
                current_term = {'id': '', 'name': '', 'is_a': [], 'synonyms': [], 'def': ''}
            elif line.startswith('id: '):
                current_term['id'] = line[4:].split(' ! ')[0]
            elif line.startswith('name: '):
                current_term['name'] = line[6:]
            elif line.startswith('is_a: '):
                current_term['is_a'].append(line[6:].split(' ! ')[0])
            elif line.startswith('synonym: '):
                # Extract text inside quotes
                match = re.search(r'"([^"]*)"', line)
                if match:
                    current_term['synonyms'].append(match.group(1))
            elif line.startswith('def: '):
                match = re.search(r'"([^"]*)"', line)
                if match:
                    current_term['def'] = match.group(1)
                    
        if current_term:
            terms[current_term['id']] = current_term
            
    return terms

def build_reasoning_map():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    obo_path = os.path.join(base_dir, 'data', 'ontology', 'dermatology.obo')
    output_path = os.path.join(base_dir, 'engine', 'dermatology_reasoning_map.json')
    
    print(f"Parsing {obo_path}...")
    terms = parse_obo(obo_path)
    print(f"Loaded {len(terms)} terms.")

    syndromes = [
        "eczema_dermatitis",
        "psoriasiform_dermatosis",
        "bacterial_skin_infection",
        "viral_skin_infection",
        "fungal_skin_infection",
        "drug_reaction",
        "urticarial_dermatosis",
        "vesiculobullous_disease",
        "vasculitic_purpuric_disease",
        "cutaneous_tumor_suspected",
        "benign_cutaneous_tumor",
        "inflammatory_dermatosis_other"
    ]

    # Definition of syndromes based on terms and associations
    reasoning_map = {
        "eczema_dermatitis": {
            "clinical_group": "inflammatory_dermatoses",
            "subgroup": "eczematous_disorders",
            "keywords": ["eczema", "dermatitis", "atopic"],
            "reasoning_summary": "Pruritic inflammatory dermatosis often associated with scale, excoriation, lichenification or chronic relapsing course.",
            "red_flags": ["extensive erythrodermic involvement", "secondary infection (eczema herpeticum)"]
        },
        "psoriasiform_dermatosis": {
            "clinical_group": "inflammatory_dermatoses",
            "subgroup": "papulosquamous_disorders",
            "keywords": ["psoriasis", "psoriasiform", "pityriasis rosea", "lichen planus"],
            "reasoning_summary": "Chronic inflammatory condition characterized by well-demarcated erythematous plaques with silvery scales, often in extensor distributions.",
            "red_flags": ["psoriatic erythroderma", "generalized pustular psoriasis", "joint pain (psoriatic arthritis)"]
        },
        "bacterial_skin_infection": {
            "clinical_group": "infectious_diseases",
            "subgroup": "bacterial_infections",
            "keywords": ["impetigo", "cellulitis", "folliculitis", "furuncle", "abscess", "erysipelas"],
            "reasoning_summary": "Cutaneous infection caused by bacteria, often presenting with heat, pain, erythema, and sometimes fever or pus.",
            "red_flags": ["rapid progression", "crepitus", "severe pain disproportionate to findings (necrotizing fasciitis)", "systemic toxicity"]
        },
        "viral_skin_infection": {
            "clinical_group": "infectious_diseases",
            "subgroup": "viral_infections",
            "keywords": ["herpes", "zoster", "varicella", "verruca", "molluscum", "viral exanthem"],
            "reasoning_summary": "Infections caused by viruses, frequently presenting with vesicles, warts, or characteristic exanthematous patterns.",
            "red_flags": ["ophthalmic involvement (zoster)", "multidermatomal distribution", "meningeal symptoms"]
        },
        "fungal_skin_infection": {
            "clinical_group": "infectious_diseases",
            "subgroup": "fungal_infections",
            "keywords": ["tinea", "candidiasis", "pityriasis versicolor", "dermatophytosis", "onychomycosis"],
            "reasoning_summary": "Superficial infections caused by dermatophytes or yeasts, often presenting with annular scaling plaques or intertriginous maceration.",
            "red_flags": ["deep fungal suspicion in immunocompromised", "extensive involvement"]
        },
        "drug_reaction": {
            "clinical_group": "immune_mediated_disorders",
            "subgroup": "cutaneous_drug_reactions",
            "keywords": ["drug eruption", "exanthematous drug reaction", "fixed drug eruption", "toxic epidermal necrolysis", "SJS"],
            "reasoning_summary": "Cutaneous manifestations triggered by medication use, ranging from simple rashes to life-threatening conditions.",
            "red_flags": ["mucosal involvement", "skin pain", "positive Nikolsky sign", "fever", "eosinophilia"]
        },
        "urticarial_dermatosis": {
            "clinical_group": "inflammatory_dermatoses",
            "subgroup": "urticarial_and_vascular_disorders",
            "keywords": ["urticaria", "angioedema", "wheal"],
            "reasoning_summary": "Transient edematous papules and plaques (wheals) caused by mast cell degranulation, often severely pruritic.",
            "red_flags": ["airway involvement (angioedema)", "anaphylaxis symptoms", "lesions lasting >24h (vasculitis suspicion)"]
        },
        "vesiculobullous_disease": {
            "clinical_group": "autoimmune_bullous_diseases",
            "subgroup": "blistering_disorders",
            "keywords": ["pemphigus", "pemphigoid", "dermatitis herpetiformis", "bullous"],
            "reasoning_summary": "Conditions characterized by the formation of vesicles and bullae, often due to autoimmune targeting of skin adhesion molecules.",
            "red_flags": ["extensive mucosal erosion", "widespread blistering", "positive Nikolsky sign"]
        },
        "vasculitic_purpuric_disease": {
            "clinical_group": "vascular_disorders",
            "subgroup": "vasculitis_and_purpura",
            "keywords": ["vasculitis", "purpura", "petechiae", "ecchymosis"],
            "reasoning_summary": "Disorders involving inflammation of blood vessels or extravasation of red blood cells into the skin, presenting as non-blanching lesions.",
            "red_flags": ["palpable purpura", "systemic symptoms (renal, GI, joint)", "retiform purpura (necrosis)"]
        },
        "cutaneous_tumor_suspected": {
            "clinical_group": "neoplastic_disorders",
            "subgroup": "malignant_neoplasms",
            "keywords": ["melanoma", "basal cell carcinoma", "squamous cell carcinoma", "sarcoma", "metastasis"],
            "reasoning_summary": "Skin lesions with features suggestive of malignancy, requiring biopsy or specialized evaluation.",
            "red_flags": ["ABCDE criteria for melanoma", "non-healing ulcer", "rapid growth", "irregular borders"]
        },
        "benign_cutaneous_tumor": {
            "clinical_group": "neoplastic_disorders",
            "subgroup": "benign_proliferations",
            "keywords": ["nevus", "seborrheic keratosis", "dermatofibroma", "lipoma", "angioma", "cyst"],
            "reasoning_summary": "Non-cancerous growths of various skin components that are stable and follow predictable benign clinical courses.",
            "red_flags": ["sudden change in a stable lesion", "irritation or bleeding"]
        },
        "inflammatory_dermatosis_other": {
            "clinical_group": "inflammatory_dermatoses",
            "subgroup": "other_inflammatory_disorders",
            "keywords": ["granuloma annulare", "sarcoidosis", "lupus erythematosus", "acne", "rosacea", "scabies"],
            "reasoning_summary": "A heterogeneous group of inflammatory skin conditions that do not fit into the primary eczematous or papulosquamous categories.",
            "red_flags": ["systemic lupus symptoms", "severe scarring acne"]
        }
    }

    # Enriching with differentials from the OBO
    # We search for terms that match the keywords
    final_map = {}
    for sync, data in reasoning_map.items():
        differentials = []
        keywords = data.pop('keywords')
        
        # Simple search in the ontology
        for tid, tdata in terms.items():
            name = tdata['name'].lower()
            # If any keyword is in name and name is short enough to be a good differential
            if any(kw in name for kw in keywords) and len(name.split()) <= 3:
                # Avoid redundant or too broad names
                if name not in [d.lower() for d in differentials]:
                    differentials.append(tdata['name'])
            
            # Limit to 10 differentials for brevity
            if len(differentials) >= 10:
                break
                
        data['possible_differentials'] = sorted(list(set(differentials)))
        final_map[sync] = data

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_map, f, indent=2, ensure_ascii=False)

    # Print summary table
    print("\n" + "="*80)
    print(f"{'SYNDROME_CLASS':<30} | {'CLINICAL_GROUP':<25} | {'DIFF_COUNT':<10}")
    print("-" * 80)
    for sync, data in final_map.items():
        print(f"{sync:<30} | {data['clinical_group']:<25} | {len(data['possible_differentials']):<10}")
    print("="*80 + "\n")

    # Show example for 3 classes
    sample_classes = ["eczema_dermatitis", "bacterial_skin_infection", "cutaneous_tumor_suspected"]
    print("EXAMPLES FROM JSON:")
    for sc in sample_classes:
        print(f"\n--- {sc} ---")
        print(json.dumps(final_map[sc], indent=2))

if __name__ == "__main__":
    build_reasoning_map()
