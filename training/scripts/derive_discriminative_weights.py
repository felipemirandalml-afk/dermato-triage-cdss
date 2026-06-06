"""
derive_discriminative_weights.py

Deriva los pesos discriminativos feature->sindrome DIRECTAMENTE desde la
co-ocurrencia cruda de Derm1M (data/derm1m/concept.csv), reemplazando los
pesos "fiteados" (statistical_base_weights_fit_v2.json /
feature_discriminative_scores_v2.json) por estadisticas transparentes y
recomputables.

PROCEDENCIA Y FORMULA (para METHODS / publicacion)
--------------------------------------------------
Derm1M concept.csv es una tabla de co-ocurrencia (disease_label, skin_concept).
Mapeamos:
  - skin_concept -> feature canonica   (data/concept_canonical_map.json: aliases + source_mappings)
  - disease_label -> sindrome (12)      (syndrome_to_ontology_map.js: differentials)

Contamos sobre las filas mapeadas:
  N        = total de filas mapeadas a algun sindrome
  N(s)     = filas del sindrome s
  N(f)     = filas con feature f
  N(f,s)   = filas del sindrome s con feature f

Y para cada par (feature f, sindrome s):
  P(f|s)   = N(f,s) / N(s)
  P(f|¬s)  = (N(f) - N(f,s)) / (N - N(s))
  log_odds = ln( (P(f|s)+e) / (P(f|¬s)+e) )      # poder discriminativo (signo + magnitud)
  PMI      = ln( P(f,s) / (P(f) P(s)) )           # informacion mutua puntual

El log-odds es el "peso" defendible: cuanto mas (o menos) probable es ver la
feature dentro del sindrome que fuera de el. Es citable y recomputable; no es un
numero magico ni esta fiteado contra datos sinteticos.

Salida: data/derived_discriminative_weights.json (con conteos crudos para auditoria)
y una comparacion impresa contra los pesos fiteados actuales.
"""
import json
import math
import re
from collections import defaultdict
from pathlib import Path


EPS = 1e-6
MIN_SYNDROME_ROWS = 30   # soporte minimo para reportar un sindrome
MIN_PAIR_ROWS = 5        # soporte minimo N(f,s) para reportar un par


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def load_concept_resolver(canonical_map_path: Path):
    """concepto crudo (lower) -> feature canonica, desde aliases y source_mappings."""
    with open(canonical_map_path, encoding="utf-8") as f:
        data = json.load(f)
    resolver = {}
    for c in data["concepts"]:
        cid = c["canonical_id"]
        resolver[cid.lower()] = cid
        for alias in c.get("aliases", []):
            resolver[alias.lower()] = cid
        for m in c.get("source_mappings", []):
            resolver[m["label"].lower()] = cid
    return resolver


def load_disease_to_syndrome(map_js_path: Path):
    """Invierte syndrome_to_ontology_map.js: disease_label normalizado -> sindrome."""
    content = map_js_path.read_text(encoding="utf-8")
    start = content.index("{", content.index("SYNDROME_TO_ONTOLOGY_MAP"))
    depth = 0
    for i in range(start, len(content)):
        if content[i] == "{":
            depth += 1
        elif content[i] == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    mapping = json.loads(content[start:end])

    disease_to_syndrome = {}
    for syndrome, info in mapping.items():
        for diff in info.get("differentials", []):
            disease_to_syndrome[normalize_disease(diff)] = syndrome
    return disease_to_syndrome, mapping


def normalize_disease(name: str) -> str:
    n = name.lower().strip()
    n = re.sub(r"\(.*?\)", "", n)          # quita parentesis: "psoriasis (plaque)" -> "psoriasis"
    n = re.sub(r"[^a-z0-9 ]", " ", n)
    n = re.sub(r"\s+", " ", n).strip()
    return n


def resolve_syndrome(disease_label: str, disease_to_syndrome: dict):
    """Match exacto normalizado; si no, match por inclusion de la enfermedad base."""
    norm = normalize_disease(disease_label)
    if norm in disease_to_syndrome:
        return disease_to_syndrome[norm]
    for known, syndrome in disease_to_syndrome.items():
        if known and (known in norm or norm in known):
            return syndrome
    return None


