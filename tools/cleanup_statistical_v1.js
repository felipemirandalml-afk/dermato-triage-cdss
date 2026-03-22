import fs from 'fs';
import path from 'path';

const dataDir = 'd:/dermato-triage-cdss/data';
const legacyDataDir = 'd:/dermato-triage-cdss/data/legacy_v1';
const reportsDir = 'd:/dermato-triage-cdss/reports';
const legacyReportsDir = 'd:/dermato-triage-cdss/reports/legacy_v1';

// Mapeo de archivos para mover
const filesToMove = [
    // Data (v1 contaminada)
    { from: 'feature_discriminative_scores.json', to: 'feature_discriminative_scores_v1.json', dir: dataDir, dest: legacyDataDir },
    { from: 'feature_pair_scores.json', to: 'feature_pair_scores_v1.json', dir: dataDir, dest: legacyDataDir },
    { from: 'feature_triplet_scores.json', to: 'feature_triplet_scores_v1.json', dir: dataDir, dest: legacyDataDir },
    { from: 'syndromic_confusion_matrix.json', to: 'syndromic_confusion_matrix_v1.json', dir: dataDir, dest: legacyDataDir },
    { from: 'statistical_base_weights.json', to: 'statistical_base_weights_v1.json', dir: dataDir, dest: legacyDataDir },
    { from: 'contextual_pair_modulators.json', to: 'contextual_pair_modulators_v1.json', dir: dataDir, dest: legacyDataDir },
    { from: 'contextual_triplet_modulators.json', to: 'contextual_triplet_modulators_v1.json', dir: dataDir, dest: legacyDataDir },
    { from: 'syndrome_boosters.json', to: 'syndrome_boosters_v1.json', dir: dataDir, dest: legacyDataDir },

    // Reports (v1 contaminado)
    { from: 'feature_discrimination_analysis.md', to: 'feature_discrimination_analysis_v1.md', dir: reportsDir, dest: legacyReportsDir },
    { from: 'feature_pair_analysis.md', to: 'feature_pair_analysis_v1.md', dir: reportsDir, dest: legacyReportsDir },
    { from: 'feature_triplet_analysis.md', to: 'feature_triplet_analysis_v1.md', dir: reportsDir, dest: legacyReportsDir },
    { from: 'syndromic_confusion_analysis.md', to: 'syndromic_confusion_analysis_v1.md', dir: reportsDir, dest: legacyReportsDir },
    { from: 'syndromic_failure_source_analysis.md', to: 'syndromic_failure_source_analysis_v1.md', dir: reportsDir, dest: legacyReportsDir },
    { from: 'semiologic_noise_analysis.md', to: 'semiologic_noise_analysis_v1.md', dir: reportsDir, dest: legacyReportsDir },
    { from: 'advanced_contextual_explainability_matrix.md', to: 'advanced_contextual_explainability_matrix_v1.md', dir: reportsDir, dest: legacyReportsDir },
    { from: 'future_weight_explainability_matrix.md', to: 'future_weight_explainability_matrix_v1.md', dir: reportsDir, dest: legacyReportsDir },
    { from: 'contextual_weight_explainability_matrix.md', to: 'contextual_weight_explainability_matrix_v1.md', dir: reportsDir, dest: legacyReportsDir },
    { from: 'clinical_gestalt_map.md', to: 'clinical_gestalt_map_v1.md', dir: reportsDir, dest: legacyReportsDir }
];

console.log("=== INICIANDO ARCHIVADO DE ARTEFACTOS v1 ===");

filesToMove.forEach(f => {
    const src = path.join(f.dir, f.from);
    const dest = path.join(f.dest, f.to);
    
    if (fs.existsSync(src)) {
        fs.renameSync(src, dest);
        console.log(`- Archivado: ${f.from} -> ${path.join('legacy_v1', f.to)}`);
    } else {
        console.warn(`- No encontrado: ${f.from}`);
    }
});

console.log("=== ARCHIVADO COMPLETADO ===");
