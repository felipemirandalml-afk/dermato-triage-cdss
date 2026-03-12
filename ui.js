import { encodeFeatures, predict, explain, interpretResult, FEATURE_INDEX } from './model.js';
import { CLINICAL_CASES } from './clinical_cases.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('triageForm');
    const resultsPanel = document.getElementById('resultsPanel');
    const resultCard = document.getElementById('resultCard');
    const btnDemo = document.getElementById('btnDemo');
    const btnReset = document.getElementById('btnReset');

    // 1. UI: MANEJO DE ACORDEONES (Topografía Jerárquica)
    document.querySelectorAll('.region-trigger').forEach(trigger => {
        const cb = trigger.querySelector('input');
        const menu = document.getElementById(trigger.dataset.target);
        if (menu) menu.classList.add('hidden');
        
        trigger.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                cb.checked = !cb.checked;
                cb.dispatchEvent(new Event('change'));
            }
        });

        cb.addEventListener('change', () => {
            if (cb.checked) {
                menu.classList.add('open');
                menu.classList.remove('hidden');
            } else {
                menu.classList.remove('open');
                setTimeout(() => {
                    if (!cb.checked) menu.classList.add('hidden');
                }, 500);
            }
        });
    });

    // 2. DEMO: CARGAR CASOS ALEATORIOS
    btnDemo?.addEventListener('click', () => {
        const randomCase = CLINICAL_CASES[Math.floor(Math.random() * CLINICAL_CASES.length)];
        loadCase(randomCase);
        alert(`Demo Cargada: ${randomCase.title}\n\n${randomCase.short_clinical_summary}`);
    });

    btnReset?.addEventListener('click', () => {
        form.reset();
        document.querySelectorAll('.cascade-menu').forEach(m => {
            m.classList.remove('open');
            m.classList.add('hidden');
        });
        resultsPanel.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function loadCase(caseData) {
        form.reset();
        document.querySelectorAll('.cascade-menu').forEach(m => {
            m.classList.remove('open');
            m.classList.add('hidden');
        });

        if (caseData.input.age) document.getElementById('age').value = caseData.input.age;
        if (caseData.input.fitzpatrick) document.getElementById('fitzpatrick').value = caseData.input.fitzpatrick;
        
        Object.keys(caseData.input).forEach(key => {
            const el = document.getElementById(key);
            if (el && el.type === 'checkbox') {
                el.checked = true;
                const parentMenu = el.closest('.cascade-menu');
                if (parentMenu) {
                    parentMenu.classList.add('open');
                    parentMenu.classList.remove('hidden');
                    const triggerId = parentMenu.id.replace('sub-', 'topog_');
                    const triggerEl = document.getElementById(triggerId);
                    if (triggerEl) triggerEl.checked = true;
                }
            }
        });

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

        form.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
            formData[cb.id] = true;
        });

        if (!validateData(formData)) return;

        const X = encodeFeatures(formData);
        const rawPrediction = predict(X);
        const interpretation = interpretResult(X, rawPrediction);

        renderResults(interpretation);
    });

    function validateData(data) {
        if (!data.age) {
            alert('Por favor, ingrese la edad del paciente.');
            document.getElementById('age').focus();
            return false;
        }
        return true;
    }

    function renderResults(res) {
        const themes = {
            1: { color: 'text-rose-600', bg: 'bg-rose-100/50 text-rose-800', border: '#e11d48' },
            2: { color: 'text-amber-500', bg: 'bg-amber-100 text-amber-800', border: '#f59e0b' },
            3: { color: 'text-emerald-600', bg: 'bg-emerald-100 text-emerald-800', border: '#10b981' }
        };

        const theme = themes[res.priority];

        resultsPanel.classList.remove('hidden');
        resultsPanel.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            resultCard.classList.remove('scale-95', 'opacity-0');
            resultCard.classList.add('scale-100', 'opacity-100');
            resultCard.style.borderColor = theme.border;
        }, 100);

        // Header
        document.getElementById('priorityText').textContent = res.label;
        document.getElementById('priorityText').className = `text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-6 ${theme.color}`;
        
        const badge = document.getElementById('badgeStatus');
        badge.textContent = res.priority === 1 ? '⚠️ Urgencia Vital' : (res.priority === 2 ? '⚡ Prioridad Media' : '✅ Seguimiento');
        badge.className = `inline-block px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${theme.bg}`;

        // Conducta
        document.getElementById('suggestedConduct').textContent = res.conduct;
        document.getElementById('recommendedTimeframe').textContent = res.timeframe;

        // Modifier Badge (Específico de v1.0.0)
        // Limpiamos badges previos si existen
        const oldBadge = document.getElementById('activeModifierBadge');
        if (oldBadge) oldBadge.remove();

        if (res.modifier) {
            const modHtml = `
                <div id="activeModifierBadge" class="mt-4 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl">
                    <span class="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Ajuste Clínico Activo</span>
                    <span class="text-sm font-bold text-indigo-700">${res.modifier}</span>
                </div>
            `;
            document.getElementById('suggestedConduct').insertAdjacentHTML('afterend', modHtml);
        }

        // Red Flags
        const rfPanel = document.getElementById('redFlagsPanel');
        const rfContainer = document.getElementById('redFlagsContainer');
        if (res.redFlags && res.redFlags.length > 0) {
            rfPanel.classList.remove('hidden');
            rfContainer.innerHTML = res.redFlags.map(flag => `
                <span class="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-[10px] font-bold uppercase tracking-tight">
                    ${flag}
                </span>
            `).join('');
        } else {
            rfPanel.classList.add('hidden');
        }

        // Justificación
        document.getElementById('clinicalJustification').textContent = res.justification;

        // Probabilidades
        const probLabels = ["Estable", "Moderado", "Crítico"];
        const probColors = ["bg-emerald-500", "bg-amber-500", "bg-rose-600"];
        document.getElementById('probabilityList').innerHTML = res.probabilities.map((p, i) => `
            <div class="space-y-1.5">
                <div class="flex justify-between text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    <span>${probLabels[i]}</span>
                    <span class="text-slate-900">${(p*100).toFixed(1)}%</span>
                </div>
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="${probColors[i]} h-full transition-all duration-1000 ease-out" style="width: ${p*100}%"></div>
                </div>
            </div>
        `).join('');

        // Señales de Peso
        const explanation = explain(encodeFeatures({}), res.classIdx); // This is a bit redundant now but keep for structure
        // Wait, I already have explanation in res? No, I have topSignals in interpretResult but I didn't return it directly.
        // Actually interpretResult already did the explain.
        
        // Let's re-run explain properly
        const formData = {}; // We need the data from the form
        form.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => formData[cb.id] = true);
        const X = encodeFeatures(formData);
        const expl = explain(X, res.classIdx);

        document.getElementById('explainabilityList').innerHTML = expl.map(c => `
            <li class="flex justify-between items-center py-1">
                <span class="text-slate-500">• ${c.name}</span>
                <span class="${c.val > 0 ? 'text-rose-500' : 'text-emerald-500'}">+${Math.abs(c.val).toFixed(1)}</span>
            </li>
        `).join('');

        // Disclaimer
        document.getElementById('disclaimerText').textContent = res.disclaimer;
    }
});
