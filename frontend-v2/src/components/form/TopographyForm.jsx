import React from 'react';
import { FieldGroup, ClinicalFeatureCheckbox } from '../shared/FormElements';
import { conceptMapper } from '../../engine/concept_mapper';
import { useClinicalStore } from '../../store/useClinicalStore';

const pickUiFeatures = (ids = []) => ids
  .map((id) => conceptMapper.getFeature(id))
  .filter(Boolean)
  .filter((feature) => feature.usable_in_ui !== false);

export const TopographyForm = () => {
  const bsaPercent = useClinicalStore((state) => state.formData.severity?.bsaPercent ?? '');
  const setSeverityField = useClinicalStore((state) => state.setSeverityField);
  const specialSites = useClinicalStore((state) => state.formData.severity?.specialSites ?? {});
  const toggleSpecialSite = useClinicalStore((state) => state.toggleSpecialSite);

  const SPECIAL_SITES = [
    { id: 'periocular', label: 'Periocular / ocular', hint: 'zóster V1, párpado, rosácea ocular' },
    { id: 'anogenital', label: 'Anogenital', hint: 'molusco/verruga genital → UNACESS' },
    { id: 'palmoplantar', label: 'Palmoplantar', hint: 'eczema/psoriasis persistente' },
  ];

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

        <FieldGroup title="Extension (Superficie Corporal)">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">% de superficie corporal comprometida (BSA)</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                className="w-28 px-4 py-3 rounded-xl border border-slate-200 focus:border-clinical-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                placeholder="Ej. 8"
                min="0"
                max="100"
                value={bsaPercent}
                onChange={(e) => setSeverityField('bsaPercent', e.target.value)}
              />
              <span className="text-xs text-slate-500 font-semibold">% BSA</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-snug">
              Regla de la palma: la palma del paciente equivale a ~1% de su superficie corporal.
              <br />Umbrales de derivacion (SSMSO): psoriasis &gt;7%, dermatitis atopica &gt;10%.
            </p>
          </div>
        </FieldGroup>

        <FieldGroup title="Sitios Especiales (riesgo / derivacion)">
          <div className="grid grid-cols-1 gap-2">
            {SPECIAL_SITES.map(site => (
              <label key={site.id} className={`card-selectable p-3 border rounded-xl flex items-start gap-3 cursor-pointer ${specialSites[site.id] ? 'border-clinical-blue bg-blue-50' : 'border-slate-200'}`}>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded mt-0.5 text-clinical-blue focus:ring-clinical-blue border-slate-300 cursor-pointer"
                  checked={!!specialSites[site.id]}
                  onChange={() => toggleSpecialSite(site.id)}
                />
                <div>
                  <span className="font-bold text-slate-700 block text-sm">{site.label}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{site.hint}</span>
                </div>
              </label>
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
