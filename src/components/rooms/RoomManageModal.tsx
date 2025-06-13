import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Settings, Info, History, Tool, CheckCircle } from 'lucide-react'; // Simplified icons for brevity
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Room } from '../../apiService/roomService';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import { updateRoom } from '../../apiService/roomService'; // For actual status update

interface RoomManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  onRoomUpdate?: (updatedRoom: Room) => void; // Callback for when room data changes
}

const RoomManageModal: React.FC<RoomManageModalProps> = ({ isOpen, onClose, room, onRoomUpdate }) => {
  const { user } = useAuth(); // Get user from AuthContext
  const [activeTab, setActiveTab] = useState<'details' | 'status' | 'maintenanceHistory' | 'bookingHistory'>('details');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState<string | null>(null);


  // Define roles
  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner';
  const isAttendant = user?.role === 'attendant';

  const canManageAllRoomSettings = isAdmin || isOwner;
  const canPerformBasicRoomOps = isAdmin || isOwner || isAttendant;


  // Reset tab when room changes or modal reopens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('details');
    }
  }, [isOpen, room]);


  const handleNewBookingClick = () => {
    // Potentially pass room.id to pre-fill in NewGuest page
    navigate(`/guests/new?roomId=${room.id}`);
    onClose();
  };

  const handleNavigateToMaintenancePage = () => {
    navigate(`/rooms/${room.id}/maintenance`); // Navigate to the dedicated maintenance page
    onClose();
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!canPerformBasicRoomOps) {
        setStatusUpdateError(t('common.unauthorizedAction'));
        return;
    }
    // Attendant role restrictions
    if (isAttendant && !['cleaning', 'available'].includes(newStatus)) {
        setStatusUpdateError(t('room.modal.errors.attendantStatusRestricted', 'Attendants can only set status to Cleaning or Available.'));
        return;
    }

    setIsSubmittingStatus(true);
    setStatusUpdateError(null);
    setStatusUpdateSuccess(null);
    try {
      const updatedRoomData = await updateRoom(room.id, { status: newStatus });
      if (onRoomUpdate) {
        onRoomUpdate(updatedRoomData); // Update state in parent if callback provided
      }
      setStatusUpdateSuccess(t('room.modal.success.statusUpdated', 'Room status updated successfully!'));
    } catch (error) {
      setStatusUpdateError(error instanceof Error ? error.message : t('common.unknownError'));
      console.error("Failed to update room status", error);
    } finally {
      setIsSubmittingStatus(false);
    }
  };


  if (!isOpen) return null;

  const availableStatuses = ['available', 'occupied', 'reserved', 'cleaning', 'maintenance'];
  const attendantAllowedStatuses = ['cleaning', 'available'];


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in-fast">
      <div className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="p-5 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              {t('room.modal.title', { number: room.room_number })}
            </h2>
            <p className="text-slate-400 text-sm">
              {t(`rooms.types.${room.type.toLowerCase()}`, room.type)} - {t(`rooms.beds.${room.beds.toLowerCase()}`, room.beds)}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors" aria-label={t('common.close', 'Close')}>
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-slate-700 overflow-x-auto">
          <button
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'details'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setActiveTab('details')}
          >
            <Info size={16} /> {t('room.modal.tabs.details')}
          </button>
          {canPerformBasicRoomOps && (
            <button
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'status'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => setActiveTab('status')}
            >
              <Settings size={16} /> {t('room.modal.tabs.status', 'Status')}
            </button>
          )}
          <button
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'bookingHistory'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setActiveTab('bookingHistory')}
          >
            <History size={16} /> {t('room.modal.tabs.history', 'Booking History')}
          </button>
          {canPerformBasicRoomOps && (
            <button
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'maintenanceHistory'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => setActiveTab('maintenanceHistory')}
            >
              <Tool size={16} /> {t('room.modal.tabs.maintenance', 'Maintenance')}
            </button>
          )}
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Room Information Section */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">{t('room.modal.info')}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <label className="block text-slate-400">{t('room.modal.roomType')}</label>
                    <p className="font-medium text-slate-200">{t(`rooms.types.${room.type.toLowerCase()}`, room.type)}</p>
                  </div>
                  <div>
                    <label className="block text-slate-400">{t('room.modal.bedType')}</label>
                    <p className="font-medium text-slate-200">{t(`rooms.beds.${room.beds.toLowerCase()}`, room.beds)}</p>
                  </div>
                  <div>
                    <label className="block text-slate-400">{t('room.modal.capacity')}</label>
                    <p className="font-medium text-slate-200">{room.capacity} {t(room.capacity > 1 ? 'rooms.guests' : 'rooms.guest', { count: room.capacity })}</p>
                  </div>
                  <div>
                    <label className="block text-slate-400">{t('room.modal.price')}</label>
                    <p className="font-medium text-slate-200">${room.price_per_night.toFixed(2)} / {t('room.modal.night', 'night')}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-400">{t('room.modal.status')}</label>
                    <p className="font-medium text-slate-200">{t(`rooms.status.${room.status.toLowerCase()}`, room.status)}</p>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              {room.features && room.features.length > 0 && (
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-3">{t('room.modal.features')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.features.map((feature, index) => (
                      <span key={index} className="bg-slate-600 px-3 py-1 rounded-full text-sm text-slate-300">
                        {t(`rooms.features.${feature.toLowerCase().replace(/\s+/g, '')}`, feature)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Guest Section - Simplified */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">{t('room.modal.currentGuest')}</h3>
                {(room.status === 'occupied' || room.status === 'reserved') ? (
                   <div className="text-center py-4">
                    <User size={32} className="mx-auto text-slate-400 mb-2" />
                     <p className="text-slate-300">
                       {t('room.modal.guestInfoPlaceholder', 'Guest information and check-out option would appear here if a guest is assigned via a reservation.')}
                     </p>
                     {/* Placeholder for future "View Reservation" button */}
                   </div>
                ) : (
                  <div className="text-center py-4">
                    <User size={32} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-300">{t('room.modal.noGuestCurrently')}</p>
                    {canPerformBasicRoomOps && (
                        <button onClick={handleNewBookingClick} className="btn-primary mt-3 py-2 px-4 text-sm">
                        {t('room.modal.newBooking')}
                        </button>
                    )}
                  </div>
                )}
              </div>
              {/* Placeholder for other quick actions like Update Price, Remove Room - shown only to admin/owner */}
              {(isAdmin || isOwner) && (
                <div className="bg-slate-700 p-4 rounded-lg mt-4">
                    <h3 className="text-lg font-semibold text-white mb-3">{t('room.modal.adminActions', 'Admin Actions')}</h3>
                    <div className="flex gap-3">
                        <button className="btn-secondary-outline text-sm" disabled>{t('room.modal.updatePrice', 'Update Price (N/A)')}</button>
                        <button className="btn-danger-outline text-sm" disabled>{t('room.modal.removeRoom', 'Remove Room (N/A)')}</button>
                    </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'status' && canPerformBasicRoomOps && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">{t('room.modal.updateStatus.title', 'Update Room Status')}</h3>

              {statusUpdateError && <p className="text-sm text-red-400 bg-red-900 p-2 rounded">{statusUpdateError}</p>}
              {statusUpdateSuccess && <p className="text-sm text-green-400 bg-green-900 p-2 rounded">{statusUpdateSuccess}</p>}

              <p className="text-slate-400 text-sm">
                {t('room.modal.updateStatus.current', 'Current status:')} <span className="font-semibold text-slate-200">{t(`rooms.status.${room.status.toLowerCase()}`, room.status)}</span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableStatuses.map(statusKey => {
                  // Determine if the current user can set this status
                  const canSetThisStatus = canManageAllRoomSettings || (isAttendant && attendantAllowedStatuses.includes(statusKey));

                  return (
                    <button
                      key={statusKey}
                      onClick={() => handleStatusChange(statusKey)}
                      className={`btn-secondary py-2 px-3 text-sm ${room.status === statusKey ? 'ring-2 ring-blue-500' : ''}`}
                      disabled={!canSetThisStatus || isSubmittingStatus || room.status === statusKey}
                      title={!canSetThisStatus ? t('common.unauthorizedAction') : undefined}
                    >
                      {isSubmittingStatus && room.status !== statusKey ? <CheckCircle className="animate-spin h-4 w-4 mr-1.5" /> : null}
                      {t(`rooms.status.${statusKey.toLowerCase()}`, statusKey)}
                    </button>
                  );
                })}
              </div>
              {!canManageAllRoomSettings && isAttendant && (
                <p className="text-xs text-slate-500">{t('room.modal.attendantNote', 'Attendants can only set status to Cleaning or Available.')}</p>
              )}
            </div>
          )}

          {activeTab === 'bookingHistory' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">{t('room.modal.bookingHistory')}</h3>
              <p className="text-slate-400">{t('common.notImplemented', 'This feature is not yet implemented.')}</p>
              {/* Search and table for booking history would go here */}
            </div>
          )}

          {activeTab === 'maintenanceHistory' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">{t('room.modal.maintenanceLog')}</h3>
                {canPerformBasicRoomOps && (
                  <button onClick={handleNavigateToMaintenancePage} className="btn-primary py-2 px-4 text-sm">
                    {t('room.modal.addOrViewRecords', 'Add/View Records')}
                  </button>
                )}
              </div>
               <p className="text-slate-400">{t('common.notImplementedShort', 'Viewing maintenance history in this modal is not yet implemented. Click "Add/View Records" to manage maintenance.')}</p>
              {/* Maintenance log list would go here */}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-750 border-t border-slate-700 mt-auto">
            <button
                onClick={onClose}
                className="btn-secondary w-full py-2.5"
            >
                {t('common.close', 'Close')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default RoomManageModal;