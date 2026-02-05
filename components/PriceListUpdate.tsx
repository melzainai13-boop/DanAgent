
import React, { useState } from 'react';

interface PriceListUpdateProps {
  priceListText: string;
  setPriceListText: (text: string) => void;
  t: (key: string) => string;
}

const PriceListUpdate: React.FC<PriceListUpdateProps> = ({ priceListText, setPriceListText, t }) => {
  const [localText, setLocalText] = useState(priceListText);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [deniedMessage, setDeniedMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdateAttempt = () => {
    setShowPermissionPrompt(true);
    setDeniedMessage('');
  };

  const verifyAndUpload = (isAuthorized: boolean) => {
    if (isAuthorized) {
      setIsProcessing(true);
      // تحديث البيانات نصياً
      setTimeout(() => {
        setPriceListText(localText);
        setShowPermissionPrompt(false);
        setIsProcessing(false);
        alert('تم تحديث قاعدة بيانات الأدوية والأسعار بنجاح.');
      }, 800);
    } else {
      setDeniedMessage(t('permissionRequired'));
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 space-y-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#004AAD]/5 rounded-full -ml-16 -mt-16 blur-3xl"></div>
      
      <div className="space-y-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-6">
           <div>
             <h2 className="text-[#004AAD] font-black text-2xl mb-1">قائمة أسعار الأدوية</h2>
             <p className="text-gray-400 font-bold text-sm">قم بتعديل النص أدناه لتحديث معلومات المساعد الذكي</p>
           </div>
           <div className="px-4 py-2 bg-red-50 text-[#F2545B] rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm animate-pulse">
             System Update Mode: Manual Text Entry
           </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center px-2">
             <label className="text-xs font-black text-[#004AAD] uppercase tracking-tighter">محتوى قاعدة البيانات (نصي):</label>
             <span className="text-[10px] font-bold text-gray-300 italic">ملاحظة: المساعد يستخدم هذا النص كمرجع للأسعار</span>
          </div>
          <textarea 
            rows={15}
            value={localText}
            onChange={e => setLocalText(e.target.value)}
            className="w-full px-6 py-5 rounded-2xl border-2 border-gray-100 bg-[#F8FAFC] text-black font-bold focus:border-[#004AAD] focus:bg-white outline-none transition-all font-mono text-xs leading-relaxed shadow-inner"
            placeholder="أدخل قائمة الأسعار هنا..."
          />
        </div>

        <div className="flex justify-center md:justify-start">
          <button 
            onClick={handleUpdateAttempt}
            disabled={isProcessing}
            className={`bg-[#004AAD] text-white font-black py-5 px-16 rounded-2xl shadow-xl hover:bg-[#F2545B] hover:scale-105 active:scale-95 transition-all text-lg min-w-[200px] ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? 'جاري الحفظ...' : t('update')}
          </button>
        </div>
      </div>

      {/* Permission Modal */}
      {showPermissionPrompt && (
        <div className="fixed inset-0 bg-[#004AAD]/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-md w-full shadow-2xl border-t-8 border-[#F2545B] text-center transform transition-all animate-slideUp">
            <div className="w-20 h-20 bg-[#F2545B]/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-10 h-10 text-[#F2545B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <h3 className="text-2xl font-black text-[#004AAD] mb-2">{t('permissionCheck')}</h3>
            <p className="text-gray-500 font-bold mb-8">تحديث قاعدة البيانات يؤثر فوراً على ردود المساعد. هل تملك الصلاحية؟</p>
            
            {deniedMessage && (
              <div className="p-5 bg-red-50 text-[#F2545B] rounded-2xl mb-8 text-xs font-black border border-red-100 leading-relaxed animate-shake">
                {deniedMessage}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => verifyAndUpload(true)} 
                className="bg-[#004AAD] text-white font-black py-4 rounded-2xl hover:bg-green-600 transition-all shadow-lg"
              >
                تأكيد وحفظ التعديلات
              </button>
              <button 
                onClick={() => { setShowPermissionPrompt(false); setDeniedMessage(''); }} 
                className="bg-gray-100 text-gray-400 font-black py-4 rounded-2xl hover:bg-gray-200 transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceListUpdate;
