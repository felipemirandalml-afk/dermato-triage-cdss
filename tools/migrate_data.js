import fs from 'fs';
import path from 'path';
import { PROBABILISTIC_FEATURES } from '../engine/constants.js';
import { conceptMapper } from '../engine/concept_mapper.js';

// 1. Update Schema
const schemaData = {
    "edad": "numeric",
    "fototipo": "categorical"
};
for (const f of PROBABILISTIC_FEATURES) {
    if (f !== 'edad' && f !== 'fototipo' && !f.startsWith('ft_')) {
        schemaData[f] = 'binary';
    }
}
fs.writeFileSync('./engine/feature_schema.json', JSON.stringify(schemaData, null, 2));

// 2. Migrate CSV Function
function migrateCSV(csvPath) {
    if (!fs.existsSync(csvPath)) return;
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split(/\r?\n/).filter(l => l.trim() !== '');
    if (lines.length < 2) return;
    
    const headers = lines[0].split(',');
    // Mapping from raw header to a canonical identifier based on the old schema
    // and to the NEW schema using conceptMapper.
    
    // We only care about expected features plus 'target', 'fototipo', 'edad', 'id'
    const newHeaders = ['id', 'edad', 'fototipo', 'target', ...Object.keys(schemaData).filter(x => x !== 'edad' && x !== 'fototipo')];
    
    const newLines = [newHeaders.join(',')];
    
    for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(',');
        const rowData = {};
        for(let j = 0; j < headers.length; j++) {
            rowData[headers[j]] = vals[j];
        }
        
        let newRow = {};
        for (const h of newHeaders) newRow[h] = 0;
        
        newRow['id'] = rowData['id'] || `row_${i}`;
        newRow['edad'] = rowData['edad'] || '30';
        newRow['fototipo'] = rowData['fototipo'] || 'II';
        newRow['target'] = rowData['target'] || 'unknown';
        
        // Map old ones forward
        for(let j = 0; j < headers.length; j++) {
            const head = headers[j];
            const val = rowData[head];
            if (val === '1' || val === 1) {
                // Try to map this header to a canonical new one using conceptMapper
                const canonicalId = conceptMapper.resolve(head);
                if (canonicalId && newHeaders.includes(canonicalId)) {
                    newRow[canonicalId] = 1;
                }
            }
        }
        
        const rowArray = newHeaders.map(h => newRow[h]);
        newLines.push(rowArray.join(','));
    }
    
    fs.writeFileSync(csvPath, newLines.join('\n'));
    console.log(`Migrated ${csvPath}`);
}

migrateCSV('./data/training_cases.csv');
// Also training_cases_v2 if it exists
migrateCSV('./data/training_cases_v2.csv');
console.log('Migration complete');
