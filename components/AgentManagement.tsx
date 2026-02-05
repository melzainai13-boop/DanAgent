
import React, { useState } from 'react';
import { AgentConfig } from '../types';

interface AgentManagementProps {
  config: AgentConfig;
  setConfig: (config: AgentConfig) => void;
  t: (key: string) => string;
}

const AgentManagement: React.FC<AgentManagementProps> = ({ config, setConfig, t }) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [deniedMessage, setDeniedMessage] = useState('');

  const handleSaveAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPermissionPrompt(true);
    setDeniedMessage('');
  };

  const verifyAndSave = (isAuthorized: boolean) => {
    if (isAuthorized) {
      setConfig(localConfig);
      setShowPermissionPrompt(false);
      alert('تم تحديث إعدادات المساعد بنجاح.');
    } else {
      setDeniedMessage(t('permissionRequired'));
    }
  };

  const inputStyle = "w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-white text-black font-bold focus:border-[#004AAD] outline-none transition-all text-sm shadow-sm";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2545B]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      
      <form onSubmit={handleSaveAttempt} className="space-y-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-xs font-black text-[#004AAD] uppercase tracking-widest">{t('contactNumber')}</label>
            <input type="text" value={localConfig.contactNumber} onChange={e => setLocalConfig({...localConfig, contactNumber: e.target.value})} className={inputStyle} />
          </div>
          <div className="space-y-2">
             <label className="block text-xs font-black text-[#004AAD] uppercase tracking-widest">{t('additionalInfo')}</label>
             <textarea rows={3} value={localConfig.additionalInfo} onChange={e => setLocalConfig({...localConfig, additionalInfo: e.target.value})} className={inputStyle} placeholder="مواقع الفروع، ساعات العمل، سياسة الاستبدال..." />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-[#004AAD] uppercase tracking-widest">{t('welcomeMsg')}</label>
            <textarea rows={2} value={localConfig.welcomeMessage} onChange={e => setLocalConfig({...localConfig, welcomeMessage: e.target.value})} className={inputStyle} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-[#004AAD] uppercase tracking-widest">{t('confirmMsg')}</label>
            <textarea rows={2} value={localConfig.confirmationMessage} onChange={e => setLocalConfig({...localConfig, confirmationMessage: e.target.value})} className={inputStyle} />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-50">
          <button type="submit" className="bg-[#004AAD] hover:bg-[#F2545B] text-white font-black py-4 px-12 rounded-2xl shadow-xl transition-all w-full md:w-auto text-lg">
            {t('save')}
          </button>
        </div>
      </form>

      {/* Permission Modal */}
      {showPermissionPrompt && (
        <div className="fixed inset-0 bg-[#004AAD]/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-md w-full shadow-2xl border-t-8 border-[#F2545B] text-center">
            <div className="w-16 h-16 bg-[#F2545B]/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-8 h-8 text-[#F2545B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-[#004AAD] mb-2">{t('permissionCheck')}</h3>
            <p className="text-gray-500 font-bold mb-8">هل أنت متأكد من امتلاك صلاحية تعديل الإعدادات؟</p>
            
            {deniedMessage && (
              <div className="p-4 bg-red-50 text-[#F2545B] rounded-2xl mb-8 text-sm font-black border border-red-100 animate-shake">
                {deniedMessage}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => verifyAndSave(true)} className="bg-[#004AAD] text-white font-black py-4 rounded-2xl hover:bg-green-600 transition-all shadow-lg">نعم، تأكيد</button>
              <button onClick={() => verifyAndSave(false)} className="bg-gray-100 text-gray-400 font-black py-4 rounded-2xl hover:bg-gray-200 transition-all">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentManagement;
