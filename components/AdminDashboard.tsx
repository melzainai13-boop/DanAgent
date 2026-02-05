
import React, { useState } from 'react';
import { Order, AgentConfig } from '../types';
import OrderLog from './OrderLog';
import AgentManagement from './AgentManagement';
import PriceListUpdate from './PriceListUpdate';
import AccountSettings from './AccountSettings';

interface AdminDashboardProps {
  orders: Order[];
  updateOrderStatus: (id: string, status: Order['status']) => void;
  config: AgentConfig;
  setConfig: (config: AgentConfig) => void;
  priceListText: string;
  setPriceListText: (text: string) => void;
  adminAuth: any;
  setAdminAuth: (auth: any) => void;
  onLogout: () => void;
  t: (key: string) => string;
  lang: 'ar' | 'en';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, updateOrderStatus, config, setConfig, priceListText, setPriceListText, adminAuth, setAdminAuth, onLogout, t, lang }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'agent' | 'price' | 'account'>('orders');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'orders', label: t('ordersLog'), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'agent', label: t('agentConfig'), icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'price', label: t('priceList'), icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'account', label: t('accountSettings'), icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] relative">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 z-50 w-64 bg-[#004AAD] text-white flex flex-col transition-transform duration-300 transform ${lang === 'ar' ? 'right-0' : 'left-0'} ${isSidebarOpen ? 'translate-x-0' : (lang === 'ar' ? 'translate-x-full' : '-translate-x-full')} lg:translate-x-0 lg:static lg:h-screen`}>
        <div className="p-6 border-b border-white/10 flex items-center gap-3"><div className="w-8 h-8 bg-white rounded text-[#004AAD] flex items-center justify-center font-black">د</div><h1 className="text-lg font-black">لوحة التحكم</h1></div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-[#F2545B] text-white shadow-lg' : 'text-blue-100 hover:bg-white/5'}`}>
              <svg className="w-5 h-5 ml-3 rtl:ml-3 ltr:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4"><button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-200 font-bold border border-transparent hover:bg-red-500/10">خروج</button></div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col h-screen">
        <header className="bg-white border-b px-4 md:px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-100 rounded-lg lg:hidden"><svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
            <h2 className="text-lg md:text-2xl font-black text-[#004AAD]">{menuItems.find(m => m.id === activeTab)?.label}</h2>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-6xl mx-auto w-full">
            {activeTab === 'orders' && <OrderLog orders={orders} updateStatus={updateOrderStatus} t={t} lang={lang} />}
            {activeTab === 'agent' && <AgentManagement config={config} setConfig={setConfig} t={t} />}
            {activeTab === 'price' && <PriceListUpdate priceListText={priceListText} setPriceListText={setPriceListText} t={t} />}
            {activeTab === 'account' && <AccountSettings auth={adminAuth} setAuth={setAdminAuth} t={t} />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
