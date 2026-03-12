import { encodeFeatures, predict, explain } from './model.js';

document.addEventListener('DOMContentLoaded', () => {
    const triageForm = document.getElementById('triageForm');
    const resultsPanel = document.getElementById('resultsPanel');
    const resultCard = document.getElementById('resultCard');
    const priorityText = document.getElementById('priorityText');
    const probabilityList = document.getElementById('probabilityList');
    const explainabilityList = document.getElementById('explainabilityList');

    triageForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Capturar datos del formulario
        const formData = {
            age: document.getElementById('age').value,
            gender: document.querySelector('input[name="gender"]:checked')?.value,
            fitzpatrick: document.getElementById('fitzpatrick').value,
            // Comorbilidades
            inmunosupresion: document.getElementById('inmunosupresion').checked,
            farmacos_recientes: document.getElementById('farmacos_recientes').checked,
            riesgo_metabolico: document.getElementById('riesgo_metabolico').checked,
            atopia: document.getElementById('atopia').checked,
            auto_inmune: document.getElementById('auto_inmune').checked,
            enf_intestinal: document.getElementById('enf_intestinal').checked,
            hepatopatia: document.getElementById('hepatopatia').checked,
            sop_hirsutismo: document.getElementById('sop_hirsutismo').checked,
            // Campos adicionales (opcionales para el modelo actual pero presentes en UI)
            timing: document.getElementById('timing').value,
            asymmetry: document.getElementById('asymmetry').checked,
            borders: document.getElementById('borders').checked,
            color: document.getElementById('color').checked,
            diameter: document.getElementById('diameter').checked,
            bleeding: document.getElementById('bleeding').checked,
            growth: document.getElementById('growth').checked,
        };

        // 2. Validación simple
        if (!formData.age || !formData.gender || !formData.fitzpatrick) {
            alert('Por favor, complete los datos demográficos.');
            return;
        }

        // 3. Inferencia
        const X = encodeFeatures(formData);
        const result = predict(X);
        const explanation = explain(X, result.classIdx);

        // 4. Renderizar resultados
        displayResults(result, explanation);
    });

    function displayResults(result, explanation) {
        // Mostrar panel
        resultsPanel.classList.remove('hidden');
        resultsPanel.scrollIntoView({ behavior: 'smooth' });

        // Color coding según prioridad
        const styles = {
            1: 'bg-red-100 text-red-800 border-red-200',
            2: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            3: 'bg-green-100 text-green-800 border-green-200'
        };

        resultCard.className = `mt-6 p-6 rounded-lg border-2 ${styles[result.priority]}`;
        priorityText.textContent = `Prioridad Sugerida: ${result.priority} (${result.label})`;

        // Probabilidades
        probabilityList.innerHTML = result.probabilities.map((prob, i) => {
            const labels = ["Prioridad 3 (Baja)", "Prioridad 2 (Media)", "Prioridad 1 (Alta)"];
            return `
                <div class="flex justify-between items-center text-sm mb-1">
                    <span>${labels[i]}</span>
                    <span class="font-mono font-bold">${(prob * 100).toFixed(1)}%</span>
                </div>
                <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-3">
                    <div class="bg-blue-600 h-full" style="width: ${prob * 100}%"></div>
                </div>
            `;
        }).join('');

        // Explicabilidad
        explainabilityList.innerHTML = explanation.map(item => `
            <li class="flex justify-between items-center p-2 bg-white bg-opacity-50 rounded mb-1">
                <span class="text-xs font-medium">${item.name}</span>
                <span class="text-xs flex items-center">
                    ${item.value > 0 ? '▲ Aumenta prioridad' : '▼ Disminuye prioridad'}
                </span>
            </li>
        `).join('');
    }
});
