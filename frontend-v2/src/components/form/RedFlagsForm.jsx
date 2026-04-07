import { conceptMapper } from '../../engine/concept_mapper';

export const RedFlagsForm = () => {
  // 🔍 Definición de IDs de Red Flags (Mapeo de Seguridad SSoT)
  const emergencyIds = ['mucosas', 'necrosis_isquemia', 'despegamiento_epidermico'];
  const shockIds = ['signo_hipotension', 'compromiso_conciencia'];
  const abcdeIds = ['abcde_asimetria', 'abcde_bordes', 'abcde_color', 'abcde_diametro', 'abcde_evolucion'];

  // Helper para obtener metadata segura (XAI Guard)
  const getFeature = (id) => {
    const f = conceptMapper.getFeature(id);
    return f || { canonical_id: id, canonical_label: id.replace(/_/g, ' '), aliases: [] };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-in slide-in-from-right-4 duration-500">
      
      {/* Columna Izquierda: Riesgos Inmediatos */}
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-red-600 mb-1 flex items-center gap-2">
            <span>🚨</span> Signos Críticos (Red Flags)
          </h3>
          <p className="text-sm text-slate-500">Hallazgos registrados en el protocolo de seguridad oficial.</p>
        </div>

        <FieldGroup title="Emergencias Dermatológicas">
          <div className="grid grid-cols-1 gap-3">
            {emergencyIds.map(getFeature).map(f => (
              <ClinicalFeatureCheckbox 
                key={f.canonical_id}
                id={f.canonical_id} 
                label={f.canonical_label} 
                category={f.aliases?.[0] || 'Alerta Vital'} 
                variant="red"
              />
            ))}
          </div>
        </FieldGroup>
        
        <FieldGroup title="SIRS / Riesgo Sistémico">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shockIds.map(getFeature).map(f => (
              <ClinicalFeatureCheckbox 
                key={f.canonical_id}
                id={f.canonical_id} 
                label={f.canonical_label} 
                category={f.aliases?.[0] || 'Shock/SIRS'} 
                variant="red"
              />
            ))}
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
            {abcdeIds.map(getFeature).map(f => (
              <ClinicalFeatureCheckbox 
                key={f.canonical_id}
                id={f.canonical_id} 
                label={f.canonical_label} 
                category={f.aliases?.[0] || 'Criterio Malignidad'} 
                variant="red"
              />
            ))}
          </div>
        </FieldGroup>
      </div>

    </div>
  );
};
