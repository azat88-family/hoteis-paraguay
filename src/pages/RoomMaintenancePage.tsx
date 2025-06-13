import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit3, Trash2, Tool, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  getMaintenanceRequests,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  MaintenanceRequest,
  CreateMaintenanceRequestData,
  UpdateMaintenanceRequestData,
} from '../apiService/maintenanceService';
import { getRooms, Room, updateRoom as updateRoomStatusService } from '../apiService/roomService';

const RoomMaintenancePage: React.FC = () => {
  const { id: roomIdFromParams } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRequestData, setNewRequestData] = useState<Partial<CreateMaintenanceRequestData>>({
    room_id: roomIdFromParams ? parseInt(roomIdFromParams) : undefined,
    description: '',
    priority: 'medium',
  });
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);


  const fetchMaintenanceData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [maintenanceData, roomsData] = await Promise.all([
        getMaintenanceRequests(), // Consider filtering by roomIdFromParams if API supports it
        getRooms()
      ]);
      if (roomIdFromParams) {
        setRequests(maintenanceData.filter(req => req.room_id === parseInt(roomIdFromParams)));
      } else {
        setRequests(maintenanceData);
      }
      setRooms(roomsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.unknownError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, [roomIdFromParams, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingRequest) {
        setEditingRequest(prev => prev ? { ...prev, [name]: value } : null);
    } else {
        setNewRequestData(prev => ({ ...prev, [name]: name === 'room_id' ? parseInt(value) : value }));
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestData.room_id || !newRequestData.description) {
      setError(t('maintenance.errors.allFieldsRequired', 'Room and description are required.'));
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await createMaintenanceRequest(newRequestData as CreateMaintenanceRequestData);
      setSuccessMessage(t('maintenance.success.requestCreated', 'Maintenance request created.'));
      setShowCreateForm(false);
      setNewRequestData({ room_id: roomIdFromParams ? parseInt(roomIdFromParams) : undefined, description: '', priority: 'medium' });
      fetchMaintenanceData(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.unknownError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRequest = async (request: MaintenanceRequest | null) => {
    if (!request) return;
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
        const updateData: UpdateMaintenanceRequestData = {
            description: request.description,
            priority: request.priority,
            status: request.status,
            room_id: request.room_id,
            completed_at: request.status === 'completed' ? (request.completed_at || new Date().toISOString()) : null
        };
      await updateMaintenanceRequest(request.id, updateData);
      setSuccessMessage(t('maintenance.success.requestUpdated', 'Maintenance request updated.'));
      setEditingRequest(null);
      fetchMaintenanceData(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.unknownError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoomStatusChange = async (newStatus: 'available' | 'maintenance') => {
    if (!roomIdFromParams) return;
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await updateRoomStatusService(parseInt(roomIdFromParams), { status: newStatus });
      setSuccessMessage(t('maintenance.success.roomStatusUpdated', `Room status updated to ${newStatus}.`));
      // Optionally refresh room data or navigate away
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.unknownError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentRoom = roomIdFromParams ? rooms.find(r => r.id === parseInt(roomIdFromParams)) : null;

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <Link to={roomIdFromParams ? `/rooms/${roomIdFromParams}` : "/rooms"} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
          <ArrowLeft size={20} className="text-slate-300" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {roomIdFromParams
            ? t('maintenance.titleRoom', { roomId: currentRoom?.room_number || roomIdFromParams })
            : t('maintenance.titleAll', 'All Maintenance Requests')}
        </h1>
      </div>

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

      {/* Room Status Quick Actions if specific room */}
      {roomIdFromParams && currentRoom && (
        <div className="bg-slate-800 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            {t('maintenance.roomStatusActionsTitle', 'Room Status Actions')} (Room {currentRoom.room_number})
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleRoomStatusChange('maintenance')}
              disabled={isSubmitting || currentRoom.status === 'maintenance'}
              className="btn-warning py-2 px-4 text-sm flex items-center justify-center gap-2"
            >
              <Tool size={16} /> {t('maintenance.putInMaintenance', 'Set to Maintenance')}
            </button>
            <button
              onClick={() => handleRoomStatusChange('available')}
              disabled={isSubmitting || currentRoom.status === 'available'}
              className="btn-success py-2 px-4 text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} /> {t('maintenance.setAvailable', 'Set to Available')}
            </button>
          </div>
           {currentRoom.status && <p className="text-sm text-slate-400 mt-2">{t('rooms.currentStatus', 'Current room status:')} <span className="font-semibold text-slate-200">{t(`rooms.status.${currentRoom.status.toLowerCase()}`, currentRoom.status)}</span></p>}
        </div>
      )}

      {/* Create New Request Form */}
      <div className="mb-6">
        {!showCreateForm && (
          <button onClick={() => setShowCreateForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> {t('maintenance.addNewRequest', 'New Maintenance Request')}
          </button>
        )}
        {showCreateForm && (
          <form onSubmit={handleCreateRequest} className="bg-slate-800 p-4 rounded-lg space-y-4">
            <h2 className="text-xl font-semibold text-white">{t('maintenance.createFormTitle', 'Create New Request')}</h2>
            {!roomIdFromParams && (
              <div>
                <label htmlFor="room_id" className="block text-sm font-medium text-slate-300 mb-1">
                  {t('maintenance.room', 'Room')}*
                </label>
                <select
                  id="room_id"
                  name="room_id"
                  value={newRequestData.room_id || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-700 border-slate-600"
                >
                  <option value="" disabled>{t('maintenance.selectRoom', 'Select a room')}</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.room_number} - {room.type}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
                {t('maintenance.description', 'Description')}*
              </label>
              <textarea
                id="description"
                name="description"
                value={newRequestData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full bg-slate-700 border-slate-600"
              />
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-slate-300 mb-1">
                {t('maintenance.priority', 'Priority')}
              </label>
              <select
                id="priority"
                name="priority"
                value={newRequestData.priority}
                onChange={handleInputChange}
                className="w-full bg-slate-700 border-slate-600"
              >
                <option value="low">{t('maintenance.priorities.low', 'Low')}</option>
                <option value="medium">{t('maintenance.priorities.medium', 'Medium')}</option>
                <option value="high">{t('maintenance.priorities.high', 'High')}</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? t('common.submitting', 'Submitting...') : t('common.submit', 'Submit Request')}
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="btn-secondary">
                {t('common.cancel', 'Cancel')}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* List of Maintenance Requests */}
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">{t('maintenance.requestListTitle', 'Maintenance Log')}</h2>
            <button onClick={fetchMaintenanceData} className="p-2 hover:bg-slate-700 rounded-full" title={t('common.refresh', 'Refresh list')}>
                <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </button>
        </div>
        {isLoading && !requests.length ? (
          <p className="text-slate-400">{t('common.loading', 'Loading requests...')}</p>
        ) : requests.length === 0 ? (
          <p className="text-slate-400">{t('maintenance.noRequests', 'No maintenance requests found for this room/selection.')}</p>
        ) : (
          <div className="space-y-3">
            {requests.map(req => (
              <div key={req.id} className="bg-slate-700 p-3 rounded-md">
                {editingRequest?.id === req.id ? (
                    <div className="space-y-3">
                        <textarea name="description" value={editingRequest.description} onChange={handleInputChange} rows={2} className="w-full bg-slate-600 text-sm"/>
                        <div className="grid grid-cols-2 gap-3">
                            <select name="priority" value={editingRequest.priority} onChange={handleInputChange} className="bg-slate-600 text-sm">
                                <option value="low">{t('maintenance.priorities.low')}</option>
                                <option value="medium">{t('maintenance.priorities.medium')}</option>
                                <option value="high">{t('maintenance.priorities.high')}</option>
                            </select>
                            <select name="status" value={editingRequest.status} onChange={handleInputChange} className="bg-slate-600 text-sm">
                                <option value="pending">{t('maintenance.statuses.pending')}</option>
                                <option value="in_progress">{t('maintenance.statuses.inProgress', 'In Progress')}</option>
                                <option value="completed">{t('maintenance.statuses.completed')}</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleUpdateRequest(editingRequest)} className="btn-success py-1 px-2 text-xs" disabled={isSubmitting}>{isSubmitting ? t('common.saving') : t('common.save')}</button>
                            <button onClick={() => setEditingRequest(null)} className="btn-secondary py-1 px-2 text-xs">{t('common.cancel')}</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-slate-100">
                                {t('maintenance.room', 'Room')}: {rooms.find(r => r.id === req.room_id)?.room_number || req.room_id} - <span className="text-sm text-slate-300">{req.description}</span>
                                </p>
                                <p className="text-xs text-slate-400">
                                {t('maintenance.reportedAt', 'Reported:')} {new Date(req.reported_at).toLocaleDateString()} - Priority: {t(`maintenance.priorities.${req.priority}` as const, req.priority)}
                                </p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    req.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                    req.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-slate-500/20 text-slate-400'
                                }`}>
                                    {t(`maintenance.statuses.${req.status.replace(/_/g, '')}` as const, req.status)}
                                </span>
                                <button onClick={() => setEditingRequest({...req})} className="p-1 hover:bg-slate-600 rounded"> <Edit3 size={14} /> </button>
                            </div>
                        </div>
                        {req.completed_at && <p className="text-xs text-slate-500 mt-1">{t('maintenance.completedAt', 'Completed:')} {new Date(req.completed_at).toLocaleDateString()}</p>}
                    </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomMaintenancePage;
