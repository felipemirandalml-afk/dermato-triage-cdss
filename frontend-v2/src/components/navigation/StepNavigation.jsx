import { UI_LABELS } from '../../constants/labels';

export const StepNavigation = ({ currentStep, onNext, onBack, onReset }) => {
  return (
    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
      <button 
        onClick={onBack}
        disabled={currentStep === 0 || currentStep === 3}
        className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${(currentStep === 0 || currentStep === 3) ? 'opacity-0 cursor-default' : 'text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
      >
        {UI_LABELS.BUTTONS.BACK}
      </button>
      
      {currentStep < 3 && (
        <button 
          onClick={onNext}
          className={`px-8 py-3 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 ${currentStep === 2 ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30' : 'bg-clinical-blue hover:bg-blue-700 hover:shadow-blue-500/20'} hover:shadow-lg`}
        >
          {currentStep === 2 ? UI_LABELS.BUTTONS.ANALYZE : UI_LABELS.BUTTONS.CONTINUE}
        </button>
      )}
      
      {currentStep === 3 && (
         <button 
          onClick={onReset}
          className="px-8 py-3 bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all"
         >
           {UI_LABELS.BUTTONS.NEW_PATIENT}
         </button>
      )}
    </div>
  );
};
