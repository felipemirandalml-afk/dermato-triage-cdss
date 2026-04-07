import React from 'react';
import { FieldGroup, ClinicalFeatureCheckbox } from '../shared/FormElements';

export const RedFlagsForm = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-in slide-in-from-right-4 duration-500">
      
      {/* Columna Izquierda: Riesgos Inmediatos */}
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-red-600 mb-1 flex items-center gap-2">
            <span>🚨</span> Signos Críticos (Red Flags)
          </h3>
          <p className="text-sm text-slate-500">Hallazgos que gatillan derivación médica inmediata o prioridad 1.</p>
        </div>

        <FieldGroup title="Emergencias Dermatológicas">
          <div className="grid grid-cols-1 gap-3">
            <ClinicalFeatureCheckbox 
              id="compromiso_mucosas" 
              label="Compromiso Extenso de Mucosas" 
              category="Alerta Stevens-Johnson / DRESS" 
              variant="red"
            />
            <ClinicalFeatureCheckbox 
              id="necrosis_isquemia" 
              label="Necrosis o Isquemia Tisular" 
              category="Tejido muerto u oscuro" 
              variant="red"
            />
            <ClinicalFeatureCheckbox 
              id="signo_nikolsky" 
              label="Signo de Nikolsky Positivo" 
              category="Desprendimiento epidérmico al tacto" 
              variant="red"
            />
          </div>
        </FieldGroup>
        
        <FieldGroup title="SIRS / Riesgo Sistémico">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ClinicalFeatureCheckbox 
              id="signo_hipotension" 
              label="Signos de Shock" 
              category="Síncope / Hipotensión" 
              variant="red"
            />
            <ClinicalFeatureCheckbox 
              id="compromiso_conciencia" 
              label="Alt. de Conciencia" 
              category="Desorientación" 
              variant="red"
            />
          </div>
        </FieldGroup>
      </div>

      {/* Columna Derecha: Riesgo Oncológico */}
      <div className="space-y-8 bg-triage-p1-bg/50 p-6 rounded-2xl border border-red-50">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Sospecha de Malignidad</h3>
          <p className="text-sm text-slate-500">Regla ABCDE para lesiones pigmentadas.</p>
        </div>
        
        <FieldGroup title="Criterios Clínicos ABCDE">
          <div className="grid grid-cols-1 gap-3">
            <ClinicalFeatureCheckbox 
              id="abcde_asimetria" 
              label="(A) Asimetría marcada" 
              category="Mitades no coinciden" 
              variant="red"
            />
            <ClinicalFeatureCheckbox 
              id="abcde_bordes" 
              label="(B) Bordes irregulares" 
              category="Bordes borrosos o festoneados" 
              variant="red"
            />
            <ClinicalFeatureCheckbox 
              id="abcde_color" 
              label="(C) Variedad de color" 
              category="Varios tonos en la misma lesión" 
              variant="red"
            />
            <ClinicalFeatureCheckbox 
              id="abcde_diametro" 
              label="(D) Diámetro > 6mm" 
              category="Más grande que el borrador de un lápiz" 
              variant="red"
            />
            <ClinicalFeatureCheckbox 
              id="abcde_evolucion" 
              label="(E) Evolución agresiva" 
              category="Sangrado o cambia rápidamente" 
              variant="red"
            />
          </div>
        </FieldGroup>
      </div>

    </div>
  );
};
