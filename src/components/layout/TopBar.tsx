import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const TopBar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-slate-800 border-b border-slate-700">
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('common.search')}
            className="w-full py-2 pl-10 pr-4 text-sm bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        
        <button className="p-2 mr-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors duration-200">
          <Bell size={20} />
        </button>
        <button className="p-2 mr-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors duration-200">
          <Settings size={20} />
        </button>
        
        <div className="relative group ml-2">
          <button className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {user?.name.charAt(0) || 'A'}
            </div>
            <span className="ml-2 font-medium">{user?.name || 'Admin'}</span>
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-slate-700">
            <button className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
              <User size={16} className="mr-3" />
              <span>{t('common.profile')}</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
            >
              <LogOut size={16} className="mr-3" />
              <span>{t('auth.logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;