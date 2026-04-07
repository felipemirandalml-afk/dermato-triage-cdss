import React from 'react';
import { FieldGroup, ClinicalFeatureCheckbox } from '../shared/FormElements';

export const TopographyForm = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-in slide-in-from-right-4 duration-500">
      
      {/* Columna Izquierda: Topografía y Patrón */}
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Topografía y Patrón</h3>
          <p className="text-sm text-slate-500">Distribución espacial y agrupación de las lesiones.</p>
        </div>

        <FieldGroup title="Topografía (Zonas de Afectación)">
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'topografia_cabeza_cuello', label: 'Cabeza / Cuello', cat: 'Facial-Cervical' },
              { id: 'topografia_tronco', label: 'Tronco', cat: 'Tórax-Abdomen-Espalda' },
              { id: 'topografia_extremidades_superiores', label: 'Extr. Superiores', cat: 'Brazos-Manos' },
              { id: 'topografia_extremidades_inferiores', label: 'Extr. Inferiores', cat: 'Piernas-Pies' },
              { id: 'topografia_pliegues', label: 'Pliegues (Intertrigo)', cat: 'Axilar-Inguinal' },
              { id: 'topografia_mucosas', label: 'Mucosas / Genital', cat: 'Oral-Genital' }
            ].map(f => (
              <ClinicalFeatureCheckbox key={f.id} id={f.id} label={f.label} category={f.cat} />
            ))}
          </div>
        </FieldGroup>
        
        <FieldGroup title="Patrón de Distribución">
          <div className="grid grid-cols-2 gap-3">
            <ClinicalFeatureCheckbox 
              id="distribucion_localizada" 
              label="Localizada" 
              category="Punto específico" 
            />
            <ClinicalFeatureCheckbox 
              id="distribucion_generalizada" 
              label="Generalizada" 
              category="Ampliamente diseminada" 
            />
            <ClinicalFeatureCheckbox 
              id="distribucion_simetrica" 
              label="Simétrica" 
              category="Bilateral (en espejo)" 
            />
            <ClinicalFeatureCheckbox 
              id="patron_agrupado" 
              label="Agrupado / Herpetiforme" 
              category="Racimos" 
            />
            <ClinicalFeatureCheckbox 
              id="patron_lineal" 
              label="Lineal / Zosteriforme" 
              category="Trayecto definido" 
            />
          </div>
        </FieldGroup>
      </div>

      {/* Columna Derecha: Sintomatología Asociada */}
      <div className="space-y-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Carga Sintomática</h3>
          <p className="text-sm text-slate-500">Hallazgos y sensaciones subjetivas del paciente.</p>
        </div>
        
        <FieldGroup title="Síntomas Principales">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ClinicalFeatureCheckbox 
              id="sintoma_prurito" 
              label="Prurito (Picazón)" 
            />
            <ClinicalFeatureCheckbox 
              id="sintoma_dolor" 
              label="Dolor local / Ardor" 
            />
            <ClinicalFeatureCheckbox 
              id="sintoma_fiebre" 
              label="Fiebre (>38°C)" 
            />
            <ClinicalFeatureCheckbox 
              id="sintoma_malestar_general" 
              label="Compromiso Estado Gral." 
            />
          </div>
        </FieldGroup>

        <FieldGroup title="Modificadores Secundarios">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ClinicalFeatureCheckbox 
              id="color_eritematoso" 
              label="Eritema (Rojo/Inflamado)" 
            />
            <ClinicalFeatureCheckbox 
              id="color_violaceo" 
              label="Violáceo (Morado)" 
            />
            <ClinicalFeatureCheckbox 
              id="borde_irregular" 
              label="Bordes Irregulares" 
            />
            <ClinicalFeatureCheckbox 
              id="rapido_crecimiento" 
              label="Crecimiento Rápido" 
            />
          </div>
        </FieldGroup>
      </div>

    </div>
  );
};
