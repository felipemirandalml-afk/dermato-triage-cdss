import { SYNDROME_TO_ONTOLOGY_MAP } from '../../runtime/engine/syndrome_to_ontology_map.js';
import SEMIOLOGY_PROFILES from '../../runtime/engine/semiology_profiles.json' with { type: 'json' };

function normalizeDiseaseName(name) {
    let normalized = name.toLowerCase().trim();
    if (normalized.includes('(')) {
        const parts = normalized.split(/[()]/).filter(p => p.trim().length > 0);
        const longPart = parts.find(p => p.split(' ').length > 2);
        if (longPart) return longPart.trim();
        normalized = normalized.split(' (')[0].trim();
    }
    normalized = normalized.replace(/^malignant |^benign |^acute |^chronic /g, '').trim();
    return normalized;
}

function audit() {
    const allDifferentials = [];
    Object.values(SYNDROME_TO_ONTOLOGY_MAP).forEach(s => {
        allDifferentials.push(...s.differentials);
    });

    const results = {
        matches: [],
        misses: []
    };

    allDifferentials.forEach(d => {
        let normalized = normalizeDiseaseName(d);
        let profile = SEMIOLOGY_PROFILES[normalized];

        if (!profile && normalized.endsWith('ses')) {
            const singular = normalized.replace(/ses$/, 'sis');
            if (SEMIOLOGY_PROFILES[singular]) profile = SEMIOLOGY_PROFILES[singular];
        }
        if (!profile && normalized.endsWith('sis')) {
            const plural = normalized.replace(/sis$/, 'ses');
            if (SEMIOLOGY_PROFILES[plural]) profile = SEMIOLOGY_PROFILES[plural];
        }

        if (!profile && d.includes(' / ')) {
             const parts = d.split(' / ');
             for (const p of parts) {
                 const pNorm = normalizeDiseaseName(p);
                 if (SEMIOLOGY_PROFILES[pNorm]) {
                     profile = SEMIOLOGY_PROFILES[pNorm];
                     break;
                 }
             }
        }
        
        if (!profile) {
            const firstTerm = normalized.split(' ')[0];
            if (firstTerm && firstTerm.length > 3 && SEMIOLOGY_PROFILES[firstTerm]) {
                profile = SEMIOLOGY_PROFILES[firstTerm];
            }
        }

        if (profile) {
            results.matches.push(d);
        } else {
            results.misses.push(d);
        }
    });

    console.log('--- COVERAGE AUDIT (ROBUST V3) ---');
    console.log('Total Differentials in Map: ', allDifferentials.length);
    console.log('Matches Found: ', results.matches.length);
    console.log('Misses: ', results.misses.length);
    console.log('\n--- MISSED DIFFERENTIALS ---');
    results.misses.forEach(m => console.log(' - ' + m));
}

audit();
