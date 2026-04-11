import React from 'react';
import { FieldGroup, ClinicalFeatureCheckbox } from '../shared/FormElements';
import { conceptMapper } from '../../engine/concept_mapper';

const pickUiFeatures = (ids = []) => ids
  .map((id) => conceptMapper.getFeature(id))
  .filter(Boolean)
  .filter((feature) => feature.usable_in_ui !== false);

export const TopographyForm = () => {
  const topographyFeatures = [
    ...conceptMapper.getFeaturesByGroup('anatomia_topografia').filter(f => f.usable_in_ui),
    ...pickUiFeatures([
      'extremidad_superior',
      'pies',
      'fotoexpuesto',
      'topo_flexural_pliegues',
      'topo_friccion_extensora'
    ])
  ];

  const patternFeatures = [
    ...conceptMapper.getFeaturesByGroup('geometria_forma').filter(f => f.usable_in_ui),
    ...pickUiFeatures([
      'dermatomal',
      'generalizado',
      'localizado',
      'simetrico'
    ])
  ];

  const symptomFeatures = pickUiFeatures([
    'prurito',
    'prurito_nocturno',
    'ardor_quemazon',
    'dolor',
    'asintomatico',
    'fiebre'
  ]);

  const modifierFeatures = [
    ...conceptMapper.getFeaturesByGroup('color_vascular').filter(f => f.usable_in_ui),
    ...conceptMapper.getFeaturesByGroup('color_pigmentario').filter(f => f.usable_in_ui)
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Topografia y Patron</h3>
          <p className="text-sm text-slate-500">Distribucion espacial y agrupacion segun SSoT.</p>
        </div>

        <FieldGroup title="Topografia (Zonas de Afectacion)">
          <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {topographyFeatures.map(feature => (
              <ClinicalFeatureCheckbox
                key={feature.canonical_id}
                id={feature.canonical_id}
                label={feature.canonical_label}
                category={feature.aliases?.[0] || 'Localizacion'}
              />
            ))}
          </div>
        </FieldGroup>

        <FieldGroup title="Patron de Distribucion">
          <div className="grid grid-cols-2 gap-3">
            {patternFeatures.map(feature => (
              <ClinicalFeatureCheckbox
                key={feature.canonical_id}
                id={feature.canonical_id}
                label={feature.canonical_label}
                category={feature.definition || 'Configuracion'}
              />
            ))}
          </div>
        </FieldGroup>
      </div>

      <div className="space-y-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Carga Sintomatica</h3>
          <p className="text-sm text-slate-500">Hallazgos dinamicos detectados en el esquema.</p>
        </div>

        <FieldGroup title="Sintomas Principales">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {symptomFeatures.map(feature => (
              <ClinicalFeatureCheckbox
                key={feature.canonical_id}
                id={feature.canonical_id}
                label={feature.canonical_label}
                category={feature.definition || 'Sintoma'}
              />
            ))}
          </div>
        </FieldGroup>

        <FieldGroup title="Modificadores Secundarios">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modifierFeatures.map(feature => (
              <ClinicalFeatureCheckbox
                key={feature.canonical_id}
                id={feature.canonical_id}
                label={feature.canonical_label}
                category={feature.definition || 'Atributo'}
              />
            ))}
          </div>
        </FieldGroup>
      </div>
    </div>
  );
};
