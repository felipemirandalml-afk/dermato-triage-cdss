import React, { useState } from 'react';
import { ClinicalHeader } from './components/layout/ClinicalHeader';
import { ProgressTracker } from './components/navigation/ProgressTracker';
import { StepNavigation } from './components/navigation/StepNavigation';

import { PatientCoreForm } from './components/form/PatientCoreForm';
import { TopographyForm } from './components/form/TopographyForm';
import { RedFlagsForm } from './components/form/RedFlagsForm';
import { ResultsPanel } from './components/results/ResultsPanel';
import { useInference } from './hooks/useInference';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const { processPatient } = useInference();
  const steps = ["Datos Core", "Exploración", "Signos Críticos", "Resultados"];

  const handleNext = () => {
    if (currentStep === 2) {
      processPatient();
      setCurrentStep(3);
    } else {
      setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
    }
  };

  const handleBack = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleReset = () => setCurrentStep(0);

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
