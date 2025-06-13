import React, { useState, useMemo } from 'react';
import { format, addDays, startOfWeek, eachDayOfInterval, endOfWeek, parseISO, isEqual, isBefore, isAfter } from 'date-fns';
import BookingModal from './BookingModal';
import type { Reservation } from '../../apiService/reservationService'; // Import actual Reservation type
import type { Room } from '../../apiService/roomService'; // Import actual Room type
import { useTranslation } from 'react-i18next';


interface CalendarViewProps {
  view: 'day' | 'week' | 'month';
  currentDate: Date;
  reservations: Reservation[];
  rooms: Room[]; // Pass actual rooms data
  isLoading: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({ view, currentDate, reservations, rooms, isLoading }) => {
  const { t } = useTranslation();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedModalDate, setSelectedModalDate] = useState<Date | null>(null);
  const [selectedModalRoomId, setSelectedModalRoomId] = useState<number | null>(null);

  // Generate days for the current view
  const weekStart = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 1 }), [currentDate]);
  const weekDays = useMemo(() => eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(weekStart, { weekStartsOn: 1 })
  }), [weekStart]);

  // Helper to check if reservation overlaps with a specific date
  const isReservationOnDate = (reservation: Reservation, date: Date) => {
    // Ensure dates are compared without time component
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startDate = parseISO(reservation.check_in_date); // Dates are ISO strings
    const endDate = parseISO(reservation.check_out_date);   // Dates are ISO strings
    
    const resStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const resEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    // Reservation is on date if date is between start (inclusive) and end (inclusive)
    return (isEqual(checkDate, resStartDate) || isAfter(checkDate, resStartDate)) &&
           (isEqual(checkDate, resEndDate) || isBefore(checkDate, resEndDate));
  };

  // Get payment status color
  const getPaymentStatusColor = (status: Reservation['payment_status']) => {
    switch (status) {
      case 'paid': return 'bg-green-600 border-green-600';
      case 'pending': return 'bg-yellow-500 border-yellow-500';
      case 'partially_paid': return 'bg-blue-500 border-blue-500';
      // case 'cancelled': return 'bg-red-500 border-red-500'; // If you add cancellation status
      default: return 'bg-slate-500 border-slate-500';
    }
  };

  const handleBookClick = (date: Date, roomId: number) => {
    setSelectedModalDate(date);
    setSelectedModalRoomId(roomId);
    setIsBookingModalOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-10 text-slate-400">{t('common.loading', 'Loading reservations...')}</div>;
  }

  if (view !== 'week') {
    return <div className="text-center py-10 text-slate-400">{t('common.notImplementedView', `${view.charAt(0).toUpperCase() + view.slice(1)} view is not implemented yet.`)}</div>;
  }

  // Render week view
  return (
    <>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <div className="min-w-[1000px]"> {/* Ensure enough width for 7 days + room column */}
          {/* Header - Days of the week */}
          <div className="grid grid-cols-[120px_repeat(7,1fr)] gap-px bg-slate-700"> {/* Fixed room column width */}
            <div className="h-12 flex items-center justify-center p-2 text-sm font-medium text-slate-200">
              {t('calendar.room', 'Room')}
            </div>
            {weekDays.map((day, i) => (
              <div 
                key={i} 
                className="h-12 flex flex-col items-center justify-center p-1 text-sm"
              >
                <div className="text-xs text-slate-400">{format(day, 'EEE')}</div>
                <div className="font-medium text-slate-200">{format(day, 'd')}</div>
              </div>
            ))}
          </div>
          
          {/* Rows - Rooms */}
          {rooms.map((room) => (
            <div key={room.id} className="grid grid-cols-[120px_repeat(7,1fr)] gap-px mt-px bg-slate-700">
              <div className="min-h-[70px] flex flex-col items-center justify-center p-2 bg-slate-750 text-center">
                <span className="font-medium text-slate-100 text-sm">{room.room_number}</span>
                <span className="text-xs text-slate-400">{t(`rooms.types.${room.type.toLowerCase()}`, room.type)}</span>
              </div>
              
              {weekDays.map((day) => {
                const dayReservations = reservations.filter(
                  res => res.room_id === room.id && isReservationOnDate(res, day)
                );
                
                return (
                  <div 
                    key={day.toISOString()}
                    className="min-h-[70px] bg-slate-800 p-1 relative hover:bg-slate-750 transition-colors group"
                  >
                    {dayReservations.length > 0 ? (
                      dayReservations.map((reservation) => (
                        <div 
                          key={reservation.id}
                          title={`${t('calendar.guestTooltip', 'Guest')}: ${reservation.guests?.name || t('calendar.unknownGuest', 'Unknown Guest')}\n${t('calendar.datesTooltip', 'Dates')}: ${format(parseISO(reservation.check_in_date), 'MMM d')} - ${format(parseISO(reservation.check_out_date), 'MMM d')}`}
                          className={`absolute inset-0.5 rounded-sm p-1.5 overflow-hidden flex flex-col justify-center text-white ${getPaymentStatusColor(reservation.payment_status)} bg-opacity-30 border-l-4 cursor-pointer hover:shadow-lg`}
                          onClick={() => {/* TODO: Open reservation details modal or navigate */}}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-xs line-clamp-2">
                              {reservation.guests?.name || t('calendar.guestId', `Guest ID: ${reservation.guest_id}`)}
                            </span>
                            {/* Optional: Small dot with status color if needed */}
                          </div>
                          {/* <div className="text-xs mt-auto">{format(parseISO(reservation.check_in_date), 'MMM d')} - {format(parseISO(reservation.check_out_date), 'MMM d')}</div> */}
                        </div>
                      ))
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="btn-primary-outline btn-xs" // Use a smaller button style
                          onClick={() => handleBookClick(day, room.id)}
                        >
                          + {t('calendar.book', 'Book')}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          selectedDate={selectedModalDate}
          selectedRoomId={selectedModalRoomId}
        />
      )}
    </>
  );
};

export default CalendarView;