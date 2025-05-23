import React, { useState } from 'react';
import { Calendar, CreditCard, DollarSign, Users, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import RevenueChart from '../components/dashboard/RevenueChart';
import OccupancyChart from '../components/dashboard/OccupancyChart';
import RecentReservationsTable from '../components/dashboard/RecentReservationsTable';
import StatCard from '../components/dashboard/StatCard';
import { useNavigate } from 'react-router-dom'; // <-- Adicionado

const Dashboard: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const { t } = useTranslation();
  const navigate = useNavigate(); // <-- Adicionado

  const goToPreviousDay = () => {
    setDate(subDays(date, 1));
  };

  const goToNextDay = () => {
    setDate(addDays(date, 1));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">{t('dashboard.title')}</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={goToPreviousDay}
            className="p-2 rounded-full hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-lg font-medium">{format(date, 'MMMM d, yyyy')}</span>
          <button 
            onClick={goToNextDay}
            className="p-2 rounded-full hover:bg-slate-700 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('dashboard.stats.roomsBooked')}
          value="32/50" 
          icon={<Calendar className="h-8 w-8" />} 
          change={+5}
          color="blue"
        />
        <StatCard 
          title={t('dashboard.stats.totalGuests')}
          value="48" 
          icon={<Users className="h-8 w-8" />} 
          change={+12}
          color="green"
        />
        <StatCard 
          title={t('dashboard.stats.todayRevenue')}
          value="$3,240" 
          icon={<DollarSign className="h-8 w-8" />} 
          change={+7.8}
          color="yellow"
        />
        <StatCard 
          title={t('dashboard.stats.pendingPayments')}
          value="$840" 
          icon={<CreditCard className="h-8 w-8" />} 
          change={-2.5}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{t('dashboard.charts.revenue')}</h2>
            <select className="bg-slate-700 border border-slate-600 rounded-md text-sm px-3 py-1.5">
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">Last 12 months</option>
            </select>
          </div>
          <RevenueChart />
        </div>
        
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{t('dashboard.charts.occupancy')}</h2>
            <select className="bg-slate-700 border border-slate-600 rounded-md text-sm px-3 py-1.5">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <OccupancyChart />
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold">{t('dashboard.recentReservations')}</h2>
          <button
            className="flex items-center text-blue-500 hover:text-blue-400 transition-colors"
            onClick={() => navigate('/guests/new')} // <-- Corrigido aqui
          >
            <span className="mr-1">{t('common.add')}</span>
            <FileText size={16} />
          </button>
        </div>

        
        <RecentReservationsTable />
      </div>
    </div>
  );
};

export default Dashboard;