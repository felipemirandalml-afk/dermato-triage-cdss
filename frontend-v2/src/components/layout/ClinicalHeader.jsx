import { UI_LABELS } from '../../constants/labels';

export const ClinicalHeader = () => {
  return (
    <nav className="bg-clinical-blue text-white shadow-lg border-b border-blue-800">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">+</span>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">
                {UI_LABELS.BRAND} <span className="font-light opacity-90">{UI_LABELS.BRAND_SUBTITLE}</span>
              </h1>
              <p className="text-[10px] font-bold text-blue-200 tracking-widest uppercase">
                {UI_LABELS.SUPPORT_VERSION}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-blue-200 block uppercase">{UI_LABELS.SESSION_TYPE}</span>
              <span className="text-sm font-bold block leading-none">{UI_LABELS.SESSION_USER}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center font-bold shadow-inner text-sm uppercase">
              US
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
