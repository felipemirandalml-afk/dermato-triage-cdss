import { conceptMapper } from '../../engine/concept_mapper';

export const TopographyForm = () => {
  // 🔍 Descubrimiento Dinámico de Features (SSoT)
  const topographyFeatures = conceptMapper.getFeaturesByGroup('topografia').filter(f => f.usable_in_ui);
  const patternFeatures = conceptMapper.getFeaturesByGroup('patron_distribucion').filter(f => f.usable_in_ui);
  const symptomFeatures = conceptMapper.getFeaturesByGroup('sintoma_signo').filter(f => f.usable_in_ui);
  const modifierFeatures = conceptMapper.getFeaturesByGroup('color_vascular').filter(f => f.usable_in_ui);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-in slide-in-from-right-4 duration-500">
      
      {/* Columna Izquierda: Topografía y Patrón */}
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Topografía y Patrón</h3>
          <p className="text-sm text-slate-500">Distribución espacial y agrupación según SSoT.</p>
        </div>

        <FieldGroup title="Topografía (Zonas de Afectación)">
          <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {topographyFeatures.map(f => (
              <ClinicalFeatureCheckbox 
                key={f.canonical_id} 
                id={f.canonical_id} 
                label={f.canonical_label} 
                category={f.aliases?.[0] || 'Localización'} 
              />
            ))}
          </div>
        </FieldGroup>
        
        <FieldGroup title="Patrón de Distribución">
          <div className="grid grid-cols-2 gap-3">
            {patternFeatures.map(f => (
              <ClinicalFeatureCheckbox 
                key={f.canonical_id} 
                id={f.canonical_id} 
                label={f.canonical_label} 
                category={f.definition || 'Configuración'}
              />
            ))}
          </div>
        </FieldGroup>
      </div>

      {/* Columna Derecha: Sintomatología Asociada */}
      <div className="space-y-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Carga Sintomática</h3>
          <p className="text-sm text-slate-500">Hallazgos dinámicos detectados en el esquema.</p>
        </div>
        
        <FieldGroup title="Síntomas Principales">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {symptomFeatures.map(f => (
              <ClinicalFeatureCheckbox 
                key={f.canonical_id} 
                id={f.canonical_id} 
                label={f.canonical_label} 
                category={f.definition}
              />
            ))}
          </div>
        </FieldGroup>

        <FieldGroup title="Modificadores Secundarios">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modifierFeatures.map(f => (
              <ClinicalFeatureCheckbox 
                key={f.canonical_id} 
                id={f.canonical_id} 
                label={f.canonical_label} 
                category={f.definition || 'Atributo'}
              />
            ))}
          </div>
        </FieldGroup>
      </div>

    </div>
  );
};
