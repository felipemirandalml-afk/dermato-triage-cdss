import React from 'react';
import { useClinicalStore } from '../../store/useClinicalStore';

export const FieldGroup = ({ title, children }) => (
  <div className="pt-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4 border-b border-slate-100 pb-2">
      {title}
    </label>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export const ClinicalFeatureCheckbox = ({ id, label, category = "", variant = "default" }) => {
  const toggleFeature = useClinicalStore((state) => state.toggleFeature);
  const isChecked = useClinicalStore((state) => state.formData.features[id] || false);

  const containerClass = variant === "red" ? "card-selectable-red" : "card-selectable";
  const inputColorClass = variant === "red" ? "text-triage-p1 focus:ring-triage-p1 border-red-200" : "text-clinical-blue focus:ring-clinical-blue border-slate-300";

  return (
    <label className={`${containerClass} p-4 rounded-xl flex items-start gap-4`}>
      <div className="mt-0.5">
        <input 
          type="checkbox" 
          id={id}
          className={`w-5 h-5 rounded transition-all cursor-pointer ${inputColorClass}`}
          checked={isChecked}
          onChange={() => toggleFeature(id)}
        />
      </div>
      <div>
        <span className="font-bold text-slate-700 block">{label}</span>
        {category && <span className="text-[10px] text-slate-400 font-medium">{category}</span>}
      </div>
    </label>
  );
};
