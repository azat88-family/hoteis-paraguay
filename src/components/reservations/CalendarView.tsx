import React, { useState } from 'react';
import { format, addDays, startOfWeek, eachDayOfInterval, endOfWeek } from 'date-fns';
import BookingModal from './BookingModal';

interface Reservation {
  id: string;
  guestName: string;
  roomNumber: string;
  startDate: Date;
  endDate: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface CalendarViewProps {
  view: 'day' | 'week' | 'month';
  currentDate: Date;
}

// Mock data for reservations
const reservationsData: Reservation[] = [
  {
    id: 'R1001',
    guestName: 'John Smith',
    roomNumber: '101',
    startDate: new Date(2023, 5, 12),
    endDate: new Date(2023, 5, 15),
    status: 'confirmed'
  },
  {
    id: 'R1002',
    guestName: 'Emma Wilson',
    roomNumber: '205',
    startDate: new Date(2023, 5, 14),
    endDate: new Date(2023, 5, 18),
    status: 'pending'
  },
  {
    id: 'R1003',
    guestName: 'Michael Brown',
    roomNumber: '304',
    startDate: new Date(2023, 5, 15),
    endDate: new Date(2023, 5, 20),
    status: 'confirmed'
  },
  {
    id: 'R1004',
    guestName: 'Olivia Johnson',
    roomNumber: '402',
    startDate: new Date(2023, 5, 16),
    endDate: new Date(2023, 5, 19),
    status: 'confirmed'
  },
  {
    id: 'R1005',
    guestName: 'William Davis',
    roomNumber: '503',
    startDate: new Date(2023, 5, 13),
    endDate: new Date(2023, 5, 14),
    status: 'cancelled'
  }
];

// Mock data for rooms
const roomsData = Array.from({ length: 15 }, (_, i) => ({
  id: `${i + 101}`,
  type: i % 3 === 0 ? 'Deluxe' : i % 3 === 1 ? 'Standard' : 'Suite'
}));

const CalendarView: React.FC<CalendarViewProps> = ({ view, currentDate }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // Generate days for week view
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(weekStart, { weekStartsOn: 1 }) // End on Sunday
  });

  // Helper to check if reservation is on specific date
  const isReservationOnDate = (reservation: Reservation, date: Date) => {
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startDate = new Date(
      reservation.startDate.getFullYear(), 
      reservation.startDate.getMonth(), 
      reservation.startDate.getDate()
    );
    const endDate = new Date(
      reservation.endDate.getFullYear(), 
      reservation.endDate.getMonth(), 
      reservation.endDate.getDate()
    );
    
    return checkDate >= startDate && checkDate <= endDate;
  };

  // Get status color
  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const handleBookClick = (date: Date, roomId: string) => {
    setSelectedDate(date);
    setSelectedRoom(roomId);
    setIsBookingModalOpen(true);
  };

  // Render week view
  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header - Days of the week */}
          <div className="grid grid-cols-8 gap-1">
            <div className="h-12 flex items-center justify-center bg-slate-700 rounded-tl-md font-medium">
              Room
            </div>
            {weekDays.map((day, i) => (
              <div 
                key={i} 
                className={`h-12 flex flex-col items-center justify-center bg-slate-700 ${
                  i === 6 ? 'rounded-tr-md' : ''
                }`}
              >
                <div className="text-xs text-slate-400">{format(day, 'EEE')}</div>
                <div className="font-medium">{format(day, 'd')}</div>
              </div>
            ))}
          </div>
          
          {/* Rows - Rooms */}
          {roomsData.map((room, roomIndex) => (
            <div key={room.id} className="grid grid-cols-8 gap-1 mt-1">
              <div className="h-16 flex items-center justify-center bg-slate-700 font-medium">
                <div className="flex flex-col items-center">
                  <span>{room.id}</span>
                  <span className="text-xs text-slate-400">{room.type}</span>
                </div>
              </div>
              
              {weekDays.map((day, dayIndex) => {
                // Get reservations for this room on this day
                const dayReservations = reservationsData.filter(
                  res => res.roomNumber === room.id && isReservationOnDate(res, day)
                );
                
                return (
                  <div 
                    key={dayIndex} 
                    className="h-16 bg-slate-800 border border-slate-700 relative hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {dayReservations.length > 0 ? (
                      dayReservations.map((reservation, i) => (
                        <div 
                          key={reservation.id}
                          className={`absolute inset-0 m-1 rounded-sm p-1 overflow-hidden flex flex-col justify-between ${getStatusColor(reservation.status)} bg-opacity-20 border-l-4 ${getStatusColor(reservation.status)}`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-xs line-clamp-1">{reservation.guestName}</span>
                            <span className={`w-2 h-2 rounded-full ${getStatusColor(reservation.status)}`}></span>
                          </div>
                          <div className="text-xs">{format(reservation.startDate, 'MMM d')} - {format(reservation.endDate, 'MMM d')}</div>
                        </div>
                      ))
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                          onClick={() => handleBookClick(day, room.id)}
                        >
                          + Book
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

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedDate={selectedDate || undefined}
        selectedRoom={selectedRoom || undefined}
      />
    </>
  );
};

export default CalendarView;