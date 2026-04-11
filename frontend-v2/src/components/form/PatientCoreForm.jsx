import React from 'react';
import { useClinicalStore } from '../../store/useClinicalStore';
import { FieldGroup, ClinicalFeatureCheckbox } from '../shared/FormElements';
import { conceptMapper } from '../../engine/concept_mapper';

export const PatientCoreForm = () => {
  const formData = useClinicalStore((state) => state.formData);
  const setField = useClinicalStore((state) => state.setField);

  const primaryFeatures = conceptMapper.getFeaturesByGroup('lesion_primaria').filter(f => f.usable_in_ui);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Perfil del Paciente</h3>
          <p className="text-sm text-slate-500">Datos epidemiologicos base requeridos por el orquestador.</p>
        </div>

        <FieldGroup title="1. Datos Demograficos">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Edad (anos)</label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-clinical-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                placeholder="Ej. 45"
                min="0"
                max="120"
                value={formData.age}
                onChange={(e) => setField('age', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Sexo Clinico</label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`card-selectable p-3 border rounded-xl text-center cursor-pointer ${formData.sex === 'male' ? 'border-clinical-blue bg-blue-50 text-clinical-blue' : 'border-slate-200 text-slate-600'}`}>
                  <input type="radio" name="sex" value="male" className="hidden" onChange={(e) => setField('sex', e.target.value)} />
                  <span className="text-sm font-bold block">M</span>
                </label>
                <label className={`card-selectable p-3 border rounded-xl text-center cursor-pointer ${formData.sex === 'female' ? 'border-clinical-blue bg-blue-50 text-clinical-blue' : 'border-slate-200 text-slate-600'}`}>
                  <input type="radio" name="sex" value="female" className="hidden" onChange={(e) => setField('sex', e.target.value)} />
                  <span className="text-sm font-bold block">F</span>
                </label>
              </div>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup title="2. Temporalidad (Evolucion clinica)">
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'agudo', title: 'Agudo', desc: '< 2 semanas' },
              { id: 'subagudo', title: 'Subagudo', desc: '2 - 6 semanas' },
              { id: 'cronico', title: 'Cronico', desc: '> 6 semanas' },
            ].map(timingOption => (
              <label key={timingOption.id} className="card-selectable p-3 border border-slate-200 rounded-xl flex justify-between items-center cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="timing"
                    value={timingOption.id}
                    className="w-4 h-4 text-clinical-blue"
                    checked={formData.timing === timingOption.id}
                    onChange={(e) => setField('timing', e.target.value)}
                  />
                  <span className="text-sm font-bold text-slate-700">{timingOption.title}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">{timingOption.desc}</span>
              </label>
            ))}
          </div>
        </FieldGroup>
      </div>

      <div className="space-y-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Hallazgos Primarios</h3>
          <p className="text-sm text-slate-500">Morfologia de la lesion segun ontologia oficial.</p>
        </div>

        <FieldGroup title="Opciones Detectadas">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {primaryFeatures.map(feat => (
              <ClinicalFeatureCheckbox
                key={feat.canonical_id}
                id={feat.canonical_id}
                label={feat.canonical_label}
                category={feat.definition || feat.semantic_group.replace(/_/g, ' ')}
              />
            ))}
          </div>
        </FieldGroup>
      </div>
    </div>
  );
};
