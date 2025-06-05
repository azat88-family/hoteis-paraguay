import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CreditCard, Calendar, User, Home, DollarSign } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  selectedRoom?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, selectedDate, selectedRoom }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    checkOut: '',
    roomNumber: selectedRoom || '',
    paymentStatus: 'pending',
    paymentMethod: 'credit_card',
    amount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the booking submission
    console.log('Booking data:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">{t('reservations.bookingModal.title', 'New Booking')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('reservations.bookingModal.guestName', 'Guest Name')}*
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2"
                  placeholder={t('reservations.bookingModal.guestNamePlaceholder', 'Enter guest name')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('reservations.bookingModal.email', 'Email')}*
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2"
                placeholder={t('reservations.bookingModal.emailPlaceholder', 'Enter email address')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('reservations.bookingModal.phone', 'Phone Number')}*
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2"
                placeholder={t('reservations.bookingModal.phonePlaceholder', 'Enter phone number')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('reservations.bookingModal.roomNumber', 'Room Number')}*
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  className="w-full pl-10 pr-4 py-2"
                  placeholder={t('reservations.bookingModal.roomNumberPlaceholder', 'Enter room number')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('reservations.bookingModal.checkIn', 'Check-in Date')}*
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  required
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  className="w-full pl-10 pr-4 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('reservations.bookingModal.checkOut', 'Check-out Date')}*
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  required
                  value={formData.checkOut}
                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                  className="w-full pl-10 pr-4 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('reservations.bookingModal.amount', 'Amount')}*
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-10 pr-4 py-2"
                  placeholder={t('reservations.bookingModal.amountPlaceholder', 'Enter amount')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('reservations.bookingModal.paymentMethod', 'Payment Method')}*
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full pl-10 pr-4 py-2"
                >
                  <option value="credit_card">{t('reservations.bookingModal.paymentMethods.creditCard', 'Credit Card')}</option>
                  <option value="debit_card">{t('reservations.bookingModal.paymentMethods.debitCard', 'Debit Card')}</option>
                  <option value="cash">{t('reservations.bookingModal.paymentMethods.cash', 'Cash')}</option>
                  <option value="bank_transfer">{t('reservations.bookingModal.paymentMethods.bankTransfer', 'Bank Transfer')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('reservations.bookingModal.paymentStatus', 'Payment Status')}
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                className="w-full px-4 py-2"
              >
                <option value="pending">{t('reservations.bookingModal.paymentStatuses.pending', 'Pending')}</option>
                <option value="paid">{t('reservations.bookingModal.paymentStatuses.paid', 'Paid')}</option>
                <option value="partially_paid">{t('reservations.bookingModal.paymentStatuses.partiallyPaid', 'Partially Paid')}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              {t('reservations.bookingModal.createBooking', 'Create Booking')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;