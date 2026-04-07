import React from 'react';

export const ClinicalHeader = () => {
  return (
    <nav className="bg-clinical-blue text-white shadow-lg border-b border-blue-800">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚕️</span>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">
                DermatoTriage <span className="font-light opacity-90">CDSS</span>
              </h1>
              <p className="text-[10px] font-bold text-blue-200 tracking-widest uppercase">
                Support System v2.0
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-blue-200 block">SESIÓN MÉDICA</span>
              <span className="text-sm font-bold block leading-none">Dr. Administrador</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center font-bold shadow-inner text-sm">
              DR
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
