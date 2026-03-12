/**
 * ui.js - Lógica de Interfaz CDSS Experto v4.0
 */
import { encodeFeatures, predict, explain, FEATURE_INDEX } from './model.js';

document.addEventListener('DOMContentLoaded', () => {
    const triageForm = document.getElementById('triageForm');
    const resultsPanel = document.getElementById('resultsPanel');

    // 1. Lógica de Topografía Jerárquica (Show/Hide)
    const regionParents = document.querySelectorAll('.region-parent');
    regionParents.forEach(parent => {
        const checkbox = parent.querySelector('input');
        const targetId = parent.getAttribute('data-target');
        const targetContainer = document.getElementById(targetId);

        checkbox.addEventListener('change', () => {
            if (targetContainer) {
                targetContainer.classList.toggle('hidden', !checkbox.checked);
                // Si se desmarca el padre, desmarcar hijos para consistencia
                if (!checkbox.checked) {
                    targetContainer.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
                }
            }
        });
    });

    // 2. Manejador de Formulario
    triageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Captura automática de datos basada en el FEATURE_INDEX
        const formData = captureDynamicData();
        
        if (!validateData(formData)) return;

        const X = encodeFeatures(formData);
        const result = predict(X);
        const explanation = explain(X, result.classIdx);

        renderResults(result, explanation);
    });

    /**
     * Captura todos los valores del formulario que coincidan con FEATURE_INDEX
     */
    function captureDynamicData() {
        const data = {};
        
        // Capturar checkboxes por ID
        Object.keys(FEATURE_INDEX).forEach(id => {
            const el = document.getElementById(id);
            if (el && el.type === 'checkbox') {
                data[id] = el.checked;
            }
        });

        // Capturar campos especiales
        data.age = document.getElementById('age').value;
        data.gender = document.getElementById('genderSelect').value;
        data.fitzpatrick = document.getElementById('fitzpatrick').value;
        data.timing = document.querySelector('input[name="timing"]:checked')?.value;

        return data;
    }

    function validateData(data) {
        if (!data.age) {
             alert('Es obligatorio ingresar la edad del paciente.');
             return false;
        }
        return true;
    }

    /**
     * Renderizado de Calidad Clínica
     */
    function renderResults(result, explanation) {
        resultsPanel.classList.remove('hidden');
        resultsPanel.classList.add('animate-pulse');
        setTimeout(() => resultsPanel.classList.remove('animate-pulse'), 1000);
        resultsPanel.scrollIntoView({ behavior: 'smooth' });

        const priorityText = document.getElementById('priorityText');
        const styles = {
            1: 'text-red-600',
            2: 'text-orange-500',
            3: 'text-green-600'
        };

        priorityText.textContent = result.label;
        priorityText.className = `text-5xl font-black tracking-tighter uppercase italic ${styles[result.priority]}`;

        // Render Probabilidades
        const probList = document.getElementById('probabilityList');
        const labels = ["Prioridad 3", "Prioridad 2", "Prioridad 1"];
        const colors = ["bg-green-500", "bg-orange-500", "bg-red-500"];
        
        probList.innerHTML = result.probabilities.map((p, i) => `
            <div>
                <div class="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                    <span>${labels[i]}</span>
                    <span>${(p * 100).toFixed(1)}%</span>
                </div>
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="${colors[i]} h-full transition-all duration-1000" style="width: ${p * 100}%"></div>
                </div>
            </div>
        `).join('');

        // Render Explicabilidad
        const explainList = document.getElementById('explainabilityList');
        if (explanation.length === 0) {
            explainList.innerHTML = '<li class="text-slate-400 italic text-sm">Sin factores de peso dominantes detectados.</li>';
        } else {
            explainList.innerHTML = explanation.map(item => `
                <li class="p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                    <div>
                        <p class="text-sm font-bold text-slate-800">${item.name}</p>
                        <p class="text-[9px] uppercase tracking-widest ${item.value > 0 ? 'text-red-500' : 'text-indigo-500'} font-black">
                            ${item.value > 0 ? 'Impulsa prioridad alta' : 'Sustenta prioridad baja'}
                        </p>
                    </div>
                    <div class="text-lg font-black ${item.value > 0 ? 'text-red-100' : 'text-indigo-100'}">
                        ${Math.abs(item.value).toFixed(1)}
                    </div>
                </li>
            `).join('');
        }
    }
});
