import fs from 'fs';
import path from 'path';
import conceptMapper from '../../runtime/engine/concept_mapper.js';

const PROFILES_PATH = 'd:/dermato-triage-cdss/engine/semiology_profiles.json';

function inspect() {
    const profiles = JSON.parse(fs.readFileSync(PROFILES_PATH, 'utf-8'));
    const uniqueFeatures = new Set();
    
    Object.values(profiles).forEach(profile => {
        Object.keys(profile).forEach(f => uniqueFeatures.add(f));
    });
    
    const unresolved = [];
    const resolved = [];
    
    uniqueFeatures.forEach(f => {
        const cid = conceptMapper.resolve(f);
        if (cid) {
            resolved.push({ raw: f, canonical: cid });
        } else {
            unresolved.push(f);
        }
    });
    
    console.log(`Total Features: ${uniqueFeatures.size}`);
    console.log(`Resolved: ${resolved.length}`);
    console.log(`Unresolved: ${unresolved.length}`);
    
    fs.writeFileSync('d:/dermato-triage-cdss/reports/ranker_unresolved_concepts.json', JSON.stringify({
        unresolved: unresolved.sort(),
        resolved: resolved
    }, null, 2));
}

inspect();
