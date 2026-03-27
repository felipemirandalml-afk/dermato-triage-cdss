import fs from 'fs';
import { PROBABILISTIC_FEATURES } from './runtime/engine/constants.js';
const SCHEMA_PATH = './runtime/data/concept_canonical_map.json';
const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));

const existingIds = new Set(schema.concepts.map(c => c.canonical_id));

PROBABILISTIC_FEATURES.forEach(f => {
    if (!existingIds.has(f)) {
        schema.concepts.push({
            canonical_id: f,
            canonical_label: f.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            semantic_group: "auto_migrated",
            granularity_level: "canonical",
            aliases: [],
            source_mappings: [],
            usable_in_ui: true,
            usable_in_rules: true
        });
    }
});

fs.writeFileSync(SCHEMA_PATH, JSON.stringify(schema, null, 2));
console.log("Updated concept_canonical_map.json with missing features.");
