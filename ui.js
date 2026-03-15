import { encodeFeatures, predict, explain, interpretResult, runTriage, FEATURE_INDEX } from './model.js';
import { CLINICAL_CASES } from './data/clinical_cases.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('triageForm');
    const resultsPanel = document.getElementById('resultsPanel');
    const resultCard = document.getElementById('resultCard');
    const btnDemo = document.getElementById('btnDemo');
    const btnReset = document.getElementById('btnReset');
    const btnNext = document.getElementById('btnNext');
    const btnPrev = document.getElementById('btnPrev');
    const btnCalculate = document.getElementById('btnCalculate');

    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    let currentTabIdx = 0;
    let reasoningMap = null;

    async function loadReasoningMap() {
        try {
            const response = await fetch('./engine/dermatology_reasoning_map.json');
            reasoningMap = await response.json();
            console.log('Clinical Reasoning Map Loaded');
        } catch (e) {
            console.warn('Clinical Reasoning Map not available offline currently:', e);
        }
    }
    loadReasoningMap();

    // 1. UI: MANEJO DE TABS (Workflow Clínico)
    function switchTab(index) {
        currentTabIdx = index;

        // Update Buttons
        btnPrev.classList.toggle('hidden', index === 0);
        btnNext.classList.toggle('hidden', index === tabs.length - 1);
        btnCalculate.classList.toggle('hidden', index !== tabs.length - 1);

        // Update Tab UI
        tabs.forEach((t, i) => {
            if (i === index) {
                t.classList.add('tab-active');
                t.classList.remove('tab-inactive');
            } else {
                t.classList.remove('tab-active');
                t.classList.add('tab-inactive');
            }
        });

        // Update Content
        tabContents.forEach((c, i) => {
            c.classList.toggle('hidden', i !== index);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => switchTab(index));
    });

    btnNext?.addEventListener('click', () => {
        if (currentTabIdx < tabs.length - 1) switchTab(currentTabIdx + 1);
    });

    btnPrev?.addEventListener('click', () => {
        if (currentTabIdx > 0) switchTab(currentTabIdx - 1);
    });

    // 2. DEMO: CARGAR CASOS
    btnDemo?.addEventListener('click', () => {
        const randomCase = CLINICAL_CASES[Math.floor(Math.random() * CLINICAL_CASES.length)];
        loadCase(randomCase);
        switchTab(0); // Volver al inicio
        alert(`Situación Clínica Cargada: ${randomCase.title}`);
    });

    btnReset?.addEventListener('click', () => {
        form.reset();
        resultsPanel.classList.add('hidden');
        switchTab(0);
    });

    function loadCase(caseData) {
        form.reset();
        if (caseData.input.age) document.getElementById('age').value = caseData.input.age;
        if (caseData.input.fitzpatrick) document.getElementById('fitzpatrick').value = caseData.input.fitzpatrick;

        Object.keys(caseData.input).forEach(key => {
            const el = document.getElementById(key);
            if (el && el.type === 'checkbox') {
                el.checked = true;
            }
        });

        const sexRadio = document.getElementById(`sexo_${caseData.input.sex || 'male'}`);
        if (sexRadio) sexRadio.checked = true;

        const timingRadio = form.querySelector(`input[name="timing"][value="${caseData.input.timing}"]`);
        if (timingRadio) timingRadio.checked = true;
        console.log(`Cargado Caso Demo: ${caseData.title}`);
    }

    // 3. INFERENCIA Y RENDER
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            age: document.getElementById('age').value,
            fitzpatrick: document.getElementById('fitzpatrick').value,
            timing: form.querySelector('input[name="timing"]:checked')?.value
        };

        const sex = form.querySelector('input[name="sex"]:checked')?.value;
        if (sex) formData[`sexo_${sex}`] = true;

        form.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
            formData[cb.id] = true;
        });

        if (!validateData(formData)) return;

        const interpretation = runTriage(formData);

        renderResults(interpretation, formData);
    });

    function validateData(data) {
        if (!data.age) {
            alert('Por favor, ingrese la edad del paciente en el Paso 1.');
            switchTab(0);
            document.getElementById('age').focus();
            return false;
        }
        return true;
    }

    function renderResults(res, formData) {
        resultsPanel.classList.remove('hidden');
        resultsPanel.scrollIntoView({ behavior: 'smooth' });

        // Temas Visuales por Prioridad
        const themes = {
            1: { color: 'text-rose-600', badge: 'bg-rose-50 text-rose-700 border-rose-200', border: 'border-t-rose-600', score: 'bg-rose-600' },
            2: { color: 'text-amber-600', badge: 'bg-amber-50 text-amber-700 border-amber-200', border: 'border-t-amber-500', score: 'bg-amber-500' },
            3: { color: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', border: 'border-t-emerald-500', score: 'bg-emerald-500' }
        };
        const theme = themes[res.priority] || themes[3];

        // Card Styling
        resultCard.className = `clinical-card p-0 overflow-hidden transition-all duration-500 border-t-4 bg-white ${theme.border}`;

        // Header
        const clinicalLabel = res.priority === 1 ? 'Urgencial' : (res.priority === 2 ? 'Prioritario' : 'Estable');
        document.getElementById('priorityLabel').textContent = clinicalLabel;
        document.getElementById('priorityLabel').className = `text-4xl md:text-5xl font-black tracking-tighter leading-none ${theme.color}`;

        const badge = document.getElementById('priorityBadge');
        badge.textContent = `Prioridad P${res.priority}`;
        badge.className = `px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest border shadow-sm ${theme.badge}`;

        // Case ID
        document.getElementById('caseId').textContent = Math.floor(1000 + Math.random() * 9000);

        // Conducta
        document.getElementById('suggestedConduct').textContent = res.conduct;
        document.getElementById('recommendedTimeframe').textContent = res.timeframe;

        // Modifier Panel (Ajustes de Seguridad)
        const modPanel = document.getElementById('activeAdjustmentsPanel');
        const modContainer = document.getElementById('adjustmentsContainer');
        if (res.modifier) {
            modPanel.classList.remove('hidden');
            modContainer.textContent = res.modifier;
        } else {
            modPanel.classList.add('hidden');
        }

        // Red Flags
        const rfPanel = document.getElementById('redFlagsPanel');
        const rfContainer = document.getElementById('redFlagsContainer');
        if (res.redFlags && res.redFlags.length > 0) {
            rfPanel.classList.remove('hidden');
            rfContainer.innerHTML = res.redFlags.map(flag => `
                <span class="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded text-[10px] font-bold uppercase tracking-tight">
                    • ${flag}
                </span>
            `).join('');
        } else {
            rfPanel.classList.add('hidden');
        }

        // Justificación
        document.getElementById('clinicalJustification').textContent = res.justification;

        // Probabilidades (Diseño Compacto)
        const probLabels = ["Estable (P3)", "Prioritario (P2)", "Urgencial (P1)"];
        const probThemes = [themes[3], themes[2], themes[1]];
        document.getElementById('probabilityList').innerHTML = res.probabilities.map((p, i) => `
            <div class="space-y-2">
                <div class="flex justify-between items-end">
                    <span class="text-[10px] font-black uppercase text-slate-400 tracking-widest">${probLabels[i]}</span>
                    <span class="text-xs font-bold text-slate-700 font-mono">${(p * 100).toFixed(1)}%</span>
                </div>
                <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="${probThemes[i].score} h-full transition-all duration-1000 ease-out" style="width: ${p * 100}%"></div>
                </div>
            </div>
        `).join('');

        // Inferencia de Síndrome (ML)
        if (res.probabilistic_analysis) {
            const syndromeLabels = {
                'eczema_dermatitis': "Eczema / Dermatitis",
                'psoriasiform_dermatosis': "Dermatosis Psoriasiforme",
                'bacterial_skin_infection': "Infección Bacteriana",
                'viral_skin_infection': "Infección Viral",
                'fungal_skin_infection': "Infección Fúngica",
                'drug_reaction': "Reacción a Fármacos",
                'urticarial_dermatosis': "Urticaria / Angioedema",
                'vesiculobullous_disease': "Enfermedad Ampollosa",
                'vasculitic_purpuric_disease': "Vasculitis / Púrpura",
                'cutaneous_tumor_suspected': "Sospecha de Neoplasia Maligna",
                'benign_cutaneous_tumor': "Tumoración Benigna",
                'inflammatory_dermatosis_other': "Otra Dermatosis Inflamatoria"
            };

            const pa = res.probabilistic_analysis;
            document.getElementById('topSyndromeName').textContent = syndromeLabels[pa.top_syndrome] || pa.top_syndrome;
            document.getElementById('topSyndromeProb').textContent = `${(pa.top_probability * 100).toFixed(1)}%`;

            // Lógica de Confianza Diagnóstica
            const confPanel = document.getElementById('confidencePanel');
            const confBadge = document.getElementById('confidenceBadge');
            const confText = document.getElementById('confidenceText');

            confPanel.classList.remove('hidden');

            // Calcular Gap (Top1 vs Top2)
            const sortedProbs = Object.values(pa.syndrome_probabilities).sort((a, b) => b - a);
            const gap = sortedProbs[0] - sortedProbs[1];

            let level = "ALTA";
            let colorClass = "bg-emerald-100 text-emerald-700 border-emerald-200";
            let interpretation = "El modelo identifica un patrón clínico claro y consistente.";

            if (pa.top_probability < 0.60) {
                level = "BAJA";
                colorClass = "bg-rose-100 text-rose-700 border-rose-200";
                interpretation = "El modelo no identifica un patrón claro. Se requiere revisión exhaustiva.";
            } else if (gap < 0.15) {
                level = "AMBIGUO";
                colorClass = "bg-amber-100 text-amber-700 border-amber-200";
                interpretation = "Diferencial estrecho entre los dos diagnósticos más probables.";
            } else if (pa.top_probability < 0.85) {
                level = "MEDIA";
                colorClass = "bg-blue-100 text-blue-700 border-blue-200";
                interpretation = "El modelo sugiere una tendencia, pero con margen de variabilidad.";
            }

            confBadge.textContent = level;
            confBadge.className = `text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter leading-none border ${colorClass}`;
            confText.textContent = interpretation;
            confPanel.className = `mt-3 p-3 rounded-lg border flex flex-col gap-1 transition-all duration-300 ${colorClass.split(' ')[0]} ${colorClass.split(' ')[2]}`;

            // Capa de Razonamiento Clínico (Ontología Derm1M)
            const reasoningPanel = document.getElementById('reasoningPanel');
            const ontologyInfo = res.ontology_info;

            if (ontologyInfo) {
                reasoningPanel.classList.remove('hidden');
                document.getElementById('reasoningGroup').textContent = ontologyInfo.macro_group;
                document.getElementById('reasoningSubgroup').textContent = ontologyInfo.subgroup || 'Sin Subgrupo';
                document.getElementById('reasoningSummary').textContent = `Foco Clínico: ${ontologyInfo.ontology_reference}`;

                document.getElementById('reasoningDifferentials').innerHTML = ontologyInfo.differentials.slice(0, 6).map(diff => `
                    <span class="px-2 py-1 bg-white text-slate-600 rounded text-[10px] font-bold border border-slate-200 shadow-sm">
                        ${diff}
                    </span>
                `).join('');

                // Mostrar Hallazgos Cardinales (Claves Diagnósticas)
                const rfContainer = document.getElementById('reasoningRedFlagsContainer');
                const rfList = document.getElementById('reasoningRedFlags');
                const rfLabel = rfContainer.querySelector('span');

                if (ontologyInfo.applied_cardinal_rules && ontologyInfo.applied_cardinal_rules.length > 0) {
                    rfContainer.classList.remove('hidden');
                    rfLabel.textContent = "Claves Diagnósticas (Hallazgos Cardinales)";
                    rfLabel.className = "text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-2 italic";
                    
                    rfList.innerHTML = ontologyInfo.applied_cardinal_rules.map(rule => `
                        <div class="flex items-start gap-2">
                            <span class="text-blue-500 font-black">•</span>
                            <div class="flex flex-col">
                                <span class="text-[10px] font-bold text-slate-700 leading-tight">${rule.label}</span>
                                <span class="text-[9px] text-slate-400 italic">${rule.rationale}</span>
                            </div>
                        </div>
                    `).join('');
                } else {
                    rfContainer.classList.add('hidden');
                }
            } else if (reasoningMap && pa.top_syndrome && reasoningMap[pa.top_syndrome]) {
                // Fallback a mapa de razonamiento antiguo si existe
                const r = reasoningMap[pa.top_syndrome];
                reasoningPanel.classList.remove('hidden');
                document.getElementById('reasoningGroup').textContent = r.clinical_group.replace(/_/g, ' ');
                document.getElementById('reasoningSubgroup').textContent = (r.subgroup || 'No especificado').replace(/_/g, ' ');
                document.getElementById('reasoningSummary').textContent = r.reasoning_summary;

                document.getElementById('reasoningDifferentials').innerHTML = r.possible_differentials.slice(0, 5).map(diff => `
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">
                        ${diff}
                    </span>
                `).join('');

                const rfContainer = document.getElementById('reasoningRedFlagsContainer');
                const rfList = document.getElementById('reasoningRedFlags');

                if (r.red_flags && r.red_flags.length > 0) {
                    rfContainer.classList.remove('hidden');
                    rfList.innerHTML = r.red_flags.map(f => `
                        <div class="flex items-start gap-2">
                            <span class="text-rose-500 font-black">•</span>
                            <span class="text-[10px] font-bold text-slate-500 leading-tight">${f}</span>
                        </div>
                    `).join('');
                } else {
                    rfContainer.classList.add('hidden');
                }
            } else {
                reasoningPanel.classList.add('hidden');
            }
        }


        // Señales de Peso Semiológico
        const X = encodeFeatures(formData);
        const expl = explain(X, res.classIdx);

        document.getElementById('explainabilityList').innerHTML = expl.map(c => `
            <li class="flex justify-between items-center group">
                <span class="text-sm font-medium text-slate-500 group-hover:text-slate-800 transition-colors">${c.name}</span>
                <div class="flex items-center gap-2">
                    <div class="w-16 h-1 bg-slate-50 rounded-full overflow-hidden">
                        <div class="h-full ${c.val > 0 ? 'bg-blue-400' : 'bg-emerald-400'}" style="width: ${Math.min(100, Math.abs(c.val) * 5)}%"></div>
                    </div>
                    <span class="text-[10px] font-bold font-mono w-8 text-right ${c.val > 0 ? 'text-blue-600' : 'text-emerald-600'}">
                        ${c.val > 0 ? '+' : ''}${c.val.toFixed(1)}
                    </span>
                </div>
            </li>
        `).join('');

        // Disclaimer Externo
        document.getElementById('disclaimerText').textContent = res.disclaimer;
    }
});
