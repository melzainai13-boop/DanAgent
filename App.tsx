
import React, { useState, useEffect } from 'react';
import { INITIAL_AGENT_CONFIG, TRANSLATIONS, MOCK_ORDERS, PRICE_LIST_DATA } from './constants';
import { Order, AgentConfig } from './types';
import AdminDashboard from './components/AdminDashboard';
import VoiceAgent from './components/VoiceAgent';
import AdminLogin from './components/AdminLogin';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'agent' | 'admin'>('agent');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [adminAuth, setAdminAuth] = useState(() => JSON.parse(localStorage.getItem('dan_admin_auth') || '{"username":"admin","password":"admin"}'));
  const [agentConfig, setAgentConfig] = useState<AgentConfig>(() => JSON.parse(localStorage.getItem('dan_agent_config') || JSON.stringify(INITIAL_AGENT_CONFIG)));
  const [orders, setOrders] = useState<Order[]>(() => JSON.parse(localStorage.getItem('dan_orders') || JSON.stringify(MOCK_ORDERS)));
  const [priceListText, setPriceListText] = useState(PRICE_LIST_DATA);
  
  // حفظ بيانات العميل الأخيرة لتذكرها في المرات القادمة
  const [lastCustomer, setLastCustomer] = useState(() => {
    const saved = localStorage.getItem('dan_last_customer');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => { localStorage.setItem('dan_admin_auth', JSON.stringify(adminAuth)); }, [adminAuth]);
  useEffect(() => { localStorage.setItem('dan_agent_config', JSON.stringify(agentConfig)); }, [agentConfig]);
  useEffect(() => { localStorage.setItem('dan_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { 
    if (lastCustomer) localStorage.setItem('dan_last_customer', JSON.stringify(lastCustomer));
  }, [lastCustomer]);

  const t = (key: string) => TRANSLATIONS[lang][key as keyof typeof TRANSLATIONS['en']] || key;
  
  const addOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    // تحديث ذاكرة العميل الأخيرة
    setLastCustomer({
      name: newOrder.customerName,
      phone: newOrder.phone,
      address: newOrder.address
    });
  };

  const updateOrderStatus = (id: string, status: Order['status']) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="fixed top-0 inset-x-0 bg-white shadow-sm z-50 py-3 px-4 md:px-12 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[#004AAD] rounded flex items-center justify-center text-white font-black">د</div>
          <div className="flex flex-col"><span className="text-xs md:text-lg font-black text-[#004AAD]">شركة دان</span><span className="text-[8px] md:text-[10px] font-bold text-[#F2545B]">Multi-Activities</span></div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="bg-gray-50 border rounded-lg px-2 py-1 text-[10px] md:text-sm font-bold">{lang === 'ar' ? 'EN' : 'عربي'}</button>
          <button onClick={() => view === 'agent' ? setView('admin') : setView('agent')} className="bg-[#004AAD] text-white rounded-lg px-3 py-1.5 text-[10px] md:text-sm font-extrabold shadow-sm">{view === 'agent' ? t('dashboard') : t('callAgent')}</button>
        </div>
      </header>

      <div className="flex-1 flex flex-col pt-16 md:pt-20">
        {view === 'agent' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 pb-12">
            <div className="max-w-3xl w-full">
              <div className="text-center mb-6 md:mb-8">
                <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-2xl md:rounded-[2.5rem] shadow-xl mx-auto mb-4 flex items-center justify-center border-4 border-[#004AAD]/10"><span className="text-[#004AAD] text-4xl md:text-6xl font-black">د</span></div>
                <h1 className="text-xl md:text-4xl font-black text-[#004AAD] mb-2">{t('welcome')}</h1>
                <p className="text-gray-500 font-bold text-xs md:text-lg">{lang === 'ar' ? 'نحن هنا لخدمتك. اطلب احتياجاتك الطبية بسهولة.' : 'We are here to serve you.'}</p>
              </div>
              <VoiceAgent config={agentConfig} onOrderComplete={addOrder} priceList={priceListText} t={t} lang={lang} lastCustomer={lastCustomer} />
            </div>
          </div>
        ) : (
          !isLoggedIn ? <AdminLogin onLogin={() => setIsLoggedIn(true)} adminAuth={adminAuth} t={t} /> : 
          <AdminDashboard orders={orders} updateOrderStatus={updateOrderStatus} config={agentConfig} setConfig={setAgentConfig} priceListText={priceListText} setPriceListText={setPriceListText} adminAuth={adminAuth} setAdminAuth={setAdminAuth} onLogout={() => {setIsLoggedIn(false); setView('agent');}} t={t} lang={lang} />
        )}
      </div>

      <footer className="bg-[#004AAD] text-white py-8 px-4 md:px-12 border-t-4 border-[#F2545B]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <h3 className="text-xl font-black">دان للأنشطة المتعددة</h3>
          <div className="text-[10px] md:text-sm opacity-90 tracking-widest uppercase">Powered by Astric Company | +249127556666</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
