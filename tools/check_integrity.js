import { PROBABILISTIC_FEATURES } from '../runtime/engine/constants.js';
import SCHEMA_DATA from '../runtime/data/concept_canonical_map.json' with { type: 'json' };

const concepts = SCHEMA_DATA.concepts.map(c => c.canonical_id);
const missing = PROBABILISTIC_FEATURES.filter(f => !concepts.includes(f));

console.log("Missing features in concept_canonical_map.json:");
console.log(JSON.stringify(missing, null, 2));
console.log("\nTotal missing:", missing.length);
