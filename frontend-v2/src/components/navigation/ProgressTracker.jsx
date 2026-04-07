import React from 'react';

export const ProgressTracker = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2 px-1">
        {steps.map((label, idx) => (
          <span 
            key={idx} 
            className={`text-xs font-black uppercase tracking-wider ${idx <= currentStep ? 'text-clinical-blue' : 'text-slate-400'}`}
          >
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
  );
};
