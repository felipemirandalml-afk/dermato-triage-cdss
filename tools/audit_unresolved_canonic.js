import fs from 'fs';
import path from 'path';
import conceptMapper from '../engine/concept_mapper.js';
import { FEATURE_INDEX } from '../engine/constants.js';

const BASE_DIR = 'd:/dermato-triage-cdss';
const UI_PATH = path.join(BASE_DIR, 'index.html');
const DERM1M_PATH = path.join(BASE_DIR, 'data/derm1m/concept.csv');
const SKINCON_PATH = path.join(BASE_DIR, 'data/skincon/skincon_fitzpatrick17k.csv');

function audit() {
    console.log("Iniciando auditoría de conceptos no resueltos...");

    const unresolved = {
        ui: [],
        derm1m: [],
        skincon: [],
        internal_orphans: []
    };

    // 1. Auditoría UI
    const html = fs.readFileSync(UI_PATH, 'utf-8');
    const uiIds = html.match(/id=["']([a-zA-Z0-9_]+)["']/g) || [];
    const conceptPrefixes = ['lesion_', 'topog_', 'topo_', 'patron_', 'signo_', 'antecedente_'];
    
    uiIds.forEach(idMatch => {
        const id = idMatch.replace(/id=["']|["']/g, '');
        if (conceptPrefixes.some(p => id.startsWith(p))) {
            const resolved = conceptMapper.resolve(id);
            if (!resolved) unresolved.ui.push(id);
        }
    });

    // 2. Auditoría Datasets (Derm1M - solo muestra representativa)
    if (fs.existsSync(DERM1M_PATH)) {
        const derm1mRaw = fs.readFileSync(DERM1M_PATH, 'utf-8').split('\n').slice(1, 500);
        const derm1mConcepts = new Set();
        derm1mRaw.forEach(line => {
             const parts = line.split(',');
             if (parts.length > 2) {
                 parts[2].split(';').forEach(c => derm1mConcepts.add(c.trim().toLowerCase()));
             }
        });
        derm1mConcepts.forEach(c => {
            if (c && !conceptMapper.resolve(c)) unresolved.derm1m.push(c);
        });
    }

    // 3. Auditoría SkinCon (Cabeceras)
    if (fs.existsSync(SKINCON_PATH)) {
        const header = fs.readFileSync(SKINCON_PATH, 'utf-8').split('\n')[0];
        const cols = header.split(',').map(c => c.trim());
        const meta = ['', 'ImageID', 'Fitzpatrick Type', 'Label', 'Dataset', 'Unnamed: 0', 'fitzpatrick_scale', 'fitzpatrick_centile', 'label', 'image_path', 'Do not consider this image'];
        cols.forEach(c => {
            if (c && !meta.includes(c)) {
                if (!conceptMapper.resolve(c)) unresolved.skincon.push(c);
            }
        });
    }

    // 4. Auditoría Interna (Features en constantes que no están en el mapa canónico)
    const canonicalIds = conceptMapper.getAllCanonicalIds();
    Object.keys(FEATURE_INDEX).forEach(id => {
        // Ignorar metadatos de interacción y fototipos
        if (id.startsWith('interaccion_') || id.startsWith('ft_') || id === 'edad') return;
        if (!canonicalIds.includes(id)) {
            unresolved.internal_orphans.push(id);
        }
    });

    // Deduplicar
    unresolved.ui = [...new Set(unresolved.ui)].sort();
    unresolved.derm1m = [...new Set(unresolved.derm1m)].sort();
    unresolved.skincon = [...new Set(unresolved.skincon)].sort();
    unresolved.internal_orphans = [...new Set(unresolved.internal_orphans)].sort();

    const reportPath = path.join(BASE_DIR, 'reports/unresolved_concepts_encoder.json');
    fs.writeFileSync(reportPath, JSON.stringify(unresolved, null, 2));

    const summaryPath = path.join(BASE_DIR, 'reports/unresolved_concepts_summary.md');
    let summary = "# Resumen de Conceptos No Resueltos (Encoder v1.1)\n\n";
    summary += "Este reporte identifica elementos que el motor reconoce (UI/Datasets) pero que no tienen un mapeo formal en la capa canónica.\n\n";
    
    summary += `## 1. UI (Formulario) - ${unresolved.ui.length} items sin resolver\n`;
    summary += "Estos campos en la web no se están traduciendo a conceptos canónicos (aunque se usen por su ID directo):\n";
    unresolved.ui.slice(0, 15).forEach(i => summary += `- \`${i}\`\n`);
    summary += "... (ver JSON)\n\n";

    summary += `## 2. SkinCon - ${unresolved.skincon.length} columnas sin resolver\n`;
    summary += "Características de SkinCon que el sistema ignora actualmente:\n";
    unresolved.skincon.slice(0, 15).forEach(i => summary += `- \`${i}\`\n`);
    summary += "\n";

    summary += `## 3. Huérfanos Internos - ${unresolved.internal_orphans.length} features\n`;
    summary += "Features en `constants.js` que no están documentadas en el mapa canónico:\n";
    unresolved.internal_orphans.slice(0, 15).forEach(i => summary += `- \`${i}\`\n`);

    fs.writeFileSync(summaryPath, summary);

    console.log("Reportes generados.");
}

audit();
