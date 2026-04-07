import React from 'react';
import { ClinicalHeader } from './components/layout/ClinicalHeader';
import { ProgressTracker } from './components/navigation/ProgressTracker';
import { StepNavigation } from './components/navigation/StepNavigation';

import { PatientCoreForm } from './components/form/PatientCoreForm';
import { TopographyForm } from './components/form/TopographyForm';
import { RedFlagsForm } from './components/form/RedFlagsForm';
import { ResultsPanel } from './components/results/ResultsPanel';
import { useTriageFlow } from './hooks/useTriageFlow';
import { UI_LABELS } from './constants/labels';

function App() {
  const { 
    currentStep, 
    steps, 
    error, 
    handleNext, 
    handleBack, 
    handleReset 
  } = useTriageFlow();

  return (
    <div className="min-h-screen pb-20 bg-slate-50 font-sans">
      <ClinicalHeader />

      <main className="max-w-[1300px] mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <ProgressTracker currentStep={currentStep} steps={steps} />

        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 min-h-[400px] relative">
          {/* Renderizado de Pasos */}
          {currentStep === 0 && <PatientCoreForm />}
          {currentStep === 1 && <TopographyForm />}
          {currentStep === 2 && <RedFlagsForm />}
          {currentStep === 3 && <ResultsPanel />}

          {/* 🛡️ Alerta de Validación Clínica */}
          {error && (
            <div className="mt-8 p-4 bg-red-50 border-2 border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3 mb-2 text-red-800">
                <span className="text-xl">⚠️</span>
                <h3 className="font-black uppercase tracking-tight text-sm">{UI_LABELS.VALIDATION.TITLE}</h3>
              </div>
              <ul className="space-y-1 ml-9">
                {error.age && <li className="text-red-700 text-xs font-semibold">• {UI_LABELS.VALIDATION.MISSING_AGE}</li>}
                {error.timing && <li className="text-red-700 text-xs font-semibold">• {UI_LABELS.VALIDATION.MISSING_TIMING}</li>}
                {error.features && <li className="text-red-700 text-xs font-semibold">• {UI_LABELS.VALIDATION.MISSING_FEATURES}</li>}
              </ul>
              <p className="mt-3 ml-9 text-[10px] text-red-500 font-bold uppercase tracking-widest leading-none">
                {UI_LABELS.VALIDATION.ERROR_FOOTER}
              </p>
            </div>
          )}

          <StepNavigation 
            currentStep={currentStep} 
            onNext={handleNext} 
            onBack={handleBack} 
            onReset={handleReset} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;
