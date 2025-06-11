import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Search, Plus } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import CalendarView from '../components/reservations/CalendarView';
import { useTranslation } from 'react-i18next';

const Reservations: React.FC = () => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [searchQuery, setSearchQuery] = useState('');

  // Navigate to previous period
  const goToPrevious = () => {
    if (view === 'day') {
      setCurrentDate(prevDate => addDays(prevDate, -1));
    } else if (view === 'week') {
      setCurrentDate(prevDate => addDays(prevDate, -7));
    } else {
      // Month view
      const prevMonth = new Date(currentDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      setCurrentDate(prevMonth);
    }
  };

  // Navigate to next period
  const goToNext = () => {
    if (view === 'day') {
      setCurrentDate(prevDate => addDays(prevDate, 1));
    } else if (view === 'week') {
      setCurrentDate(prevDate => addDays(prevDate, 7));
    } else {
      // Month view
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setCurrentDate(nextMonth);
    }
  };

  // Get current display period
  const getDisplayPeriod = () => {
    if (view === 'day') {
      return format(currentDate, 'MMMM d, yyyy');
    } else if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
      const end = endOfWeek(currentDate, { weekStartsOn: 1 }); // End on Sunday
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'MMMM yyyy');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Reservations</h1>
        <button className="btn-primary flex items-center">
          <Plus size={18} className="mr-2" />
          New Reservation
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={goToPrevious}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span className="text-lg font-medium">{getDisplayPeriod()}</span>
            </div>
            
            <button 
              onClick={goToNext}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-grow md:min-w-[240px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('reservations.searchPlaceholder', 'Search reservations...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-700 border border-slate-600 rounded-md"
              />
            </div>
            
            <div className="border-r border-slate-600 h-8" />
            
            <div className="flex rounded-md overflow-hidden">
              <button 
                onClick={() => setView('day')} 
                className={`px-3 py-1.5 text-sm font-medium ${
                  view === 'day' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Day
              </button>
              <button 
                onClick={() => setView('week')} 
                className={`px-3 py-1.5 text-sm font-medium ${
                  view === 'week' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Week
              </button>
              <button 
                onClick={() => setView('month')} 
                className={`px-3 py-1.5 text-sm font-medium ${
                  view === 'month' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </div>
        
        <CalendarView view={view} currentDate={currentDate} />
      </div>
    </div>
  );
};

export default Reservations;