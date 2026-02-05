
import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: () => void;
  adminAuth: any;
  t: (key: string) => string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, adminAuth, t }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === adminAuth.username && password === adminAuth.password) {
      onLogin();
    } else {
      setError(localStorage.getItem('lang') === 'en' ? 'Invalid username or password' : 'خطأ في اسم المستخدم أو كلمة المرور');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 p-2">
        <div className="bg-[#004AAD] rounded-[2.2rem] p-12 text-center shadow-lg border-b-8 border-[#F2545B]">
          <div className="w-24 h-24 bg-white rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-inner">
             <span className="text-[#004AAD] text-5xl font-black">د</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">{t('login')}</h2>
          <p className="text-blue-100 text-sm font-bold opacity-70">نظام إدارة شركة دان</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-12 space-y-8">
          {error && (
            <div className="bg-red-50 text-[#F2545B] p-4 rounded-2xl text-sm border border-red-100 text-center font-black">
              {error}
            </div>
          )}
          <div className="space-y-3">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.15em] px-2">{t('username')}</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#004AAD] outline-none transition-all text-black font-bold text-lg"
              placeholder={t('username')}
            />
          </div>
          <div className="space-y-3">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.15em] px-2">{t('password')}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#004AAD] outline-none transition-all text-black font-bold text-lg"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-[#004AAD] hover:bg-[#F2545B] text-white font-black py-5 rounded-2xl shadow-xl transition-all text-xl"
          >
            {t('login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
