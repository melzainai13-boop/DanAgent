
import React, { useState } from 'react';

interface AccountSettingsProps {
  auth: any;
  setAuth: (auth: any) => void;
  t: (key: string) => string;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ auth, setAuth, t }) => {
  const [username, setUsername] = useState(auth.username);
  const [password, setPassword] = useState(auth.password);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuth({ username, password });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-extrabold text-gray-800">{t('newUsername')}</label>
          <input 
            type="text" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white text-black focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00] outline-none transition-all font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-extrabold text-gray-800">{t('newPassword')}</label>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white text-black focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00] outline-none transition-all font-bold"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button 
            type="submit"
            className="bg-[#0A2342] hover:bg-slate-800 text-white font-extrabold py-3 px-10 rounded-xl shadow-lg transition-all"
          >
            {t('save')}
          </button>
          {saved && (
            <span className="text-green-600 font-extrabold text-sm flex items-center">
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              تم الحفظ
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
