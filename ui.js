import { encodeFeatures, predict, explain, interpretResult, FEATURE_INDEX } from './model.js';
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

        form.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
            formData[cb.id] = true;
        });

        if (!validateData(formData)) return;

        const X = encodeFeatures(formData);
        const rawPrediction = predict(X);
        const interpretation = interpretResult(X, rawPrediction);

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
        const themes = {
            1: { color: 'text-rose-600', bg: 'bg-rose-100/50 text-rose-800', border: 'border-rose-500', bar: 'bg-rose-600' },
            2: { color: 'text-amber-500', bg: 'bg-amber-100 text-amber-800', border: 'border-amber-400', bar: 'bg-amber-500' },
            3: { color: 'text-emerald-600', bg: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-500', bar: 'bg-emerald-500' }
        };

        const theme = themes[res.priority];

        resultsPanel.classList.remove('hidden');
        resultsPanel.scrollIntoView({ behavior: 'smooth' });

        // Card Styling
        resultCard.className = `clinical-card p-0 overflow-hidden transition-all duration-500 transform border-t-4 ${theme.border}`;

        // Header
        document.getElementById('priorityText').textContent = res.priority === 1 ? 'URGENCIAL' : (res.priority === 2 ? 'PRIORITARIO' : 'ESTABLE');
        document.getElementById('priorityText').className = `text-4xl md:text-6xl font-black tracking-tighter leading-none ${theme.color}`;
        
        const badge = document.getElementById('badgeStatus');
        badge.textContent = `Caso Priorizado como P${res.priority}`;
        badge.className = `inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${theme.bg}`;

        // Conducta
        document.getElementById('suggestedConduct').textContent = res.conduct;
        document.getElementById('recommendedTimeframe').textContent = `Plazo recomendado: ${res.timeframe}`;

        // Modifier Badge
        const oldBadge = document.getElementById('activeModifierBadge');
        if (oldBadge) oldBadge.remove();

        if (res.modifier) {
            const modHtml = `
                <div id="activeModifierBadge" class="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <span class="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">Ajuste Clínico de Seguridad</span>
                    <span class="text-sm font-bold text-blue-700">${res.modifier}</span>
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
                <span class="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded text-[10px] font-bold uppercase tracking-tight">
                    • ${flag}
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
            <div class="space-y-1">
                <div class="flex justify-between text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    <span>Prioridad ${3-i}</span>
                    <span class="text-slate-600">${(p*100).toFixed(1)}%</span>
                </div>
                <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="${probColors[i]} h-full transition-all duration-1000 ease-out" style="width: ${p*100}%"></div>
                </div>
            </div>
        `).join('');

        // Señales de Peso
        const X = encodeFeatures(formData);
        const expl = explain(X, res.classIdx);

        document.getElementById('explainabilityList').innerHTML = expl.map(c => `
            <li class="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                <span class="text-slate-500">${c.name}</span>
                <span class="font-bold ${c.val > 0 ? 'text-blue-600' : 'text-emerald-600'}">${c.val > 0 ? '+' : ''}${c.val.toFixed(1)}</span>
            </li>
        `).join('');

        // Disclaimer
        document.getElementById('disclaimerText').textContent = res.disclaimer;
    }
});
