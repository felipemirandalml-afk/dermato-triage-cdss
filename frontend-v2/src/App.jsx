import React, { useState } from 'react';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Datos Core", "Exploración", "Signos Críticos", "Resultados"];

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

        {/* 🚧 Main Content Area (To be modularized) */}
        <div className="clinical-card p-6 min-h-[400px] flex items-center justify-center bg-white">
          <div className="text-center space-y-4">
            <div className="text-4xl">🏗️</div>
            <h2 className="text-xl font-bold text-slate-700">Terreno Preparado</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              El esqueleto principal de la aplicación está montado. A continuación, inyectaremos el <strong>TabManager</strong> y el <strong>State Store</strong>.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <button 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                ← Anterior
              </button>
              <button 
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="px-4 py-2 bg-clinical-blue text-white rounded-lg text-sm font-bold hover:bg-blue-700"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
