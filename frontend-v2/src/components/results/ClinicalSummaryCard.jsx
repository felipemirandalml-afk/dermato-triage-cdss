import React from 'react';
import { useTranslation } from 'react-i18next';
import { useClinicalStore } from '../../store/useClinicalStore';

export const ClinicalSummaryCard = () => {
  const { t } = useTranslation();
  const formData = useClinicalStore((state) => state.formData);

  const activeFeatures = Object.keys(formData.features || {})
    .filter(key => formData.features[key] === true)
    .map(key => key.replace(/_/g, ' '));

  const sexLabel = formData.sex === 'male' ? 'M' : formData.sex === 'female' ? 'F' : 'Indet.';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">[]</span>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{t('ui.patient_summary')}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Perfil Base</span>
            <div className="flex gap-2 text-sm font-bold text-slate-700">
              <span className="bg-slate-100 px-2 py-1 rounded-md">Edad {formData.age || '?'}</span>
              <span className="bg-slate-100 px-2 py-1 rounded-md capitalize">{sexLabel}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Evolucion</span>
            <span className="text-sm font-bold text-slate-700 bg-blue-50 text-clinical-blue px-2 py-1 rounded-md capitalize">
              {formData.timing || 'No definida'}
            </span>
          </div>
        </div>

        <div className="sm:col-span-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Hallazgos Semiologicos Detectados ({activeFeatures.length})</span>
          <div className="flex flex-wrap gap-2">
            {activeFeatures.length > 0 ? (
              activeFeatures.map((feature, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200 px-2 py-1 rounded-lg"
                >
                  {feature}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No se registraron hallazgos especificos.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
