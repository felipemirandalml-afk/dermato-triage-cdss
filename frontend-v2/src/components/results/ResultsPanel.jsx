import { useTranslation } from 'react-i18next';
import { useClinicalStore } from '../../store/useClinicalStore';
import { ClinicalSummaryCard } from './ClinicalSummaryCard';

export const ResultsPanel = () => {
  const { t } = useTranslation();
  const result = useClinicalStore(state => state.triageResult);
  const formData = useClinicalStore(state => state.formData);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 animate-pulse">
        <span className="text-4xl mb-4">⚙️</span>
        <p className="font-bold">{t('ui.analyzing')}</p>
      </div>
    );
  }

  // Desempaquetado de datos del motor
  const { priority, priority_code, primary_syndrome, differential_ranking, probabilistic_analysis, triggered_rules } = result;

  // Configuración Mappable UI basada en Prioridad
  const TriageConfig = {
    'P1': { title: t('engine.priority.P1'), color: 'bg-triage-p1 text-white border-triage-p1', bg: 'bg-triage-p1-bg', icon: '🚨', action: t('engine.conduct.urgent') },
    'P2': { title: t('engine.priority.P2'), color: 'bg-triage-p2 text-white border-triage-p2', bg: 'bg-triage-p2-bg', icon: '⚠️', action: t('engine.conduct.priority') },
    'P3': { title: t('engine.priority.P3'), color: 'bg-triage-p3 text-white border-triage-p3', bg: 'bg-triage-p3-bg', icon: '🏥', action: t('engine.conduct.standard') }
  };
  
  const resolvedPriorityCode = priority_code || (typeof priority === 'number' ? `P${priority}` : priority);
  const config = TriageConfig[resolvedPriorityCode] || TriageConfig['P3'];
  const prob = probabilistic_analysis?.top_probability ? Math.round(probabilistic_analysis.top_probability * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* 🔴 Cabecera de Prioridad Vital (Safety Layer) */}
      <div className={`p-6 rounded-2xl border-2 flex items-center justify-between ${config.color} shadow-lg`}>
        <div className="flex items-center gap-4">
          <span className="text-4xl">{config.icon}</span>
          <div>
            <div className="flex gap-2 text-xs font-bold opacity-90 mb-1">
              <span className="bg-white/20 px-2 py-0.5 rounded-md">{formData.age || '?'} Años</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-md capitalize">
                {formData.sex === 'male' ? '♂ Masc' : formData.sex === 'female' ? '♀ Fem' : '⚥ Indet.'}
              </span>
            </div>
            <h2 className="text-xl font-bold">{config.title}</h2>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-xs uppercase bg-white/20 px-3 py-1 rounded-full font-bold tracking-widest">Motor v2.1</span>
        </div>
      </div>

      {/* 📋 Resumen Clínico del Input (XAI Pattern) */}
      <ClinicalSummaryCard />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 🧠 Panel Izquierdo: Machine Learning y Diferenciales */}
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">{t('ui.first_suspicion', { defaultValue: '1° Sospecha Sindrómica' })}</span>
            <div className="flex items-end gap-3 mb-4">
              <h3 className="text-2xl font-black text-slate-800 capitalize">{primary_syndrome ? primary_syndrome.replace(/_/g, ' ') : t('ui.indet_group', { defaultValue: 'Agrupación Indeterminada' })}</h3>
              <span className={`text-sm font-bold px-2 py-1 rounded-md mb-1 ${prob > 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {prob}% Estimación
              </span>
            </div>
            
            {/* Top 3 Diferenciales */}
            {differential_ranking && differential_ranking.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Diagnósticos Diferenciales (Top 3)</span>
                <div className="space-y-2">
                  {differential_ranking.slice(0, 3).map((diff, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors">
                      <span className="text-sm font-semibold text-slate-700 capitalize">
                        {index + 1}. {diff.disease_name ? diff.disease_name.replace(/_/g, ' ') : 'Agrupación Desconocida'}
                      </span>
                      <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold">
                        {diff.compatibility || 'Media'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🛡️ Panel Derecho: Razonamiento Explicable (ExAI) */}
        <div className="space-y-4">
          <div className="bg-white border text-slate-800 border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-10"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block flex justify-between">
              <span>{t('ui.decision_mechanism')}</span>
              <span>🔍</span>
            </span>

            {/* Reglas de Seguridad Disparadas */}
            {triggered_rules && triggered_rules.length > 0 ? (
              <div className="space-y-3">
                {triggered_rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-red-50/50 border border-red-100 rounded-xl text-sm">
                    <span className="text-red-500 mt-0.5">↳</span>
                    <div>
                      <strong className="text-red-800 block text-xs tracking-wide uppercase mb-0.5">Escudo Heurístico Activado</strong>
                      <span className="text-slate-600 leading-snug font-medium">{rule}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-500 italic text-center">
                {t('ui.no_emergency_rules', { defaultValue: 'Ninguna regla de emergencia vital disparada. El triaje procede estrictamente según estadística basal.' })}
              </div>
            )}

            {/* Conducta Sugerida Clínicamente */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">{t('ui.suggested_conduct')}</span>
              <p className="text-sm font-bold text-slate-800 leading-snug">
                {config.action}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
