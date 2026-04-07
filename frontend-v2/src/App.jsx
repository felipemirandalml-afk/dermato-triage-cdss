import React, { useState } from 'react';
import { PatientCoreForm } from './components/form/PatientCoreForm';
import { TopographyForm } from './components/form/TopographyForm';
import { RedFlagsForm } from './components/form/RedFlagsForm';
import { ResultsPanel } from './components/results/ResultsPanel';
import { useClinicalStore } from './store/useClinicalStore';
import { useInference } from './hooks/useInference';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const { processPatient } = useInference();
  const steps = ["Datos Core", "Exploración", "Signos Críticos", "Resultados"];

  const handleNext = () => {
    if (currentStep === 2) {
      // Estamos en la antesala de los resultados. ¡Enciende la IA!
      processPatient();
      setCurrentStep(3);
    } else {
      setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50 font-sans">
      {/* 🏥 Premium Clinical Header */}
      <nav className="bg-clinical-blue text-white shadow-lg border-b border-blue-800">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚕️</span>
              <div>
                <h1 className="text-xl font-black tracking-tight leading-none">DermatoTriage <span className="font-light opacity-90">CDSS</span></h1>
                <p className="text-[10px] font-bold text-blue-200 tracking-widest uppercase">Support System v2.0</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-semibold text-blue-200 block">SESIÓN MÉDICA</span>
                <span className="text-sm font-bold block leading-none">Dr. Administrador</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center font-bold shadow-inner">
                DR
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1300px] mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        
        {/* 🧭 Clinical Progress Tracker */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2 px-1">
            {steps.map((label, idx) => (
              <span key={idx} className={`text-xs font-black uppercase tracking-wider ${idx <= currentStep ? 'text-clinical-blue' : 'text-slate-400'}`}>
                {label}
              </span>
            ))}
          </div>
          <div className="h-2 bg-slate-200 rounded-full w-full overflow-hidden flex">
            <div 
              className="h-full bg-clinical-blue transition-all duration-500 ease-out" 
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 📋 Módulos de Formulario Reactivos */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 min-h-[400px] relative">
          {currentStep === 0 && <PatientCoreForm />}
          {currentStep === 1 && <TopographyForm />}
          {currentStep === 2 && <RedFlagsForm />}
          {currentStep === 3 && <ResultsPanel />}

          {/* Navegación Modular (Barra Inferior) */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
            <button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || currentStep === 3}
              className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${(currentStep === 0 || currentStep === 3) ? 'opacity-0 cursor-default' : 'text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
            >
              Volver
            </button>
            
            {currentStep < 3 && (
              <button 
                onClick={handleNext}
                className={`px-8 py-3 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 ${currentStep === 2 ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30' : 'bg-clinical-blue hover:bg-blue-700 hover:shadow-blue-500/20'} hover:shadow-lg`}
              >
                {currentStep === 2 ? 'Analizar Paciente 🧠' : 'Continuar →'}
              </button>
            )}
            {currentStep === 3 && (
               <button 
                onClick={() => {
                  useClinicalStore.getState().resetForm();
                  setCurrentStep(0);
                }}
                className="px-8 py-3 bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all"
               >
                 Nuevo Paciente ↻
               </button>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
