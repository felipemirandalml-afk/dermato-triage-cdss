"""
build_syndrome_profiles.py — Exporta los perfiles sindrómicos P(feature|síndrome)
desde la co-ocurrencia REAL de Derm1M, para el clasificador bayesiano (Naive Bayes).

Reemplaza la cadena sintética (perfiles → pacientes inventados → RF) por una sola
estadística recomputable y citable: se cuenta directo de concept.csv.

Salida: frontend-v2/src/data/syndrome_feature_profiles.json
  { meta, syndromes[], features[], prior{}, p_feature_given_syndrome{ s: { f: p } } }
"""
import json
import math  # noqa: F401  (disponible para extensiones)
import re
from collections import defaultdict
from pathlib import Path

import pandas as pd

ALPHA = 0.5  # suavizado de Laplace


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def load_concept_resolver(path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    resolver = {}
    for c in data["concepts"]:
        cid = c["canonical_id"]
        resolver[cid.lower()] = cid
        for a in c.get("aliases", []):
            resolver[a.lower()] = cid
        for m in c.get("source_mappings", []):
            resolver[m["label"].lower()] = cid
    return resolver


def norm_disease(name: str) -> str:
    n = re.sub(r"\(.*?\)", "", name.lower())
    n = re.sub(r"[^a-z0-9 ]", " ", n)
    return re.sub(r"\s+", " ", n).strip()


def load_disease_to_syndrome(map_js: Path):
    content = map_js.read_text(encoding="utf-8")
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
    d2s = {}
    for syndrome, info in mapping.items():
        for diff in info.get("differentials", []):
            d2s[norm_disease(diff)] = syndrome
    return list(mapping.keys()), d2s


def resolve_syndrome(label, d2s):
    n = norm_disease(label)
    if n in d2s:
        return d2s[n]
    for k, s in d2s.items():
        if k and (k in n or n in k):
            return s
    return None


def main():
    root = repo_root()
    resolver = load_concept_resolver(root / "frontend-v2" / "src" / "data" / "concept_canonical_map.json")
    all_syndromes, d2s = load_disease_to_syndrome(root / "frontend-v2" / "src" / "engine" / "syndrome_to_ontology_map.js")
    df = pd.read_csv(root / "data" / "derm1m" / "concept.csv").dropna(subset=["disease_label", "skin_concept"])

    n_s = defaultdict(int)
    n_fs = defaultdict(lambda: defaultdict(int))
    features = set()
    for disease, concept_raw in zip(df["disease_label"], df["skin_concept"]):
        s = resolve_syndrome(disease, d2s)
        if s is None:
            continue
        feats = {resolver.get(c.strip()) for c in str(concept_raw).lower().split(",")}
        feats.discard(None)
        n_s[s] += 1
        for f in feats:
            n_fs[f][s] += 1
            features.add(f)

    syndromes = [s for s in all_syndromes if n_s[s] > 0]
    features = sorted(features)
    total = sum(n_s[s] for s in syndromes)

    prior = {s: n_s[s] / total for s in syndromes}
    p_fs = {
        s: {f: round((n_fs[f][s] + ALPHA) / (n_s[s] + 2 * ALPHA), 5) for f in features}
        for s in syndromes
    }

    out = {
        "meta": {
            "method": "Naive Bayes (Bernoulli) sobre co-ocurrencia Derm1M",
            "source": "data/derm1m/concept.csv",
            "alpha": ALPHA,
            "mapped_rows": total,
            "n_per_syndrome": {s: n_s[s] for s in syndromes}
        },
        "syndromes": syndromes,
        "features": features,
        "prior": {s: round(prior[s], 6) for s in syndromes},
        "p_feature_given_syndrome": p_fs
    }

    out_path = root / "frontend-v2" / "src" / "data" / "syndrome_feature_profiles.json"
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Perfiles exportados -> {out_path}")
    print(f"  {len(syndromes)} sindromes, {len(features)} features, {total} filas Derm1M mapeadas")


if __name__ == "__main__":
    main()
