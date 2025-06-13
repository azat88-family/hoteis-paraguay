import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Hotel, Calendar, LogOut, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import CurrencyRates from './CurrencyRates';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="bg-slate-800 w-64 h-full flex flex-col border-r border-slate-700">
      <div className="flex items-center justify-center h-16 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Hotel className={`h-6 w-6 ${user?.role === 'owner' ? 'text-amber-500' : 'text-blue-500'}`} />
          <h1 className="text-xl font-bold tracking-wider text-white">HOTEL PORTAL</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        {/* Dashboard principal para admin/attendant/owner */}
        <NavLink
          to={
            user?.role === 'admin'
              ? '/admin-dashboard'
              : user?.role === 'attendant'
              ? '/attendant-dashboard'
              : '/portal'
          }
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-md transition-colors ${
              isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5 mr-3" />
          <span>{t('dashboard.title', 'Painel')}</span>
        </NavLink>

        {/* Admin, Owner e Attendant: Gerenciar Hóspedes */}
        {(user?.role === 'admin' || user?.role === 'owner' || user?.role === 'attendant') && (
          <NavLink
            to="/guests"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <Users className="h-5 w-5 mr-3" />
            <span>{t('guests.title', 'Hóspedes')}</span>
          </NavLink>
        )}

        {/* Admin, Owner e Attendant: Quartos e Reservas */}
        {(user?.role === 'admin' || user?.role === 'owner' || user?.role === 'attendant') && (
          <>
            <NavLink
              to="/rooms"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`
              }
            >
              <Hotel className="h-5 w-5 mr-3" />
              <span>{t('rooms.title', 'Quartos')}</span>
            </NavLink>
            
            <NavLink
              to="/reservations"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`
              }
            >
              <Calendar className="h-5 w-5 mr-3" />
              <span>{t('reservations.title', 'Reservas')}</span>
            </NavLink>
          </>
        )}

        {/* Panel: mostra para admin e owner, e sempre vai para /dashboard */}
        {(user?.role === 'admin' || user?.role === 'owner') && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <DollarSign className="h-5 w-5 mr-3" />
            <span>Panel</span>
          </NavLink>
        )}
      </nav>
      
      <div className="mt-auto">
        <CurrencyRates />
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-slate-300 rounded-md hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>{t('auth.logout', 'Sair')}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