def main():
    root = repo_root()
    concept_csv = root / "data" / "derm1m" / "concept.csv"
    canonical_map = root / "frontend-v2" / "src" / "data" / "concept_canonical_map.json"
    ontology_map = root / "frontend-v2" / "src" / "engine" / "syndrome_to_ontology_map.js"
    out_path = root / "frontend-v2" / "src" / "data" / "derived_discriminative_weights.json"
    current_fit = root / "frontend-v2" / "src" / "data" / "statistical_base_weights_fit_v2.json"

    import pandas as pd

    concept_resolver = load_concept_resolver(canonical_map)
    disease_to_syndrome, _ = load_disease_to_syndrome(ontology_map)
    print(f"- Conceptos resolvibles:   {len(concept_resolver)}")
    print(f"- Enfermedades->sindrome:  {len(disease_to_syndrome)} differentials")

    df = pd.read_csv(concept_csv).dropna(subset=["disease_label", "skin_concept"])
    print(f"- Filas Derm1M:            {len(df)}")

    N = 0
    n_s = defaultdict(int)                       # N(s)
    n_f = defaultdict(int)                        # N(f)
    n_fs = defaultdict(lambda: defaultdict(int))  # N(f,s)
    unmapped_diseases = defaultdict(int)

    for disease_label, concept_raw in zip(df["disease_label"], df["skin_concept"]):
        syndrome = resolve_syndrome(disease_label, disease_to_syndrome)
        if syndrome is None:
            unmapped_diseases[normalize_disease(disease_label)] += 1
            continue

        feats = set()
        for c in str(concept_raw).lower().split(","):
            cid = concept_resolver.get(c.strip())
            if cid:
                feats.add(cid)

        N += 1
        n_s[syndrome] += 1
        for f in feats:
            n_f[f] += 1
            n_fs[f][syndrome] += 1

    print(f"- Filas mapeadas a sindrome: {N} ({100*N/len(df):.1f}% de Derm1M)\n")

    # Computar log-odds / PMI por par (feature, sindrome)
    weights = {}
    for f, by_syn in n_fs.items():
        per_syndrome = {}
        for s, nfs in by_syn.items():
            if n_s[s] < MIN_SYNDROME_ROWS or nfs < MIN_PAIR_ROWS:
                continue
            p_f_given_s = nfs / n_s[s]
            p_f_given_not_s = (n_f[f] - nfs) / (N - n_s[s]) if (N - n_s[s]) > 0 else 0
            log_odds = math.log((p_f_given_s + EPS) / (p_f_given_not_s + EPS))
            p_fs = nfs / N
            pmi = math.log(p_fs / ((n_f[f] / N) * (n_s[s] / N)) + EPS)
            per_syndrome[s] = {
                "log_odds": round(log_odds, 4),
                "pmi": round(pmi, 4),
                "p_f_given_s": round(p_f_given_s, 4),
                "n_fs": nfs,
                "n_s": n_s[s],
            }
        if per_syndrome:
            top = max(per_syndrome.items(), key=lambda kv: kv[1]["log_odds"])
            weights[f] = {
                "n_f": n_f[f],
                "top_syndrome": top[0],
                "top_log_odds": top[1]["log_odds"],
                "by_syndrome": per_syndrome,
            }

    out = {
        "_methodology": "log-odds y PMI de co-ocurrencia feature-sindrome en Derm1M concept.csv",
        "_formula": "log_odds(f,s) = ln( P(f|s)/P(f|not s) )",
        "_totals": {"mapped_rows": N, "syndromes": {s: n_s[s] for s in sorted(n_s)}},
        "weights": weights,
    }
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Pesos derivados -> {out_path}\n")

    # Comparacion contra los pesos fiteados actuales
    print("=" * 72)
    print("COMPARACION: peso derivado (log-odds del top-sindrome) vs fiteado actual")
    print("=" * 72)
    fitted = json.loads(current_fit.read_text(encoding="utf-8"))
    print(f"{'feature':<22}{'derived log-odds':>18}{'top syndrome':>30}")
    print("-" * 72)
    for f in sorted(weights, key=lambda k: weights[k]["top_log_odds"], reverse=True):
        w = weights[f]
        fit = fitted.get(f)
        fit_str = f"   (fit: {fit})" if fit is not None else ""
        print(f"{f:<22}{w['top_log_odds']:>18}{w['top_syndrome']:>30}{fit_str}")

    print("\nTop enfermedades Derm1M SIN mapear a sindrome (cobertura a mejorar):")
    for d, c in sorted(unmapped_diseases.items(), key=lambda kv: kv[1], reverse=True)[:12]:
        print(f"  {c:>6}  {d}")


if __name__ == "__main__":
    main()
