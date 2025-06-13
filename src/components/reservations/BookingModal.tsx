import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CreditCard, Calendar, User, Home, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { createReservation, CreateReservationData } from '../../apiService/reservationService';
import { getGuests, Guest } from '../../apiService/guestService';
import { getRooms, Room } from '../../apiService/roomService';
import { useNavigate, useLocation } from 'react-router-dom';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  // selectedDate can be used to prefill check-in
  // selectedRoomId can be used to prefill room selection
  selectedDate?: Date | null;
  selectedRoomId?: number | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, selectedDate, selectedRoomId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation(); // To get query params if navigating from RoomManageModal

  const [formData, setFormData] = useState<Partial<CreateReservationData>>({
    guest_id: undefined,
    room_id: selectedRoomId || undefined,
    check_in_date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    check_out_date: '',
    total_amount: 0, // Default or calculate based on room and dates
    payment_status: 'pending',
    payment_method: 'credit_card',
  });

  const [guestsList, setGuestsList] = useState<Guest[]>([]);
  const [roomsList, setRoomsList] = useState<Room[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(false);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Update form data if selectedRoomId comes from props (e.g. from RoomCard context)
  useEffect(() => {
    if (selectedRoomId) {
      setFormData(prev => ({ ...prev, room_id: selectedRoomId }));
    }
  }, [selectedRoomId]);

  // Fetch roomId from URL query params if available (e.g. navigating from RoomManageModal)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomIdFromQuery = queryParams.get('roomId');
    if (roomIdFromQuery && !selectedRoomId) {
      setFormData(prev => ({ ...prev, room_id: parseInt(roomIdFromQuery, 10) }));
    }
  }, [location.search, selectedRoomId]);


  useEffect(() => {
    if (isOpen) {
      // Reset messages
      setError(null);
      setSuccessMessage(null);

      // Fetch guests
      setIsLoadingGuests(true);
      getGuests()
        .then(data => setGuestsList(data))
        .catch(() => setError(t('reservations.bookingModal.errors.loadGuests', 'Failed to load guests.')))
        .finally(() => setIsLoadingGuests(false));

      // Fetch rooms
      setIsLoadingRooms(true);
      getRooms()
        .then(data => setRoomsList(data.filter(room => room.status === 'available' || (selectedRoomId && room.id === selectedRoomId)))) // Show available or selected
        .catch(() => setError(t('reservations.bookingModal.errors.loadRooms', 'Failed to load rooms.')))
        .finally(() => setIsLoadingRooms(false));

      // Pre-fill check-in if selectedDate is provided
      if (selectedDate) {
        setFormData(prev => ({ ...prev, check_in_date: selectedDate.toISOString().split('T')[0] }));
      }

    }
  }, [isOpen, t, selectedDate, selectedRoomId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'guest_id' || name === 'room_id' || name === 'total_amount' ? Number(value) : value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.guest_id || !formData.room_id || !formData.check_in_date || !formData.check_out_date || formData.total_amount === undefined || formData.total_amount <=0) {
      setError(t('reservations.bookingModal.errors.allFieldsRequired', 'Please fill all required fields and ensure amount is valid.'));
      return;
    }
    if (new Date(formData.check_out_date) <= new Date(formData.check_in_date)) {
      setError(t('reservations.bookingModal.errors.checkoutAfterCheckin', 'Check-out date must be after check-in date.'));
      return;
    }

    setIsSubmitting(true);
    try {
      // Ensure all required fields for CreateReservationData are present
      const reservationData: CreateReservationData = {
        guest_id: formData.guest_id,
        room_id: formData.room_id,
        check_in_date: formData.check_in_date,
        check_out_date: formData.check_out_date,
        total_amount: formData.total_amount,
        payment_status: formData.payment_status || 'pending',
        payment_method: formData.payment_method || 'credit_card',
      };
      await createReservation(reservationData);
      setSuccessMessage(t('reservations.bookingModal.success.bookingCreated', 'Booking created successfully!'));
      setTimeout(() => {
        onClose(); // Close modal
        navigate('/reservations'); // Or to a confirmation page
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.unknownError', 'An unknown error occurred.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in-fast">
      <div className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="p-5 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{t('reservations.bookingModal.title', 'New Booking')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors" aria-label={t('common.close', 'Close')}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-grow">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg flex items-center">
              <AlertTriangle size={20} className="mr-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg flex items-center">
              <CheckCircle size={20} className="mr-3 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="guest_id" className="block text-sm font-medium text-slate-300 mb-1.5">
                {t('reservations.bookingModal.guestName', 'Guest Name')}*
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  id="guest_id"
                  name="guest_id"
                  required
                  value={formData.guest_id || ''}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm"
                  disabled={isLoadingGuests}
                >
                  <option value="" disabled>{isLoadingGuests ? t('common.loading', 'Loading...') : t('reservations.bookingModal.selectGuest', 'Select Guest')}</option>
                  {guestsList.map(guest => (
                    <option key={guest.id} value={guest.id}>{guest.name} ({guest.email})</option>
                  ))}
                </select>
              </div>
               <button type="button" onClick={() => navigate('/guests/new')} className="text-xs text-blue-400 hover:underline mt-1">{t('guests.addNewShort', 'Add New Guest')}</button>
            </div>

            <div>
              <label htmlFor="room_id" className="block text-sm font-medium text-slate-300 mb-1.5">
                {t('reservations.bookingModal.roomNumber', 'Room')}*
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  id="room_id"
                  name="room_id"
                  required
                  value={formData.room_id || ''}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm"
                  disabled={isLoadingRooms}
                >
                  <option value="" disabled>{isLoadingRooms ? t('common.loading', 'Loading...') : t('reservations.bookingModal.selectRoom', 'Select Room')}</option>
                  {roomsList.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.room_number} ({t(`rooms.types.${room.type.toLowerCase()}`, room.type)}, ${room.price_per_night.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="check_in_date" className="block text-sm font-medium text-slate-300 mb-1.5">
                {t('reservations.bookingModal.checkIn', 'Check-in Date')}*
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="check_in_date"
                  name="check_in_date"
                  type="date"
                  required
                  value={formData.check_in_date || ''}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="check_out_date" className="block text-sm font-medium text-slate-300 mb-1.5">
                {t('reservations.bookingModal.checkOut', 'Check-out Date')}*
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="check_out_date"
                  name="check_out_date"
                  type="date"
                  required
                  value={formData.check_out_date || ''}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="total_amount" className="block text-sm font-medium text-slate-300 mb-1.5">
                {t('reservations.bookingModal.amount', 'Total Amount')}*
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="total_amount"
                  name="total_amount"
                  type="number"
                  step="0.01"
                  required
                  value={formData.total_amount || ''}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm"
                  placeholder={t('reservations.bookingModal.amountPlaceholder', 'Enter amount')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="payment_method" className="block text-sm font-medium text-slate-300 mb-1.5">
                {t('reservations.bookingModal.paymentMethod', 'Payment Method')}
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  id="payment_method"
                  name="payment_method"
                  value={formData.payment_method || 'credit_card'}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm"
                >
                  <option value="credit_card">{t('reservations.bookingModal.paymentMethods.creditCard', 'Credit Card')}</option>
                  <option value="cash">{t('reservations.bookingModal.paymentMethods.cash', 'Cash')}</option>
                  <option value="bank_transfer">{t('reservations.bookingModal.paymentMethods.bankTransfer', 'Bank Transfer')}</option>
                  <option value="other">{t('reservations.bookingModal.paymentMethods.other', 'Other')}</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="payment_status" className="block text-sm font-medium text-slate-300 mb-1.5">
                {t('reservations.bookingModal.paymentStatus', 'Payment Status')}
              </label>
              <select
                id="payment_status"
                name="payment_status"
                value={formData.payment_status || 'pending'}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-sm"
              >
                <option value="pending">{t('reservations.bookingModal.paymentStatuses.pending', 'Pending')}</option>
                <option value="paid">{t('reservations.bookingModal.paymentStatuses.paid', 'Paid')}</option>
                <option value="partially_paid">{t('reservations.bookingModal.paymentStatuses.partiallyPaid', 'Partially Paid')}</option>
                <option value="refunded">{t('reservations.bookingModal.paymentStatuses.refunded', 'Refunded')}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-2 px-5 text-sm"
              disabled={isSubmitting}
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              className="btn-primary py-2 px-5 text-sm"
              disabled={isSubmitting || isLoadingGuests || isLoadingRooms}
            >
              {isSubmitting ? t('common.creating', 'Creating...') : t('reservations.bookingModal.createBooking', 'Create Booking')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;