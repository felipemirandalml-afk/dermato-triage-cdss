/**
 * ui.js - Lógica de Interfaz Profesional CDSS v4.1
 */
import { encodeFeatures, predict, explain, FEATURE_INDEX } from './model.js';

document.addEventListener('DOMContentLoaded', () => {
    const triageForm = document.getElementById('triageForm');
    const resultsPanel = document.getElementById('resultsPanel');
    const stepCircles = document.querySelectorAll('.step-circle');
    const stepText = document.querySelectorAll('.step-circle + span');

    // 1. Mostrar/Ocultar Topografía Jerárquica e Indicador de Progreso Dinámico
    const regionParents = document.querySelectorAll('.region-parent');
    regionParents.forEach(parent => {
        const checkbox = parent.querySelector('input');
        const targetId = parent.getAttribute('data-target');
        const targetContainer = document.getElementById(targetId);

        checkbox.addEventListener('change', () => {
            if (targetContainer) {
                if (checkbox.checked) {
                    targetContainer.classList.remove('hidden');
                } else {
                    targetContainer.classList.add('hidden');
                    // Reset hijos
                    targetContainer.querySelectorAll('input').forEach(i => i.checked = false);
                }
            }
            updateProgress();
        });
    });

    // Escuchar cambios en cualquier input para actualizar el progreso visual
    triageForm.addEventListener('change', updateProgress);

    function updateProgress() {
        // Lógica simple de progreso orientada visualmente
        const hasDemog = document.getElementById('age').value !== '' && document.querySelector('input[name="gender"]:checked');
        const hasComorb = document.querySelectorAll('section:nth-of-type(2) input:checked').length > 0;
        const hasSemio = document.querySelectorAll('section:nth-of-type(3) input:checked').length > 0;
        const hasTopo = document.querySelectorAll('section:nth-of-type(4) input:checked').length > 0;

        const steps = [true, hasDemog, hasComorb, hasSemio]; // El circulo 1 es demog, etc.
        
        stepCircles.forEach((circle, i) => {
            if (steps[i]) {
                circle.className = 'step-circle step-active';
                if (stepText[i]) stepText[i].className = 'text-[9px] font-bold text-indigo-600 uppercase';
            } else {
                circle.className = 'step-circle step-inactive';
                if (stepText[i]) stepText[i].className = 'text-[9px] font-bold text-slate-400 uppercase';
            }
        });
    }

    // 2. Manejador de Formulario
    triageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = captureDynamicData();
        
        if (!validateData(formData)) return;

        const X = encodeFeatures(formData);
        const result = predict(X);
        const explanation = explain(X, result.classIdx);

        renderResults(result, explanation);
    });

    function captureDynamicData() {
        const data = {};
        Object.keys(FEATURE_INDEX).forEach(id => {
            const el = document.getElementById(id);
            if (el && el.type === 'checkbox') {
                data[id] = el.checked;
            }
        });
        data.age = document.getElementById('age').value;
        data.gender = document.getElementById('genderSelect')?.value || document.querySelector('input[name="gender"]:checked')?.value;
        data.fitzpatrick = document.getElementById('fitzpatrick').value;
        data.timing = document.querySelector('input[name="timing"]:checked')?.value;
        return data;
    }

    function validateData(data) {
        if (!data.age) {
             alert('Por favor, ingrese la edad del paciente.');
             return false;
        }
        return true;
    }

    /**
     * Renderizado con Estética Médica Moderna
     */
    function renderResults(result, explanation) {
        resultsPanel.classList.remove('hidden');
        resultsPanel.scrollIntoView({ behavior: 'smooth' });

        const resultCard = document.getElementById('resultCard');
        const priorityText = document.getElementById('priorityText');
        
        // Mapeo de colores profesionales definidos en el prompt
        const themes = {
            1: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
            2: { bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-200' },
            3: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' }
        };

        const theme = themes[result.priority];
        
        resultCard.className = `bg-white rounded-3xl p-8 border-t-8 shadow-xl transition-all duration-500 ${theme.bg} ${theme.border}`;
        priorityText.textContent = result.label;
        priorityText.className = `text-4xl md:text-5xl font-black tracking-tighter uppercase italic ${theme.text}`;

        // Probabilidades con barras minimalistas
        const probList = document.getElementById('probabilityList');
        const labels = ["Prioridad 3", "Prioridad 2", "Prioridad 1"];
        const barColors = ["bg-emerald-500", "bg-amber-500", "bg-rose-500"];
        
        probList.innerHTML = result.probabilities.map((p, i) => `
            <div>
                <div class="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                    <span>${labels[i]}</span>
                    <span class="font-mono">${(p * 100).toFixed(1)}%</span>
                </div>
                <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="${barColors[i]} h-full transition-all duration-1000 ease-out" style="width: ${p * 100}%"></div>
                </div>
            </div>
        `).join('');

        // Explicabilidad con tarjetas de impacto
        const explainList = document.getElementById('explainabilityList');
        explainList.innerHTML = explanation.length > 0 ? explanation.map(item => `
            <li class="bg-white/80 p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm backdrop-blur-sm">
                <div class="pr-4">
                    <p class="text-sm font-bold text-slate-800 leading-tight">${item.name}</p>
                    <p class="text-[9px] uppercase tracking-widest font-black mt-1 ${item.value > 0 ? 'text-rose-500' : 'text-emerald-600'}">
                        ${item.value > 0 ? '▲ Aumenta Riesgo' : '▼ Sustento Protector'}
                    </p>
                </div>
                <div class="text-xs font-black px-3 py-1 rounded-full ${item.value > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">
                    ${Math.abs(item.value).toFixed(1)}
                </div>
            </li>
        `).join('') : '<li class="text-slate-400 italic text-sm text-center py-4">Sin factores de peso críticos detectados.</li>';
    }
});
