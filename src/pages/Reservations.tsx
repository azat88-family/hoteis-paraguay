import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Search, Plus, AlertTriangle } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import CalendarView from '../components/reservations/CalendarView';
import { useTranslation } from 'react-i18next';
import { getReservations, Reservation } from '../apiService/reservationService'; // Import service and type
import { useNavigate } from 'react-router-dom';


const ReservationsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [searchQuery, setSearchQuery] = useState('');

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getReservations();
        setReservations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.unknownError', 'An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, [t]); // Added t to dependency array as it's used in error message

  const handleNewReservationClick = () => {
    navigate('/reservations/new'); // Or to where BookingModal is triggered
  };

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

  // TODO: Filter reservations based on searchQuery if needed at this level, or pass to CalendarView

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">{t('reservations.title', 'Reservations')}</h1>
        <button onClick={handleNewReservationClick} className="btn-primary flex items-center">
          <Plus size={18} className="mr-2" />
          {t('reservations.new', 'New Reservation')}
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={goToPrevious}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors"
              aria-label={t('common.previousPeriod', 'Previous Period')}
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span className="text-lg font-medium text-white">{getDisplayPeriod()}</span>
            </div>
            
            <button 
              onClick={goToNext}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors"
              aria-label={t('common.nextPeriod', 'Next Period')}
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
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-700 border-transparent focus:border-blue-500 focus:ring-blue-500 rounded-md text-white"
              />
            </div>
            
            <div className="border-r border-slate-600 h-8 hidden md:block" />
            
            <div className="flex rounded-md overflow-hidden bg-slate-700">
              {(['day', 'week', 'month'] as const).map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    view === viewType ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-600 hover:text-white'
                  }`}
                >
                  {t(`common.view.${viewType}`, viewType.charAt(0).toUpperCase() + viewType.slice(1))}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4 flex items-center">
            <AlertTriangle size={20} className="mr-3" />
            <span>{t('common.errorLoading', 'Error loading reservations:')} {error}</span>
          </div>
        )}

        <CalendarView
          view={view}
          currentDate={currentDate}
          reservations={reservations}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ReservationsPage;