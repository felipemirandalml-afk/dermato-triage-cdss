import { encodeFeatures, predict, explain, interpretResult, runTriage, FEATURE_INDEX, FEATURE_MAP_LABELS } from '../engine/model.js';
import { CLINICAL_CASES } from '../../validation/datasets/clinical_cases.js';
import { generateClinicalReport } from '../engine/export_service.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('triageForm');
    const resultsPanel = document.getElementById('resultsPanel');
    const resultCard = document.getElementById('resultCard');
    const btnDemo = document.getElementById('btnDemo');
    const btnReset = document.getElementById('btnReset');
    const btnNext = document.getElementById('btnNext');
    const btnPrev = document.getElementById('btnPrev');
    const btnCalculate = document.getElementById('btnCalculate');
    const btnAnalyzeGlobal = document.getElementById('btnAnalyzeGlobal');
    const validationMessage = document.getElementById('validationMessage');

    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    let currentTabIdx = 0;
    let lastResult = null;
    let lastFormData = null;

    // --- FASE 4: EXPORTACIÓN & IMPRESIÓN ---
    const btnCopy = document.getElementById('btnCopyReport');
    const btnPrint = document.getElementById('btnPrintReport');

    btnCopy?.addEventListener('click', async () => {
        if (!lastResult || !lastFormData) return;
        
        const report = generateClinicalReport(lastFormData, lastResult);
        try {
            await navigator.clipboard.writeText(report);
            
            // Feedback visual
            const originalText = btnCopy.innerHTML;
            btnCopy.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                ¡Copiado!
            `;
            setTimeout(() => {
                btnCopy.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                    Copiar Reporte
                `;
            }, 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
            alert('No se pudo copiar al portapapeles.');
        }
    });

    btnPrint?.addEventListener('click', () => {
        window.print();
    });

    // 1. UI: MANEJO DE TABS (Workflow Clínico Premium)
    function switchTab(index) {
        currentTabIdx = index;

        // Update Buttons
        btnPrev.classList.toggle('hidden', index === 0);
        btnNext.classList.toggle('hidden', index === tabs.length - 1);

        // Update Tab UI
        tabs.forEach((t, i) => {
            if (i === index) {
                t.classList.add('tab-active', 'ring-2', 'ring-blue-100');
                t.classList.remove('tab-inactive');
            } else {
                t.classList.remove('tab-active', 'ring-2', 'ring-blue-100');
                t.classList.add('tab-inactive');
            }
        });

        // Update Content
        tabContents.forEach((c, i) => {
            if (i === index) {
                c.classList.remove('hidden');
                c.classList.add('animate-in', 'fade-in', 'slide-in-from-right-4', 'duration-500');
            } else {
                c.classList.add('hidden');
            }
        });

        updateClinicalProgress(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateClinicalProgress(index) {
        const progress = document.getElementById('clinicalProgress');
        const dots = [
            document.getElementById('dot-step-1'),
            document.getElementById('dot-step-2'),
            document.getElementById('dot-step-3')
        ];

        // Update progress bar
        const width = (index / (tabs.length - 1)) * 100;
        progress.style.width = `${width}%`;

        // Update dots
        dots.forEach((dot, i) => {
            if (i <= index) {
                dot.classList.add('bg-blue-600', 'scale-110');
                dot.classList.remove('bg-slate-200');
            } else {
                dot.classList.remove('bg-blue-600', 'scale-110');
                dot.classList.add('bg-slate-200');
            }
        });
    }

    function updateBadges() {
        const sections = {
            'core': 'tab-patient',
            'extended': 'tab-morphology',
            'silver': 'tab-silver'
        };

        const badgeMap = {
            'tab-patient': document.getElementById('badge-core'),
            'tab-morphology': document.getElementById('badge-extended'),
            'tab-silver': document.getElementById('badge-silver')
        };

        Object.entries(sections).forEach(([name, id]) => {
            const section = document.getElementById(id);
            if (!section) return;
            
            const count = section.querySelectorAll('input[type="checkbox"]:checked').length;
            const badge = badgeMap[id];
            
            if (badge) {
                badge.textContent = count;
                if (count > 0) {
                    badge.classList.remove('bg-slate-300');
                    badge.classList.add('bg-blue-600', 'animate-in', 'zoom-in-50');
                } else {
                    badge.classList.add('bg-slate-300');
                    badge.classList.remove('bg-blue-600');
                }
            }
        });
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
        updateGlobalButtonState();
    });

    btnReset?.addEventListener('click', () => {
        form.reset();
        switchTab(0);
        resultsPanel.classList.add('hidden');
        updateGlobalButtonState();
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
    // --- VALIDACIÓN CLÍNICA MÍNIMA (P1 FIX + PREMIUM STATUS) ---
    function updateGlobalButtonState() {
        const age = document.getElementById('age').value;
        const timing = form.querySelector('input[name="timing"]:checked')?.value;

        const hasClinicalFeature = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).some(cb => {
            return cb.id.startsWith('lesion_') || 
                   cb.id.startsWith('sintoma_') || 
                   cb.id.startsWith('redflag_') || 
                   cb.id.startsWith('prodromo_') || 
                   cb.id.startsWith('despegamiento_') || 
                   cb.id.startsWith('borde_') || 
                   cb.id.startsWith('costra_') || 
                   cb.id.startsWith('purpura_') || 
                   cb.id.startsWith('engrosamiento_') ||
                   cb.id.startsWith('topo_') ||
                   cb.id.startsWith('signo_');
        });

        const hasSilverBullet = Array.from(form.querySelectorAll('#tab-silver input[type="checkbox"]:checked')).length > 0;

        const isMet = age && timing && hasClinicalFeature;

        // Update Badges
        updateBadges();

        if (isMet) {
            btnAnalyzeGlobal.disabled = false;
            btnAnalyzeGlobal.classList.replace('bg-blue-600/50', 'bg-blue-600');
            btnAnalyzeGlobal.classList.replace('text-white/50', 'text-white');
            btnAnalyzeGlobal.classList.remove('cursor-not-allowed');
            btnAnalyzeGlobal.classList.add('hover:bg-blue-700', 'shadow-blue-500/40', 'scale-100');
            
            // Status Message Premium
            if (hasSilverBullet) {
                validationMessage.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Alta Especificidad Detectada · Listo para Analizar`;
                validationMessage.classList.add('bg-emerald-950', 'border-emerald-500/50');
                validationMessage.classList.remove('bg-slate-800', 'border-slate-700');
            } else {
                validationMessage.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Datos Suficientes · Listo para Analizar`;
                validationMessage.classList.remove('bg-emerald-950', 'border-emerald-500/50');
                validationMessage.classList.add('bg-slate-800', 'border-slate-700');
            }
            
            validationMessage.classList.remove('opacity-0', 'pointer-events-none');
            validationMessage.classList.add('opacity-100');
        } else {
            btnAnalyzeGlobal.disabled = true;
            btnAnalyzeGlobal.classList.replace('bg-blue-600', 'bg-blue-600/50');
            btnAnalyzeGlobal.classList.replace('text-white', 'text-white/50');
            btnAnalyzeGlobal.classList.add('cursor-not-allowed');
            
            let missing = [];
            if (!age) missing.push("Edad");
            if (!timing) missing.push("Temporalidad");
            if (!hasClinicalFeature) missing.push("1 Hallazgo");
            
            validationMessage.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Faltante sugerido: ${missing.join(', ')}`;
            validationMessage.classList.remove('bg-emerald-950', 'border-emerald-500/50');
            validationMessage.classList.add('bg-slate-800', 'border-slate-700');
            validationMessage.classList.add('opacity-100');
        }
    }

    // Listener para validación en tiempo real
    form.addEventListener('input', updateGlobalButtonState);
    form.addEventListener('change', updateGlobalButtonState);

    // Initial check
    updateGlobalButtonState();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            age: document.getElementById('age').value,
            fitzpatrick: document.getElementById('fitzpatrick').value,
            timing: form.querySelector('input[name="timing"]:checked')?.value
        };

        const sex = form.querySelector('input[name="sex"]:checked')?.value;
        if (sex) formData.sex = sex;

        form.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
            formData[cb.id] = true;
        });

        if (!validateData(formData)) return;

        const interpretation = runTriage(formData);
        
        lastResult = interpretation;
        lastFormData = formData;

        renderResults(interpretation, formData);
        
        // Scroll suave al panel de resultados
        resultsPanel.scrollIntoView({ behavior: 'smooth' });
    });

    function validateData(data) {
        if (!data.age) {
            alert('Por favor, ingrese la edad del paciente en el Paso 1 (Datos Core).');
            switchTab(0);
            document.getElementById('age').focus();
            return false;
        }
        return true;
    }

    function renderResults(res, formData) {
        resultsPanel.classList.remove('hidden');
        resultsPanel.scrollIntoView({ behavior: 'smooth' });

        // Timestamp Formateado (Médico)
        const now = new Date();
        const dateStr = now.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('currentTimestamp').textContent = `${dateStr} ${timeStr}`;

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
        const clinicalLabel = res.priority === 1 ? 'Urgencia' : (res.priority === 2 ? 'Prioritario' : 'Estable');
        document.getElementById('priorityLabel').textContent = clinicalLabel;
        document.getElementById('priorityLabel').className = `text-5xl md:text-6xl font-black tracking-tighter leading-none ${theme.color} lowercase first-letter:uppercase`;

        const badge = document.getElementById('priorityBadge');
        badge.textContent = `Nivel Triage P${res.priority}`;
        badge.className = `px-5 py-2 rounded-full text-[12px] font-black uppercase tracking-[0.1em] border shadow-sm ${theme.badge}`;

        // Case ID
        document.getElementById('caseId').textContent = Math.floor(1000 + Math.random() * 9000);

        // Conducta
        document.getElementById('suggestedConduct').textContent = res.conduct;
        document.getElementById('recommendedTimeframe').textContent = res.timeframe;

        // Red Flag Badge
        const redFlagBadge = document.getElementById('redFlagBadge');
        if (res.redFlags && res.redFlags.length > 0) {
            redFlagBadge.classList.remove('hidden');
        } else {
            redFlagBadge.classList.add('hidden');
        }

        // Modifier Panel (Ajustes de Seguridad)
        const modPanel = document.getElementById('activeAdjustmentsPanel');
        const modContainer = document.getElementById('adjustmentsContainer');
        if (res.modifier) {
            modPanel.classList.remove('hidden');
            modContainer.textContent = res.modifier;
        } else {
            modPanel.classList.add('hidden');
        }

        // Justificación
        document.getElementById('clinicalJustification').textContent = res.justification;

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
            const topSyndrome = pa.top_syndrome;
            const topProb = pa.top_probability * 100;
            document.getElementById('topSyndromeName').textContent = topSyndrome ? (syndromeLabels[topSyndrome] || topSyndrome) : "Patrón Indeterminado";
            document.getElementById('topSyndromeProb').textContent = `${topProb.toFixed(1)}%`;
            
            // Animación barra de progreso premium
            const progressBar = document.getElementById('topSyndromeProgressBar');
            if (progressBar) {
                setTimeout(() => {
                    progressBar.style.width = `${topProb}%`;
                    // Color dinámico según probabilidad
                    if (topProb > 80) progressBar.classList.replace('bg-blue-600', 'bg-emerald-500');
                    else if (topProb < 40) progressBar.classList.replace('bg-blue-600', 'bg-amber-500');
                    else progressBar.className = 'absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-1000';
                }, 100);
            }

            // Lógica de Confianza Diagnóstica
            const confPanel = document.getElementById('confidencePanel');
            const confBadge = document.getElementById('confidenceBadge');
            const confText = document.getElementById('confidenceText');

            confPanel.classList.remove('hidden');

            const levelMap = {
                "high": { 
                    label: "ALTA CONSISTENCIA", 
                    color: "bg-emerald-50 text-emerald-700 border-emerald-100", 
                    text: "Presentación clínica altamente compatible con las pautas diagnósticas del síndrome sugerido." 
                },
                "medium": { 
                    label: "SUGESTIVO", 
                    color: "bg-blue-50 text-blue-700 border-blue-100", 
                    text: "El patrón es probable, pero se recomienda descartar diagnósticos diferenciales con examen físico." 
                },
                "low": { 
                    label: "ANÁLISIS AMBIGUO", 
                    color: "bg-rose-50 text-rose-700 border-rose-100", 
                    text: pa.message || "Presentación atípica o indeterminada. No se puede descartar sobreposición de cuadros. Se sugiere interconsulta." 
                }
            };

            const config = { ...(levelMap[pa.confidence_level] || levelMap.low) };

            if (pa.is_multi_syndrome && pa.confidence_level !== 'low') {
                config.text = "El patrón presenta ambigüedad clínica relevante. El ranking diferencial ha sido expandido automáticamente para incluir candidatos de los síndromes más probables.";
            }

            confBadge.textContent = config.label;
            confBadge.className = `text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter leading-none border ${config.color}`;
            confText.textContent = config.text;
            confPanel.className = `p-5 rounded-2xl border transition-all duration-300 ${config.color}`;

            // --- ACTIVACIÓN DEL REASONING MAP (DINÁMICO) ---
            let reasoningPanel = document.getElementById('reasoningInsightPanel');
            if (!reasoningPanel) {
                // Inyectar dinámicamente si no existe
                const panelHtml = `
                    <div id="reasoningInsightPanel" class="hidden p-6 bg-slate-100/50 border border-slate-200/50 rounded-3xl space-y-5 animate-in fade-in duration-500 mt-6">
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <span class="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded tracking-widest uppercase">Perspectiva Clínica</span>
                            </div>
                            <p id="reasoningSummaryText" class="text-xs text-slate-600 font-medium italic leading-relaxed"></p>
                        </div>
                        <div id="syndromeRedFlagsSection" class="space-y-3 pt-3 border-t border-slate-200/50 hidden">
                            <span class="text-[9px] font-black text-rose-600 uppercase tracking-widest block">Signos Críticos a Descartar (Vigilancia)</span>
                            <div id="syndromeRedFlagsContainer" class="flex flex-wrap gap-2"></div>
                        </div>
                        <div class="pt-3 border-t border-slate-200/50">
                            <div class="flex items-start gap-3 p-3 bg-white/60 rounded-xl border border-white">
                                <span class="text-lg">💡</span>
                                <div class="flex flex-col">
                                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Perla Clínica</span>
                                    <p id="clinicalPearlText" class="text-[11px] font-bold text-slate-700 leading-tight mt-1"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                confPanel.insertAdjacentHTML('afterend', panelHtml);
                reasoningPanel = document.getElementById('reasoningInsightPanel');
            }

            if (res.reasoning_insights) {
                reasoningPanel.classList.remove('hidden');
                document.getElementById('reasoningSummaryText').textContent = res.reasoning_insights.summary;
                document.getElementById('clinicalPearlText').textContent = res.reasoning_insights.pearl;

                const srSection = document.getElementById('syndromeRedFlagsSection');
                const srContainer = document.getElementById('syndromeRedFlagsContainer');
                
                if (res.reasoning_insights.expected_red_flags?.length > 0) {
                    srSection.classList.remove('hidden');
                    srContainer.innerHTML = res.reasoning_insights.expected_red_flags.map(flag => `
                        <span class="px-3 py-1 bg-white text-slate-500 border border-slate-200 rounded-lg text-[9px] font-bold uppercase tracking-tight flex items-center gap-2">
                            <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                            ${flag}
                        </span>
                    `).join('');
                } else {
                    srSection.classList.add('hidden');
                }

                // Estilo especial para Mismatch / Alineación Atípica
                if (res.alignment_note) {
                    reasoningPanel.className = "p-6 bg-amber-50 border border-amber-200 rounded-3xl space-y-5 animate-in fade-in duration-500 mt-6";
                    reasoningPanel.querySelector('span.text-blue-600').className = "text-[9px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded tracking-widest uppercase";
                    reasoningPanel.querySelector('span.text-blue-600').textContent = "Perspectiva Clínica (Atípica)";
                } else {
                    reasoningPanel.className = "p-6 bg-slate-100/50 border border-slate-200/50 rounded-3xl space-y-5 animate-in fade-in duration-500 mt-6";
                }
            } else {
                reasoningPanel.classList.add('hidden');
            }

            // Capa de Diagnóstico Diferencial Clínico (Top 3)
            const diffPanel = document.getElementById('differentialPanel');
            const diffContainer = document.getElementById('differentialRankingContainer');

            if (res.differential_ranking && res.differential_ranking.length > 0) {
                diffPanel.classList.remove('hidden');
                
                const compThemes = {
                    'Alta': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    'Media': 'bg-blue-50 text-blue-700 border-blue-200',
                    'Baja': 'bg-amber-50 text-amber-700 border-amber-200',
                    'No determinada': 'bg-slate-50 text-slate-500 border-slate-200'
                };

                diffContainer.innerHTML = res.differential_ranking.map((item, idx) => `
                    <div class="flex flex-col gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div class="flex justify-between items-start">
                            <div class="flex flex-col">
                                <h6 class="text-sm font-black text-slate-800 uppercase tracking-tight">${item.disease_name}</h6>
                                <span class="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">Ranking #${idx + 1}</span>
                            </div>
                            <span class="text-[10px] font-black px-2.5 py-1 rounded-full border shadow-sm ${compThemes[item.compatibility] || compThemes['No determinada']}">
                                Compatibilidad ${item.compatibility}
                            </span>
                        </div>
                        
                        <div class="space-y-2.5 mt-1">
                            ${item.matched_rules && item.matched_rules.length > 0 ? `
                                <div class="flex flex-wrap gap-1.5">
                                    ${item.matched_rules.map(rule => `
                                        <span class="text-[9px] font-bold text-amber-700 bg-amber-50/50 px-2 py-1 rounded-md border border-amber-100 italic">
                                            ✨ ${rule}
                                        </span>
                                    `).join('')}
                                </div>
                            ` : ''}

                            <div class="grid grid-cols-2 gap-3">
                                <div class="space-y-1">
                                    <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Hallazgos de Apoyo</span>
                                    <div class="flex flex-wrap gap-1">
                                        ${item.supporting_features && item.supporting_features.length > 0 ? 
                                            item.supporting_features.map(f => `
                                                <span class="text-[9px] font-bold text-emerald-600 lowercase bg-emerald-50/30 px-1.5 py-0.5 rounded italic opacity-90">• ${f}</span>
                                            `).join('') :
                                            '<span class="text-[9px] text-slate-300 italic">Sin hallazgos típicos</span>'
                                        }
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Ausencia Crítica (Discordancia)</span>
                                    <div class="flex flex-wrap gap-1">
                                        ${item.missing_critical_features && item.missing_critical_features.length > 0 ? 
                                            item.missing_critical_features.map(f => `
                                                <span class="text-[9px] font-bold text-rose-500 lowercase bg-rose-50/30 px-1.5 py-0.5 rounded italic opacity-95">! ${f}</span>
                                            `).join('') :
                                            '<span class="text-[9px] text-slate-300 italic">—</span>'
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Progress Bar for Score (Dynamic) -->
                        <div class="absolute bottom-0 left-0 h-0.5 bg-slate-100 w-full overflow-hidden">
                             <div class="h-full ${item.score > 10 ? 'bg-emerald-500' : (item.score > 4 ? 'bg-blue-500' : 'bg-amber-500')}" style="width: ${Math.min(100, item.score * 5)}%"></div>
                        </div>
                    </div>
                `).join('');
            } else {
                diffPanel.classList.add('hidden');
            }
        }

        // RAZONAMIENTO DEL SISTEMA (FASE 3)
        const pa = res.probabilistic_analysis;
        
        // 1. Alertas de Triage (Reglas Heurísticas)
        const alertsContainer = document.getElementById('triageAlertsContainer');
        if (res.triggered_rules && res.triggered_rules.length > 0) {
            alertsContainer.innerHTML = res.triggered_rules.map(rule => {
                const isCritical = rule.includes('🚨');
                const isWarning = rule.includes('⚠️');
                const bgColor = isCritical ? 'bg-rose-50 border-rose-100 text-rose-800' : (isWarning ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-blue-50 border-blue-100 text-blue-800');
                const icon = isCritical ? '🚩' : (isWarning ? '⚠️' : 'ℹ️');
                return `
                    <div class="flex items-center gap-3 p-3 ${bgColor} border rounded-xl font-bold text-xs">
                        <span class="text-lg leading-none">${icon}</span>
                        <span>${rule.replace('🚨','').replace('⚠️','').trim()}</span>
                    </div>
                `;
            }).join('');
        } else {
            alertsContainer.innerHTML = '<span class="text-[10px] text-slate-400 italic font-medium">Protocolo estándar sin alertas excepcionales detectadas.</span>';
        }

        // 2. Importancia de Features (Probabilística)
        // Agrupación por Categoría para claridad clínica
        const CATEGORY_MAP = {
            'lesion_': 'Morfología',
            'topo_': 'Topografía',
            'topog_': 'Topografía',
            'patron_': 'Semiología',
            'signo_': 'Sistémico',
            'edad': 'Basales',
            'farmacos': 'Antecedentes',
            'inmuno': 'Antecedentes',
            'prodromo_': 'Crítico HD',
            'despegamiento_': 'Crítico HD',
            'borde_': 'Específico HD',
            'costra_m': 'Específico HD',
            'purpura_p': 'Vascular HD',
            'engrosamiento_': 'Uñas HD'
        };

        const formatFeat = (f) => {
            const label = (FEATURE_MAP_LABELS && FEATURE_MAP_LABELS[f.key]) || 
                         f.key.replace('lesion_','').replace('topo_','').replace('topog_','').replace('patron_','').toUpperCase().replace(/_/g, ' ');
            
            let category = 'Otros';
            for (const [prefix, cat] of Object.entries(CATEGORY_MAP)) {
                if (f.key.startsWith(prefix)) {
                    category = cat;
                    break;
                }
            }

            return `
                <div class="flex flex-col group py-1.5 border-b border-slate-50 last:border-0">
                    <div class="flex justify-between items-center">
                        <div class="flex flex-col">
                            <span class="text-[11px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors uppercase tracking-tight">${label}</span>
                            <span class="text-[8px] font-black text-slate-300 uppercase tracking-widest">${category}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full ${f.impact > 0 ? 'bg-emerald-400' : 'bg-rose-400'}" style="width: ${Math.min(100, Math.abs(f.impact) * 8)}%"></div>
                            </div>
                            <span class="text-[9px] font-black w-7 text-right font-mono ${f.impact > 0 ? 'text-emerald-500' : 'text-rose-500'}">
                                ${f.impact > 0 ? '+' : '-'}${Math.abs(f.impact).toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        };

        if (pa && pa.feature_importance) {
            const posCont = document.getElementById('positiveImportanceContainer');
            const negCont = document.getElementById('negativeImportanceContainer');
            
            posCont.innerHTML = pa.feature_importance.positive.length > 0 
                ? pa.feature_importance.positive.map(formatFeat).join('') 
                : '<span class="text-[10px] text-slate-300 italic">No hay aportes determinantes presentes</span>';
                
            negCont.innerHTML = pa.feature_importance.negative.length > 0 
                ? pa.feature_importance.negative.map(formatFeat).join('') 
                : '<span class="text-[10px] text-slate-300 italic">No hay factores de discordancia detectados</span>';
        }

        // Red Flags Container
        const rfPanel = document.getElementById('redFlagsPanel');
        const rfContainer = document.getElementById('redFlagsContainer');
        if (res.redFlags && res.redFlags.length > 0) {
            rfPanel.classList.remove('hidden');
            rfContainer.innerHTML = res.redFlags.map(flag => `
                <span class="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-tight flex items-center gap-2 animate-in zoom-in-95 duration-300">
                    <span class="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                    ${flag}
                </span>
            `).join('');
        } else {
            rfPanel.classList.add('hidden');
        }

        // Disclaimer Externo
        document.getElementById('disclaimerText').textContent = res.disclaimer;
    }
});
