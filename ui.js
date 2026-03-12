/**
 * ui.js - Lógica de Interfaz Consolidada CDSS v6.0
 * Capa única de interacción, captura y renderizado.
 */
import { encodeFeatures, predict, explain, FEATURE_INDEX } from './model.js';
import { CLINICAL_CASES } from './clinical_cases.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('triageForm');
    const resultsPanel = document.getElementById('resultsPanel');
    const resultCard = document.getElementById('resultCard');
    const btnDemo = document.getElementById('btnDemo');

    // 1. UI: MANEJO DE ACORDEONES (Topografía Jerárquica)
    // ... (logic remains same, just ensuring querySelectorAll is used correctly below)

    // 2. DEMO: CARGAR CASOS ALEATORIOS
    btnDemo?.addEventListener('click', () => {
        const randomCase = CLINICAL_CASES[Math.floor(Math.random() * CLINICAL_CASES.length)];
        loadCase(randomCase);
    });

    function loadCase(caseData) {
        form.reset();
        
        // Simular clicks para abrir acordeones si es necesario
        document.querySelectorAll('.cascade-menu').forEach(m => {
            m.classList.remove('open');
            m.classList.add('hidden');
        });

        // Set basics
        if (caseData.input.age) document.getElementById('age').value = caseData.input.age;
        if (caseData.input.fitzpatrick) document.getElementById('fitzpatrick').value = caseData.input.fitzpatrick;
        
        // Set checkboxes and open parents
        Object.keys(caseData.input).forEach(key => {
            const el = document.getElementById(key);
            if (el && el.type === 'checkbox') {
                el.checked = true;
                // Si es un sub-elemento, abrir el padre
                const parentMenu = el.closest('.cascade-menu');
                if (parentMenu) {
                    parentMenu.classList.add('open');
                    parentMenu.classList.remove('hidden');
                    // Marcar el trigger del padre
                    const triggerId = parentMenu.id.replace('sub-', 'topog_');
                    const triggerEl = document.getElementById(triggerId);
                    if (triggerEl) triggerEl.checked = true;
                }
            }
        });

        // Set timing
        const timingRadio = form.querySelector(`input[name="timing"][value="${caseData.input.timing}"]`);
        if (timingRadio) timingRadio.checked = true;

        console.log(`Cargado Caso Demo: ${caseData.title}`);
        
        // Opcional: Submit automático
        // form.dispatchEvent(new Event('submit'));
    }

    // (El resto de la lógica de acordeones y submit sigue igual...)
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

    // 2. INFERENCIA: MOTOR DE CAPTURA Y PROCESAMIENTO
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 2.1 Captura Dinámica de Datos
        const formData = {
            age: document.getElementById('age').value,
            fitzpatrick: document.getElementById('fitzpatrick').value,
            timing: form.querySelector('input[name="timing"]:checked')?.value
        };

        // Capturar todos los checkboxes activos que coincidan con el motor
        form.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
            formData[cb.id] = true;
        });

        if (!validateData(formData)) return;

        // 2.2 Inferencia Matemática
        const X = encodeFeatures(formData);
        const result = predict(X);
        const contributionExplain = explain(X, result.classIdx);

        // 2.3 Renderizado de Resultados
        renderResults(result, contributionExplain);
    });

    function validateData(data) {
        if (!data.age) {
            alert('Por favor, ingrese la edad del paciente.');
            document.getElementById('age').focus();
            return false;
        }
        return true;
    }

    /**
     * Renderizado Maestro v6.0
     */
    function renderResults(result, explanation) {
        const themes = {
            1: { rose: 'text-rose-600', amber: 'text-amber-500', emerald: 'text-emerald-600' },
            bg: { rose: 'bg-rose-100/50 text-rose-800', amber: 'bg-amber-100 text-amber-800', emerald: 'bg-emerald-100 text-emerald-800' },
            border: { rose: '#e11d48', amber: '#f59e0b', emerald: '#10b981' }
        };

        const priority = result.priority;
        const themeKey = priority === 1 ? 'rose' : (priority === 2 ? 'amber' : 'emerald');

        // Mostrar Panel
        resultsPanel.classList.remove('hidden');
        resultsPanel.scrollIntoView({ behavior: 'smooth' });

        // Animación de Entrada
        setTimeout(() => {
            resultCard.classList.remove('scale-95', 'opacity-0');
            resultCard.classList.add('scale-100', 'opacity-100');
            resultCard.style.borderColor = themes.border[themeKey];
        }, 100);

        // Textos y Badges
        document.getElementById('priorityText').textContent = result.label;
        document.getElementById('priorityText').className = `text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none mb-6 ${themes[1][themeKey]}`;
        
        const badge = document.getElementById('badgeStatus');
        badge.textContent = priority === 1 ? '⚠️ Urgencia Vital' : (priority === 2 ? '⚡ Prioridad Media' : '✅ Seguimiento');
        badge.className = `inline-block px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest ${themes.bg[themeKey]}`;

        // Barras de Probabilidad
        const probLabels = ["Estable", "Moderado", "Crítico"];
        const probColors = ["bg-emerald-500", "bg-amber-500", "bg-rose-600"];
        document.getElementById('probabilityList').innerHTML = result.probabilities.map((p, i) => `
            <div class="space-y-2">
                <div class="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <span>${probLabels[i]}</span>
                    <span class="text-slate-900">${(p*100).toFixed(1)}%</span>
                </div>
                <div class="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div class="${probColors[i]} h-full transition-all duration-1000 ease-out" style="width: ${p*100}%"></div>
                </div>
            </div>
        `).join('');

        // Explicabilidad v6.0
        document.getElementById('explainabilityList').innerHTML = explanation.map(c => `
            <li class="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex justify-between items-center transition-all hover:bg-white hover:shadow-md group">
                <span class="text-xs font-bold text-slate-700">${c.name}</span>
                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase ${c.val > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}">
                    ${c.val > 0 ? 'Riesgo ▲' : 'Protector ▼'}
                </span>
            </li>
        `).join('');
    }
});
