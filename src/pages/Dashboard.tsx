import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, DollarSign, Users, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import RevenueChart from '../components/dashboard/RevenueChart';
import OccupancyChart from '../components/dashboard/OccupancyChart';
import RecentReservationsTable from '../components/dashboard/RecentReservationsTable';
import StatCard from '../components/dashboard/StatCard';
import { useNavigate } from 'react-router-dom';
import { getExchangeRates } from '../services/currencyService';

const Dashboard: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [exchangeRates, setExchangeRates] = useState({ BRL: 5.3, PYG: 7300, USD: 1 });

  useEffect(() => {
    const fetchRates = async () => {
      const rates = await getExchangeRates();
      setExchangeRates(rates);
    };
    fetchRates();
  }, []);

  // Função para moeda flexível por país
  function formatCurrency(value: number) {
    let currency = 'USD';
    let rate = exchangeRates.USD;
    if (i18n.language === 'pt-BR') {
      currency = 'BRL';
      rate = exchangeRates.BRL;
    } else if (i18n.language === 'es-PY') {
      currency = 'PYG';
      rate = exchangeRates.PYG;
    }
    return (value * rate).toLocaleString(i18n.language, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0
    });
  }

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
          value={formatCurrency(3240)}
          icon={<DollarSign className="h-8 w-8" />} 
          change={+7.8}
          color="yellow"
        />
        <StatCard 
          title={t('dashboard.stats.pendingPayments')}
          value={formatCurrency(840)}
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
              <option value="week">{t('dashboard.charts.last7days', 'Last 7 days')}</option>
              <option value="month">{t('dashboard.charts.last30days', 'Last 30 days')}</option>
              <option value="year">{t('dashboard.charts.last12months', 'Last 12 months')}</option>
            </select>
          </div>
          <RevenueChart />
        </div>
        
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{t('dashboard.charts.occupancy')}</h2>
            <select className="bg-slate-700 border border-slate-600 rounded-md text-sm px-3 py-1.5">
              <option value="week">{t('dashboard.charts.thisWeek', 'This Week')}</option>
              <option value="month">{t('dashboard.charts.thisMonth', 'This Month')}</option>
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
            onClick={() => navigate('/guests/new')}
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